import {createHmac, randomUUID} from 'node:crypto';

const chromeOrigin = 'https://chromewebstore.googleapis.com';
const edgeOrigin = 'https://api.addons.microsoftedge.microsoft.com';
const amoOrigin = 'https://addons.mozilla.org';

function required(env, key, pattern) {
  const value = env[key];
  if (!value || (pattern && !pattern.test(value))) throw new Error(`Configure ${key} before enabling this store.`);
  return value;
}

export function amoToken(key, secret, now = Math.floor(Date.now() / 1000)) {
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = `${encode({alg: 'HS256', typ: 'JWT'})}.${encode({iss: key, jti: randomUUID(), iat: now, exp: now + 60})}`;
  return `${unsigned}.${createHmac('sha256', secret).update(unsigned).digest('base64url')}`;
}

function compareVersions(left, right) {
  const a = left.split('.').map(Number), b = right.split('.').map(Number);
  for (let index = 0; index < 4; index++) {
    const difference = (a[index] || 0) - (b[index] || 0);
    if (difference) return Math.sign(difference);
  }
  return 0;
}

export async function submitToStore({store, metadata, files, env, fetchImpl = fetch, sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))}) {
  const request = async (url, options = {}, allowedStatus = []) => {
    const origin = new URL(url).origin;
    if (![chromeOrigin, edgeOrigin, amoOrigin].includes(origin)) throw new Error('Refused an unexpected store endpoint.');
    let response;
    try { response = await fetchImpl(url, {...options, redirect: 'error', signal: AbortSignal.timeout(60000)}); }
    catch { throw new Error('Store request did not complete. Check the store dashboard before retrying; writes are never automatically retried.'); }
    if (!response.ok && !allowedStatus.includes(response.status)) throw new Error(`Store returned HTTP ${response.status}. Check the store dashboard; no response body or credentials were logged.`);
    return response;
  };
  const json = async (url, options, allowedStatus) => {
    const response = await request(url, options, allowedStatus);
    if (allowedStatus?.includes(response.status)) return {httpStatus: response.status};
    try { return await response.json(); } catch { throw new Error('Store returned an unexpected response. Check its dashboard before retrying.'); }
  };
  const zipName = `SlotDesk-${metadata.version}-Chromium-store.zip`;
  if (store === 'chrome') {
    const publisher = required(env, 'CWS_PUBLISHER_ID', /^[A-Za-z\d_-]+$/);
    const item = required(env, 'CWS_ITEM_ID', /^[a-p]{32}$/);
    const token = required(env, 'CWS_ACCESS_TOKEN');
    const endpoint = `${chromeOrigin}/v2/publishers/${publisher}/items/${item}`;
    const headers = {Authorization: `Bearer ${token}`};
    const status = await json(`${endpoint}:fetchStatus`, {headers});
    if (status.takenDown || status.warned) throw new Error('Resolve the Chrome policy warning in the dashboard before uploading.');
    const submitted = status.submittedItemRevisionStatus;
    if (submitted && ['PENDING_REVIEW', 'STAGED'].includes(submitted.state)) {
      if (submitted.distributionChannels?.some(channel => channel.crxVersion === metadata.version)) return {store, version: metadata.version, state: 'already-submitted'};
      throw new Error('Another Chrome revision is pending review or staged. Resolve it manually before uploading.');
    }
    const published = status.publishedItemRevisionStatus?.distributionChannels || [];
    if (published.some(channel => compareVersions(channel.crxVersion, metadata.version) >= 0)) throw new Error('Chrome already has this version or a later version.');
    if (!status.publishedItemRevisionStatus) throw new Error('Complete the first Chrome publication manually before enabling update automation.');
    const uploaded = await json(`${chromeOrigin}/upload/v2/publishers/${publisher}/items/${item}:upload`, {method: 'POST', headers: {...headers, 'Content-Type': 'application/zip'}, body: files.get(zipName)});
    if (uploaded.uploadState !== 'SUCCEEDED' || uploaded.crxVersion !== metadata.version) {
      throw new Error('Chrome upload is not confirmed at the expected version. Check its processing status in the dashboard; this run did not submit it.');
    }
    const result = await json(`${endpoint}:publish`, {method: 'POST', headers: {...headers, 'Content-Type': 'application/json'}, body: JSON.stringify({publishType: 'DEFAULT_PUBLISH', skipReview: false, blockOnWarnings: true})});
    return {store, version: metadata.version, state: result.state || 'submitted'};
  }
  if (store === 'edge') {
    const product = required(env, 'EDGE_PRODUCT_ID', /^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i);
    const client = required(env, 'EDGE_CLIENT_ID');
    const key = required(env, 'EDGE_API_KEY');
    if (env.EDGE_FIRST_PUBLICATION_COMPLETE !== 'true') throw new Error('Complete the first Edge publication manually before enabling update automation.');
    const endpoint = `${edgeOrigin}/v1/products/${product}/submissions`;
    const headers = {Authorization: `ApiKey ${key}`, 'X-ClientID': client};
    function operationId(response) {
      const location = response.headers.get('location') || '';
      // The service documents an operation ID; also accept its same-origin absolute URL.
      const value = location.startsWith(`${edgeOrigin}/`) ? new URL(location).pathname.split('/').at(-1) : location;
      if (!/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i.test(value)) throw new Error('Unexpected Edge operation ID. Check Partner Center before retrying.');
      return value;
    }
    async function poll(url) {
      for (let attempt = 0; attempt < 30; attempt++) {
        const result = await json(url, {headers});
        if (result.status === 'Succeeded') return;
        if (result.status !== 'InProgress') throw new Error('Edge operation did not succeed. Check Partner Center before retrying.');
        await sleep(10000);
      }
      throw new Error('Edge is still processing. Check Partner Center before retrying; no writes were repeated.');
    }
    const upload = await request(`${endpoint}/draft/package`, {method: 'POST', headers: {...headers, 'Content-Type': 'application/zip'}, body: files.get(zipName)});
    if (upload.status !== 202) throw new Error('Unexpected Edge upload response. Check Partner Center before retrying.');
    await poll(`${endpoint}/draft/package/operations/${operationId(upload)}`);
    const submission = await request(endpoint, {method: 'POST', headers: {...headers, 'Content-Type': 'application/json'}, body: JSON.stringify({notes: `SlotDesk ${metadata.version}. Source commit ${metadata.commit}.`})});
    if (submission.status !== 202) throw new Error('Unexpected Edge submission response. Check Partner Center before retrying.');
    const id = operationId(submission);
    await poll(`${endpoint}/operations/${id}`);
    return {store, version: metadata.version, state: 'submitted-for-certification', operation: id};
  }
  if (store === 'firefox') {
    const guid = '{39c56104-958b-43a6-bcfe-5e9db811c74b}';
    const key = required(env, 'AMO_API_KEY'), secret = required(env, 'AMO_API_SECRET');
    const headers = () => ({Authorization: `JWT ${amoToken(key, secret)}`});
    const endpoint = `${amoOrigin}/api/v5/addons/addon/${encodeURIComponent(guid)}`;
    const addon = await json(`${endpoint}/`, {headers: headers()});
    if (addon.guid !== guid || !addon.current_version) throw new Error('Complete the first Firefox publication manually before enabling update automation.');
    const existing = await json(`${endpoint}/versions/v${metadata.version}/`, {headers: headers()}, [404]);
    if (existing.httpStatus !== 404) return {store, version: metadata.version, state: 'version-already-exists-check-amo'};
    if (compareVersions(addon.current_version.version, metadata.version) >= 0) throw new Error('Firefox already has this version or a later version.');
    const xpiName = `SlotDesk-${metadata.version}-Firefox-unsigned.xpi`;
    const uploadForm = new FormData();
    uploadForm.set('upload', new Blob([files.get(xpiName)], {type: 'application/x-xpinstall'}), xpiName);
    uploadForm.set('channel', 'listed');
    const upload = await json(`${amoOrigin}/api/v5/addons/upload/`, {method: 'POST', headers: headers(), body: uploadForm});
    if (!/^[a-f\d-]{36}$/i.test(upload.uuid || '')) throw new Error('Unexpected Mozilla upload identity.');
    let valid = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      const result = await json(`${amoOrigin}/api/v5/addons/upload/${upload.uuid}/`, {headers: headers()});
      if (result.processed) {
        if (!result.valid || result.version !== metadata.version || result.channel !== 'listed') throw new Error('Mozilla validation failed or returned another version/channel. Review the result in AMO.');
        valid = true;
        break;
      }
      await sleep(10000);
    }
    if (!valid) throw new Error('Mozilla validation is still processing. This run did not create a version.');
    const sourceName = `SlotDesk-${metadata.version}-Firefox-source.zip`;
    const versionForm = new FormData();
    versionForm.set('upload', upload.uuid);
    versionForm.set('source', new Blob([files.get(sourceName)], {type: 'application/zip'}), sourceName);
    versionForm.set('license', 'MIT');
    const version = await json(`${endpoint}/versions/`, {method: 'POST', headers: headers(), body: versionForm});
    return {store, version: metadata.version, state: 'submitted-to-amo', versionId: version.id};
  }
  throw new Error('Unsupported store.');
}
