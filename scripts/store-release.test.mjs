import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, writeFile, cp, mkdtemp, mkdir, rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHmac} from 'node:crypto';
import {prepareRelease, verifyRelease, releaseVersion, validateVersions, submissionGate, submitRelease, readZipEntries} from './store-release.mjs';
import {submitToStore, amoToken} from './store-release-api.mjs';
import {zipEntries} from './zip.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const commit = '0123456789abcdef0123456789abcdef01234567';
const allowed = {GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'Yoavfried/SlotDesk', GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_REF: 'refs/tags/v1.0.1', SLOTDESK_STORE_SUBMISSION_ENABLED: 'true', SLOTDESK_SUBMISSION_APPROVED_TAG: 'v1.0.1', SLOTDESK_EXPECTED_COMMIT: commit};
const metadata = {version: '1.0.1', commit};
const files = new Map([
  ['SlotDesk-1.0.1-Chromium-store.zip', Buffer.from('synthetic-chromium')],
  ['SlotDesk-1.0.1-Firefox-unsigned.xpi', Buffer.from('synthetic-firefox')],
  ['SlotDesk-1.0.1-Firefox-source.zip', Buffer.from('synthetic-source')]
]);
const response = (value, status = 200, headers = {}) => new Response(value === null ? null : JSON.stringify(value), {status, headers});

test('stable tags must match both version sources and extension limits', () => {
  assert.equal(releaseVersion('v1.0.1'), '1.0.1');
  assert.equal(releaseVersion('v0.9.5.9'), '0.9.5.9');
  for (const tag of ['main', 'v1.0', 'v1.0.1-beta', 'v01.0.1', 'v65536.0.0', 'v1.0.1\n']) assert.throws(() => releaseVersion(tag));
  assert.throws(() => validateVersions('v1.0.1', {version: '1.0.1'}, {version: '1.0.0'}));
});

test('pushes, pull requests, forks, missing flags and unapproved tags cannot submit', async () => {
  for (const override of [
    {GITHUB_EVENT_NAME: 'push'}, {GITHUB_EVENT_NAME: 'pull_request'}, {GITHUB_EVENT_NAME: 'pull_request_target'},
    {GITHUB_REPOSITORY: 'someone/SlotDesk'}, {GITHUB_ACTIONS: 'false'},
    {GITHUB_REF: 'refs/heads/main'}, {GITHUB_REF: 'refs/tags/v1.0.2'}, {GITHUB_REF: ''},
    {SLOTDESK_STORE_SUBMISSION_ENABLED: ''}, {SLOTDESK_SUBMISSION_APPROVED_TAG: 'v1.0.2'}
  ]) {
    let called = 0;
    await assert.rejects(submitRelease({directory: 'does-not-exist', tag: 'v1.0.1', store: 'chrome', env: {...allowed, ...override}, submit: async () => called++}));
    assert.equal(called, 0);
  }
  assert.doesNotThrow(() => submissionGate({env: allowed, tag: 'v1.0.1', store: 'chrome'}));
  assert.doesNotThrow(() => submissionGate({env: {...allowed, GITHUB_EVENT_NAME: 'release'}, tag: 'v1.0.1', store: 'firefox'}));
});

