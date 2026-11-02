import assert from 'node:assert/strict';
import {CHROMIUM_ID, returnUrls} from './browser-targets.mjs';

// Public, stateless startup checks only. Never follow the returned authorization URL.
const endpoint='https://slotdesk-leads.vercel.app/api/google';
const storeId='ajilefcckipghmgcljllklamipjjecim';
const cases=[
  ['Chrome store',`chrome-extension://${storeId}`,`https://${storeId}.chromiumapp.org/google`],
  ['Unpacked Chromium',`chrome-extension://${CHROMIUM_ID}`,returnUrls[0]],
  ['Firefox','moz-extension://11111111-2222-4333-8444-555555555555',returnUrls[1]]
];
const request=(op,options={})=>fetch(`${endpoint}?op=${op}`,{...options,redirect:'error',credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(15000)});
const status=await request('status');
assert.equal(status.status,200,'Service status must be available');
assert.equal((await status.json()).ready,true,'Service configuration must be ready');
for(const [name,origin,returnUri]of cases){
  const preflight=await request('start',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});
  assert.equal(preflight.status,204,`${name}: preflight must admit the installed identity`);
  assert.equal(preflight.headers.get('access-control-allow-origin'),origin,`${name}: preflight must allow the exact origin`);
  const started=await request('start',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({returnUri,challenge:'A'.repeat(43)})});
  assert.equal(started.status,200,`${name}: authorization startup must accept its return`);
  assert.equal(started.headers.get('access-control-allow-origin'),origin,`${name}: startup must allow the exact origin`);
  const data=await started.json();
  assert.equal(typeof data.launchUrl,'string',`${name}: startup must return an authorization URL`);
  const launch=new URL(data.launchUrl);
  assert.equal(launch.origin,new URL(endpoint).origin,`${name}: startup must use the expected service`);
  assert.equal(launch.searchParams.get('redirect_uri'),returnUri,`${name}: startup must preserve the exact return`);
  console.log(`${name}: preflight and authorization startup passed.`);
}
for(const origin of ['https://unrelated.example','chrome-extension://'+'a'.repeat(32)]){
  const denied=await request('start',{method:'OPTIONS',headers:{Origin:origin}});
  assert.equal(denied.status,403,'Unrelated origins must remain rejected');
  assert.equal(denied.headers.get('access-control-allow-origin'),null,'Unrelated origins must not receive CORS access');
}
console.log('Unrelated origins rejected. No Google sign-in, token exchange or calendar writes performed.');
