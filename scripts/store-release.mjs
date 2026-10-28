import {readFile, writeFile, readdir, mkdir, mkdtemp, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {zipEntries} from './zip.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceScripts = ['package-slotdesk.mjs', 'browser-targets.mjs', 'store-distribution.mjs', 'zip.mjs'];
export const sha256 = data => createHash('sha256').update(data).digest('hex');

export function releaseVersion(tag) {
  if (!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*))?$/.test(tag || '')) {
    throw new Error('Use a stable release tag such as v1.0.1; branches and prerelease tags cannot submit.');
  }
  const version = tag.slice(1);
  if (version.split('.').some(part => Number(part) > 65535)) throw new Error('Release version exceeds extension manifest limits.');
  return version;
}

export function validateVersions(tag, manifest, packageInfo) {
  const version = releaseVersion(tag);
  if (manifest.version !== version || packageInfo.version !== version) {
    throw new Error('Release tag, extension manifest and package.json versions must match.');
  }
  return version;
}

function git(directory, ...args) {
  return execFileSync('git', ['-C', directory, ...args], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim();
}

export function validateCheckout(directory, tag) {
  releaseVersion(tag);
  const commit = git(directory, 'rev-parse', 'HEAD');
  if (git(directory, 'rev-parse', `refs/tags/${tag}^{commit}`) !== commit) {
    throw new Error('Checkout must be the exact release tag commit.');
  }
  git(directory, 'merge-base', '--is-ancestor', commit, 'origin/main');
  if (git(directory, 'status', '--porcelain', '--untracked-files=all')) throw new Error('Release checkout must be clean.');
  return commit;
}

async function sourceEntries(directory) {
  const entries = [];
  async function walk(folder, prefix) {
    for (const item of (await readdir(folder, {withFileTypes: true})).sort((a, b) => a.name.localeCompare(b.name))) {
      const name = `${prefix}/${item.name}`, filename = path.join(folder, item.name);
      if (item.isSymbolicLink()) throw new Error('Source archive does not accept symbolic links.');
      if (item.isDirectory()) await walk(filename, name);
      else if (!item.name.endsWith('.test.js') && item.name !== 'README.md') entries.push({name, data: await readFile(filename)});
    }
  }
  await walk(path.join(directory, 'extension'), 'extension');
  for (const filename of sourceScripts) entries.push({name: `scripts/${filename}`, data: await readFile(path.join(directory, 'scripts', filename))});
  entries.push({name: 'LICENSE', data: await readFile(path.join(directory, 'LICENSE'))});
  return entries;
}

async function writeEntries(entries, directory) {
  for (const entry of entries) {
    const filename = path.join(directory, ...entry.name.split('/'));
    await mkdir(path.dirname(filename), {recursive: true});
    await writeFile(filename, entry.data);
  }
}

export async function prepareRelease({directory = root, output, tag, commit, verifyGit = true}) {
  if (!output) throw new Error('An explicit output directory is required.');
  const resolvedOutput = path.resolve(output);
  const canonicalDist = path.resolve(directory, 'dist');
  if (resolvedOutput === canonicalDist || resolvedOutput.startsWith(`${canonicalDist}${path.sep}`)) {
    throw new Error('Release preparation cannot write into the normal dist directory.');
  }
  try {
    if ((await readdir(resolvedOutput)).length) throw new Error('Choose a new empty output directory; existing release artifacts are never overwritten.');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const manifest = JSON.parse(await readFile(path.join(directory, 'extension', 'manifest.json'), 'utf8'));
  const packageInfo = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
  const version = validateVersions(tag, manifest, packageInfo);
  const revision = verifyGit ? validateCheckout(directory, tag) : commit;
  if (!/^[a-f\d]{40}$/i.test(revision || '')) throw new Error('A complete source commit is required.');
  const entries = await sourceEntries(directory);
  const temporary = await mkdtemp(path.join(tmpdir(), 'slotdesk-release-'));
  try {
    const first = path.join(temporary, 'first'), rebuilt = path.join(temporary, 'rebuilt');
    await writeEntries(entries, first);
    execFileSync(process.execPath, ['scripts/package-slotdesk.mjs'], {cwd: first, stdio: 'pipe'});
    const sourceReadme = `SlotDesk ${version} Firefox source\n\nSource commit: ${revision}\n\nBuild runtime: Node.js ${process.versions.node} (${process.platform}/${process.arch}). Use that Node.js version to reproduce the release ZIP bytes. No npm install, dependencies, transpiler or minifier is required.\n\n1. Extract this complete archive into an empty folder.\n2. Run: node scripts/package-slotdesk.mjs\n3. Compare dist/SlotDesk-${version}-Firefox-unsigned.xpi against the submitted unsigned package.\n\nThe packager applies the Firefox manifest and store-specific consent text to the supplied readable source. It also creates other browser targets; those do not affect the Firefox bytes. The submitted extension is signed separately by Mozilla, so compare the unsigned pre-signing package.\n`;
    const source = zipEntries([...entries, {name: 'BUILD-INSTRUCTIONS.txt', data: Buffer.from(sourceReadme)}]);
    // Rebuild from the actual ZIP bytes, rather than trusting the in-memory input list.
    const decoded = readZipEntries(source);
    await writeEntries(decoded.filter(entry => entry.name !== 'BUILD-INSTRUCTIONS.txt'), rebuilt);
    execFileSync(process.execPath, ['scripts/package-slotdesk.mjs'], {cwd: rebuilt, stdio: 'pipe'});
    const firefoxName = `SlotDesk-${version}-Firefox-unsigned.xpi`;
    const firefox = await readFile(path.join(first, 'dist', firefoxName));
    if (!firefox.equals(await readFile(path.join(rebuilt, 'dist', firefoxName)))) throw new Error('Firefox source archive does not rebuild the exact package.');
    await mkdir(resolvedOutput, {recursive: true});
    const files = [];
    for (const filename of [`SlotDesk-${version}-Chromium-store.zip`, firefoxName]) {
      const data = await readFile(path.join(first, 'dist', filename));
      await writeFile(path.join(resolvedOutput, filename), data);
      files.push({filename, sha256: sha256(data)});
    }
    const sourceName = `SlotDesk-${version}-Firefox-source.zip`;
    await writeFile(path.join(resolvedOutput, sourceName), source);
    files.push({filename: sourceName, sha256: sha256(source)});
    const metadata = {schema: 1, tag, version, commit: revision, firefoxSourceRebuild: 'byte-identical', files};
    await writeFile(path.join(resolvedOutput, 'release.json'), JSON.stringify(metadata, null, 2) + '\n');
    await writeFile(path.join(resolvedOutput, 'SHA256SUMS.txt'), files.map(file => `${file.sha256}  ${file.filename}`).join('\n') + '\n');
    return metadata;
  } finally {
    if (path.dirname(path.resolve(temporary)) !== path.resolve(tmpdir()) || !path.basename(temporary).startsWith('slotdesk-release-')) throw new Error('Refused cleanup outside the release temporary directory.');
    await rm(temporary, {recursive: true, force: true});
  }
}

// This reads only ZIPs emitted by our deterministic packager; it also rejects traversal.
export function readZipEntries(zip) {
  const entries = [], names = new Set();
  let offset = 0;
  while (offset + 4 <= zip.length && zip.readUInt32LE(offset) === 0x04034b50) {
    if (offset + 30 > zip.length || zip.readUInt16LE(offset + 8) !== 8) throw new Error('Unexpected package ZIP format.');
    const compressedLength = zip.readUInt32LE(offset + 18), nameLength = zip.readUInt16LE(offset + 26), extraLength = zip.readUInt16LE(offset + 28);
    const nameStart = offset + 30, dataStart = nameStart + nameLength + extraLength, end = dataStart + compressedLength;
    if (end > zip.length) throw new Error('Truncated package ZIP.');
    const name = zip.subarray(nameStart, nameStart + nameLength).toString('utf8');
    if (!name || name.startsWith('/') || name.includes('\\') || name.includes(':') || name.split('/').some(part => !part || part === '..' || part === '.')) throw new Error('Unsafe ZIP entry path.');
    if (names.has(name) || entries.length >= 1000) throw new Error('Duplicate or excessive ZIP entries.');
    names.add(name);
    entries.push({name, compressed: zip.subarray(dataStart, end)});
    offset = end;
  }
  if (!entries.length) throw new Error('Empty or unsupported package ZIP.');
  return entries.map(({name, compressed}) => ({name, data: inflate(compressed, {maxOutputLength: 32 * 1024 * 1024})}));
}

import {inflateRawSync as inflate} from 'node:zlib';

export async function verifyRelease(directory, tag) {
  const metadata = JSON.parse(await readFile(path.join(directory, 'release.json'), 'utf8'));
  if (metadata.schema !== 1 || metadata.tag !== tag || metadata.version !== releaseVersion(tag) || metadata.firefoxSourceRebuild !== 'byte-identical' || !/^[a-f\d]{40}$/i.test(metadata.commit || '')) throw new Error('Invalid release metadata.');
  const expected = [`SlotDesk-${metadata.version}-Chromium-store.zip`, `SlotDesk-${metadata.version}-Firefox-unsigned.xpi`, `SlotDesk-${metadata.version}-Firefox-source.zip`];
  if (!Array.isArray(metadata.files) || metadata.files.length !== expected.length) throw new Error('Release file list is incomplete.');
  const files = new Map();
  for (const filename of expected) {
    const item = metadata.files.find(entry => entry.filename === filename);
    if (!item) throw new Error('Release file list is incomplete.');
    const data = await readFile(path.join(directory, filename));
    if (sha256(data) !== item.sha256) throw new Error(`Checksum mismatch: ${filename}`);
    files.set(filename, data);
  }
  for (const [target, filename] of [['chromium-store', expected[0]], ['firefox', expected[1]]]) {
    const entries = readZipEntries(files.get(filename));
    const manifest = JSON.parse(entries.find(entry => entry.name === 'manifest.json')?.data.toString('utf8') || '{}');
    if (manifest.version !== metadata.version || manifest.key) throw new Error('Wrong version or development key in store package.');
    if (target === 'firefox' && manifest.browser_specific_settings?.gecko?.id !== '{39c56104-958b-43a6-bcfe-5e9db811c74b}') throw new Error('Unexpected Firefox identity.');
  }
  return {metadata, files};
}

export function submissionGate({env, tag, store}) {
  releaseVersion(tag);
  if (!['chrome', 'edge', 'firefox'].includes(store)) throw new Error('Choose one supported store.');
  if (env.GITHUB_ACTIONS !== 'true' || env.GITHUB_REPOSITORY?.toLowerCase() !== 'yoavfried/slotdesk') throw new Error('Store submission is restricted to the SlotDesk GitHub Actions repository.');
  if (!['release', 'workflow_dispatch'].includes(env.GITHUB_EVENT_NAME)) throw new Error('Ordinary pushes and pull requests cannot submit store updates.');
  validateSubmissionRef(env.GITHUB_REF, tag);
  if (env.SLOTDESK_STORE_SUBMISSION_ENABLED !== 'true' || env.SLOTDESK_SUBMISSION_APPROVED_TAG !== tag) throw new Error('Store submission is disabled or this exact release tag was not approved.');
}

export function validateSubmissionRef(ref, tag) {
  releaseVersion(tag);
  if (ref !== `refs/tags/${tag}`) throw new Error('For submission, select this exact release tag in Use workflow from; a branch-based run can only prepare packages.');
}

export async function submitRelease({directory, tag, store, env = process.env, submit}) {
  submissionGate({env, tag, store});
  const bundle = await verifyRelease(directory, tag);
  if (env.SLOTDESK_EXPECTED_COMMIT !== bundle.metadata.commit) throw new Error('Artifact commit differs from the approved release checkout.');
  const adapter = submit || (await import('./store-release-api.mjs')).submitToStore;
  return adapter({store, ...bundle, env});
}

function options(args) {
  const output = {};
  for (let index = 0; index < args.length; index += 2) {
    if (!['--directory', '--output', '--tag', '--store'].includes(args[index]) || !args[index + 1]) throw new Error('Unknown or incomplete release option.');
    output[args[index].slice(2)] = args[index + 1];
  }
  return output;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const [mode, ...args] = process.argv.slice(2), settings = options(args);
    if (mode === 'prepare') {
      const result = await prepareRelease(settings);
      console.log(`Prepared ${result.tag} from ${result.commit}; Firefox source rebuild is byte-identical. No store requests were made.`);
    } else if (mode === 'verify') {
      const {metadata} = await verifyRelease(settings.directory, settings.tag);
      console.log(`Verified ${metadata.tag} checksums and store manifests.`);
    } else if (mode === 'submit') {
      const result = await submitRelease(settings);
      console.log(JSON.stringify(result));
    } else throw new Error('Use prepare, verify or submit. There is no implicit publication mode.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