test('preparation uses a temporary build, preserves dist, and verifies the actual source ZIP rebuild', async () => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'slotdesk-release-test-'));
  const previousFetch = globalThis.fetch;
  const previousRef = process.env.GITHUB_REF;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Preparation must stay offline.'); };
  process.env.GITHUB_REF = 'refs/heads/main';
  try {
    const fixture = path.join(temporary, 'repository'), output = path.join(temporary, 'bundle');
    await mkdir(path.join(fixture, 'scripts'), {recursive: true});
    await cp(path.join(root, 'extension'), path.join(fixture, 'extension'), {recursive: true});
    for (const filename of ['package-slotdesk.mjs', 'browser-targets.mjs', 'store-distribution.mjs', 'zip.mjs']) await cp(path.join(root, 'scripts', filename), path.join(fixture, 'scripts', filename));
    await cp(path.join(root, 'LICENSE'), path.join(fixture, 'LICENSE'));
    await cp(path.join(root, 'package.json'), path.join(fixture, 'package.json'));
    await mkdir(path.join(fixture, 'dist'));
    await writeFile(path.join(fixture, 'dist', 'keep.txt'), 'historic artifact');
    const manifest = JSON.parse(await readFile(path.join(fixture, 'extension', 'manifest.json'), 'utf8'));
    const tag = `v${manifest.version}`;
    await assert.rejects(prepareRelease({directory: fixture, output: path.join(fixture, 'dist'), tag, commit, verifyGit: false}), /normal dist/);
    const result = await prepareRelease({directory: fixture, output, tag, commit, verifyGit: false});
    assert.equal(result.firefoxSourceRebuild, 'byte-identical');
    assert.equal(calls, 0);
    assert.equal(await readFile(path.join(fixture, 'dist', 'keep.txt'), 'utf8'), 'historic artifact');
    const bundle = await verifyRelease(output, tag);
    const sourceEntries = readZipEntries(bundle.files.get(`SlotDesk-${manifest.version}-Firefox-source.zip`));
    assert.ok(sourceEntries.some(entry => entry.name === 'BUILD-INSTRUCTIONS.txt' && entry.data.includes(Buffer.from(commit))));
    assert.ok(sourceEntries.every(entry => entry.name.startsWith('extension/') || entry.name.startsWith('scripts/') || ['LICENSE', 'BUILD-INSTRUCTIONS.txt'].includes(entry.name)));
    assert.ok(!sourceEntries.some(entry => entry.name.includes('.git/') || entry.name.startsWith('backend/')));
    await assert.rejects(prepareRelease({directory: fixture, output, tag, commit, verifyGit: false}), /never overwritten/);
    let submitted = 0;
    await assert.rejects(submitRelease({directory: output, tag, store: 'chrome', env: {...allowed, GITHUB_REF: `refs/tags/${tag}`, SLOTDESK_SUBMISSION_APPROVED_TAG: tag, SLOTDESK_EXPECTED_COMMIT: 'f'.repeat(40)}, submit: async () => submitted++}), /Artifact commit/);
    assert.equal(submitted, 0);
    const packageFile = path.join(output, `SlotDesk-${manifest.version}-Chromium-store.zip`);
    await writeFile(packageFile, Buffer.from('modified package'));
    await assert.rejects(verifyRelease(output, tag), /Checksum mismatch/);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousRef === undefined) delete process.env.GITHUB_REF;
    else process.env.GITHUB_REF = previousRef;
    assert.equal(path.dirname(path.resolve(temporary)), path.resolve(tmpdir()));
    assert.ok(path.basename(temporary).startsWith('slotdesk-release-test-'));
    await rm(temporary, {recursive: true, force: true});
  }
});

test('source ZIP reader rejects traversal, duplicate paths and Windows drive paths', () => {
  for (const names of [['../outside'], ['C:/outside'], ['file', 'file']]) assert.throws(() => readZipEntries(zipEntries(names.map(name => ({name, data: Buffer.from('x')})))));
});

test('Chrome adapter confirms identity/version and requests review with blocking warnings', async () => {
  const calls = [], results = [
    response({publishedItemRevisionStatus: {state: 'PUBLISHED', distributionChannels: [{crxVersion: '1.0.0'}]}}),
    response({uploadState: 'SUCCEEDED', crxVersion: '1.0.1'}),
    response({state: 'PENDING_REVIEW'})
  ];
  const result = await submitToStore({store: 'chrome', metadata, files, env: {CWS_PUBLISHER_ID: 'publisher', CWS_ITEM_ID: 'a'.repeat(32), CWS_ACCESS_TOKEN: 'synthetic-token'}, fetchImpl: async (url, options) => { calls.push({url, options}); return results.shift(); }});
  assert.equal(result.state, 'PENDING_REVIEW');
  assert.equal(calls.length, 3);
  assert.ok(calls[1].url.includes('/upload/v2/'));
  assert.equal(calls[1].options.body, files.get('SlotDesk-1.0.1-Chromium-store.zip'));
  assert.deepEqual(JSON.parse(calls[2].options.body), {publishType: 'DEFAULT_PUBLISH', skipReview: false, blockOnWarnings: true});
  assert.ok(calls.every(call => call.options.redirect === 'error'));
});

test('Chrome does not submit asynchronous/unconfirmed uploads or another pending revision', async () => {
  for (const pending of [false, true]) {
    const calls = [], results = pending ? [response({submittedItemRevisionStatus: {state: 'PENDING_REVIEW', distributionChannels: [{crxVersion: '1.0.2'}]}})] : [response({publishedItemRevisionStatus: {distributionChannels: [{crxVersion: '1.0.0'}]}}), response({uploadState: 'IN_PROGRESS'})];
    await assert.rejects(submitToStore({store: 'chrome', metadata, files, env: {CWS_PUBLISHER_ID: 'publisher', CWS_ITEM_ID: 'a'.repeat(32), CWS_ACCESS_TOKEN: 'synthetic-token'}, fetchImpl: async (url, options) => { calls.push({url, options}); return results.shift(); }}));
    assert.ok(!calls.some(call => call.url.endsWith(':publish')));
  }
});

test('Edge waits for its upload operation, then submits exactly once', async () => {
  const id = '00000000-0000-0000-0000-000000000001', calls = [];
  const results = [response(null, 202, {location: id}), response({status: 'InProgress'}), response({status: 'Succeeded'}), response(null, 202, {location: id}), response({status: 'Succeeded'})];
  const result = await submitToStore({store: 'edge', metadata, files, env: {EDGE_PRODUCT_ID: id, EDGE_CLIENT_ID: 'synthetic-client', EDGE_API_KEY: 'synthetic-key', EDGE_FIRST_PUBLICATION_COMPLETE: 'true'}, sleep: async () => {}, fetchImpl: async (url, options) => { calls.push({url, options}); return results.shift(); }});
  assert.equal(result.state, 'submitted-for-certification');
  assert.equal(calls.filter(call => call.options.method === 'POST').length, 2);
  assert.equal(calls[0].options.body, files.get('SlotDesk-1.0.1-Chromium-store.zip'));
});

test('Mozilla uploads the matching source archive only after successful listed validation', async () => {
  const guid = '{39c56104-958b-43a6-bcfe-5e9db811c74b}', uuid = '00000000-0000-0000-0000-000000000002', calls = [];
  const results = [response({guid, current_version: {version: '1.0.0'}}), response({}, 404), response({uuid}), response({processed: true, valid: true, version: '1.0.1', channel: 'listed'}), response({id: 123})];
  const result = await submitToStore({store: 'firefox', metadata, files, env: {AMO_API_KEY: 'synthetic-issuer', AMO_API_SECRET: 'synthetic-secret'}, fetchImpl: async (url, options) => { calls.push({url, options}); return results.shift(); }});
  assert.equal(result.versionId, 123);
  const upload = calls[2].options.body, version = calls[4].options.body;
  assert.equal(upload.get('channel'), 'listed');
  assert.equal(await upload.get('upload').text(), 'synthetic-firefox');
  assert.equal(version.get('upload'), uuid);
  assert.equal(await version.get('source').text(), 'synthetic-source');
  assert.equal(version.get('license'), 'MIT');
});

test('Mozilla stops before version creation if validation fails', async () => {
  const guid = '{39c56104-958b-43a6-bcfe-5e9db811c74b}', calls = [];
  const results = [response({guid, current_version: {version: '1.0.0'}}), response({}, 404), response({uuid: '00000000-0000-0000-0000-000000000002'}), response({processed: true, valid: false})];
  await assert.rejects(submitToStore({store: 'firefox', metadata, files, env: {AMO_API_KEY: 'synthetic-issuer', AMO_API_SECRET: 'synthetic-secret'}, fetchImpl: async (url, options) => { calls.push({url, options}); return results.shift(); }}), /validation failed/);
  assert.equal(calls.filter(call => call.options.method === 'POST').length, 1);
});

test('Mozilla JWT has a short expiry and a valid HMAC without exposing secrets', () => {
  const token = amoToken('synthetic-issuer', 'synthetic-secret', 1000);
  const [header, payload, signature] = token.split('.');
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
  assert.equal(decoded.exp - decoded.iat, 60);
  assert.equal(decoded.iss, 'synthetic-issuer');
  assert.equal(signature, createHmac('sha256', 'synthetic-secret').update(`${header}.${payload}`).digest('base64url'));
});

test('ambiguous store write failures are not automatically retried or echoed', async () => {
  let calls = 0;
  await assert.rejects(submitToStore({store: 'edge', metadata, files, env: {EDGE_PRODUCT_ID: '00000000-0000-0000-0000-000000000001', EDGE_CLIENT_ID: 'synthetic-client', EDGE_API_KEY: 'secret-not-to-log', EDGE_FIRST_PUBLICATION_COMPLETE: 'true'}, fetchImpl: async () => { calls++; throw new Error('secret-not-to-log'); }}), error => !error.message.includes('secret-not-to-log') && error.message.includes('before retrying'));
  assert.equal(calls, 1);
});
