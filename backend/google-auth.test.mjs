import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createGoogleBroker,GOOGLE_SCOPES} from './google-auth.mjs';
let checks=0;
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;},ok=(v,label)=>{assert.ok(v,label);checks++;};
const origin='chrome-extension://blpliafbiiidhcffegochddjhagkhhip',returnUri='https://blpliafbiiidhcffegochddjhagkhhip.chromiumapp.org/google';
const firefox='https://37d48a39143e7524b1b43d70397319c090cb855d.extensions.allizom.org/google',moz='moz-extension://11111111-2222-4333-8444-555555555555';
const callbackUrl='https://slotdesk-leads.vercel.app/api/google?op=callback',verifier='a'.repeat(64),challenge=createHash('sha256').update(verifier).digest('base64url');
const token={access_token:'synthetic-access',refresh_token:'synthetic-refresh-secret',expires_in:3600,token_type:'Bearer',scope:GOOGLE_SCOPES.join(' ')};
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json'}});
function fixture(overrides={}) {
  const calls=[],registrations=[];let clock=Date.parse('2026-10-21T09:00:00Z');
  const handler=createGoogleBroker({clientId:'12345-test.apps.googleusercontent.com',clientSecret:'test-server-secret',secret:'ab'.repeat(32),callbackUrl,returnUrls:[returnUri,firefox],now:()=>clock,
    fetchImpl:async(url,options)=>{calls.push({url,options});return json(token);},register:async record=>{registrations.push(record);return json({accepted:true},202);},...overrides});
  const request=(op,body,from=origin)=>handler(new Request('https://slotdesk-leads.vercel.app/api/google?op='+op,{method:body?'POST':'GET',headers:{...(from?{Origin:from}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})}));
  return {handler,request,calls,registrations,advance:n=>{clock+=n;}};
}
const blank=fixture({clientSecret:undefined});eq(await (await blank.request('status')).json(),{ready:false,version:'0.9.4.6',flow:'authorization-code'});eq((await blank.request('start',{returnUri,challenge})).status,503);eq(blank.calls.length,0);
const f=fixture();eq((await f.request('status')).status,200);eq((await f.request('start',{returnUri,challenge},'https://evil.example')).status,403);
eq((await f.request('start',{returnUri,challenge},'chrome-extension://'+'a'.repeat(32))).status,403);
eq((await f.request('start',{returnUri:'https://evil.example',challenge})).status,400);
eq((await f.request('start',{returnUri,challenge:'bad'})).status,400);
eq((await f.request('start',{returnUri,challenge,unexpected:'private data'})).status,400);
const started=await f.request('start',{returnUri,challenge}),start=await started.json();eq(started.headers.get('access-control-allow-origin'),origin);eq(started.headers.get('cache-control'),'no-store');ok(!JSON.stringify(start).includes('test-server-secret'));
const launch=new URL(start.launchUrl);eq(launch.searchParams.get('redirect_uri'),returnUri);eq(launch.searchParams.get('op'),'authorize');
const authorized=await f.handler(new Request(start.launchUrl));eq(authorized.status,302);const google=new URL(authorized.headers.get('location'));eq(google.origin,'https://accounts.google.com');eq(google.searchParams.get('redirect_uri'),callbackUrl);eq(google.searchParams.get('code_challenge'),challenge);eq(google.searchParams.get('code_challenge_method'),'S256');eq(google.searchParams.get('prompt'),'select_account consent');
const incorrect=new URL(start.launchUrl);incorrect.searchParams.set('redirect_uri','https://evil.example');eq((await f.handler(new Request(incorrect))).status,400);
const callback=new URL(callbackUrl);callback.searchParams.set('state',start.state);callback.searchParams.set('code','synthetic-code');const returned=await f.handler(new Request(callback));eq(returned.status,302);const result=new URL(returned.headers.get('location'));eq(result.origin,new URL(returnUri).origin);eq(result.searchParams.get('state'),start.state);eq(result.searchParams.get('code'),'synthetic-code');eq(returned.headers.get('referrer-policy'),'no-referrer');eq(f.calls.length,0,'callback redirects without exposing a token');
const wrong=await f.request('exchange',{state:start.state,code:'synthetic-code',verifier:'b'.repeat(64)});eq(wrong.status,401);eq(f.calls.length,0);
eq((await f.request('exchange',{state:start.state,code:'synthetic-code',verifier},moz)).status,401);
const exchanged=await f.request('exchange',{state:start.state,code:'synthetic-code',verifier}),credentials=await exchanged.json();eq(exchanged.status,200);eq(credentials.token,token.access_token);ok(credentials.session&&!credentials.session.includes(token.refresh_token));ok(!JSON.stringify(credentials).includes('refresh_token'));eq(f.calls.length,1);eq(f.calls[0].url,'https://oauth2.googleapis.com/token');const outgoing=new URLSearchParams(f.calls[0].options.body);eq(outgoing.get('client_secret'),'test-server-secret');eq(outgoing.get('code_verifier'),verifier);eq(f.calls[0].options.redirect,'error');eq(f.calls[0].options.credentials,'omit');
const refreshed=await f.request('refresh',{session:credentials.session,verifier});eq(refreshed.status,200);eq(new URLSearchParams(f.calls[1].options.body).get('refresh_token'),token.refresh_token);
const payload={email:'person@example.test',name:'Person',timezone:'UTC',onboarded_at:'2026-10-21T09:00:00Z',updates_opt_in:false};eq((await f.request('registration',{session:credentials.session,verifier,record:payload})).status,202);eq(f.registrations,[payload]);eq(f.calls.length,2,'registration never requests calendar data');
eq((await f.request('refresh',{session:credentials.session,verifier},moz)).status,401);eq((await f.request('refresh',{session:credentials.session.slice(0,-2)+'zz',verifier})).status,401);eq((await f.request('exchange',{state:credentials.session,code:'synthetic-code',verifier})).status,401,'session cannot substitute for transaction');
const expired=fixture();const expiry=await (await expired.request('start',{returnUri,challenge})).json();expired.advance(600001);eq((await expired.request('exchange',{state:expiry.state,code:'synthetic-code',verifier})).status,401);eq(expired.calls.length,0);
f.advance(7*86400000+1);eq((await f.request('refresh',{session:credentials.session,verifier})).status,401);
const ff=fixture(),ffStart=await(await ff.request('start',{returnUri:firefox,challenge},moz)).json();eq(new URL(ffStart.launchUrl).searchParams.get('redirect_uri'),firefox);eq((await ff.request('exchange',{state:ffStart.state,code:'synthetic-code',verifier},moz)).status,200);
const denied=new URL(callbackUrl);denied.searchParams.set('state',ffStart.state);denied.searchParams.set('error','access_denied');const deniedResult=await ff.handler(new Request(denied));eq(new URL(deniedResult.headers.get('location')).searchParams.get('error'),'access_denied');

// Every store identity needs its own registered return, even when the broker is healthy.
for(const [storeName,storeId]of [['Chrome store','ajilefcckipghmgcljllklamipjjecim'],['Edge store','kmackhppfgogbajpgpocmacbjhpleche']]){
  const storeOrigin=`chrome-extension://${storeId}`,storeReturn=`https://${storeId}.chromiumapp.org/google`;
  const missing=fixture(),status=await missing.request('status',undefined,storeOrigin);
  eq(status.status,200);eq((await status.json()).ready,true);eq(status.headers.get('access-control-allow-origin'),null);
  const missingPreflight=await missing.handler(new Request('https://slotdesk-leads.vercel.app/api/google?op=start',{method:'OPTIONS',headers:{Origin:storeOrigin}}));
  eq(missingPreflight.status,403);eq((await missingPreflight.json()).error,'ORIGIN_NOT_ALLOWED');eq(missingPreflight.headers.get('access-control-allow-origin'),null);
  const missingStart=await missing.request('start',{returnUri:storeReturn,challenge},storeOrigin);
  eq(missingStart.status,403);eq((await missingStart.json()).error,'ORIGIN_NOT_ALLOWED');eq(missingStart.headers.get('access-control-allow-origin'),null);eq(missing.calls.length,0);

  const configured=fixture({returnUrls:[returnUri,firefox,storeReturn]});
  const storePreflight=await configured.handler(new Request('https://slotdesk-leads.vercel.app/api/google?op=start',{method:'OPTIONS',headers:{Origin:storeOrigin}}));
  eq(storePreflight.status,204);eq(storePreflight.headers.get('access-control-allow-origin'),storeOrigin);
  const storeStarted=await configured.request('start',{returnUri:storeReturn,challenge},storeOrigin),storeStart=await storeStarted.json();
  eq(storeStarted.status,200);eq(storeStarted.headers.get('access-control-allow-origin'),storeOrigin);eq(new URL(storeStart.launchUrl).searchParams.get('redirect_uri'),storeReturn);eq(configured.calls.length,0);
  const wrongProof=await configured.request('exchange',{state:storeStart.state,code:'synthetic-store-code',verifier:'b'.repeat(64)},storeOrigin);
  eq(wrongProof.status,401);eq((await wrongProof.json()).error,'AUTH_PROOF_INVALID');eq(configured.calls.length,0,`${storeName}: an incorrect PKCE verifier cannot reach Google`);
  const wrongOrigin=await configured.request('exchange',{state:storeStart.state,code:'synthetic-store-code',verifier},origin);
  eq(wrongOrigin.status,401);eq((await wrongOrigin.json()).error,'AUTH_PROOF_INVALID');eq(configured.calls.length,0,`${storeName}: another allowed package cannot exchange its transaction`);
  const storeExchanged=await configured.request('exchange',{state:storeStart.state,code:'synthetic-store-code',verifier},storeOrigin);
  eq(storeExchanged.status,200);eq(storeExchanged.headers.get('access-control-allow-origin'),storeOrigin);eq((await storeExchanged.json()).token,token.access_token);eq(configured.calls.length,1);
  const unrelatedOrigin='chrome-extension://'+'c'.repeat(32);
  const unrelatedPreflight=await configured.handler(new Request('https://slotdesk-leads.vercel.app/api/google?op=start',{method:'OPTIONS',headers:{Origin:unrelatedOrigin}}));
  eq(unrelatedPreflight.status,403);eq(unrelatedPreflight.headers.get('access-control-allow-origin'),null);
  const unrelatedStart=await configured.request('start',{returnUri:storeReturn,challenge},unrelatedOrigin);
  eq(unrelatedStart.status,403);eq((await unrelatedStart.json()).error,'ORIGIN_NOT_ALLOWED');eq(configured.calls.length,1,`${storeName}: registration does not admit unrelated extension origins`);
}

for(const [provider,status,error]of [[{error:'invalid_client'},400,'AUTH_CONFIGURATION'],[{error:'invalid_grant'},400,'AUTH_RECONNECT'],[{...token,scope:GOOGLE_SCOPES[0]},200,'AUTH_PERMISSIONS'],[{...token,refresh_token:undefined},200,'AUTH_RECONNECT'],[{...token,access_token:null},200,'AUTH_INVALID_RESPONSE']]){
  const t=fixture({fetchImpl:async()=>json(provider,status)}),transaction=await(await t.request('start',{returnUri,challenge})).json();const r=await t.request('exchange',{state:transaction.state,code:'code',verifier});eq((await r.json()).error,error);
}
const preflight=await ff.handler(new Request('https://slotdesk-leads.vercel.app/api/google',{method:'OPTIONS',headers:{Origin:moz}}));eq(preflight.status,204);eq(preflight.headers.get('access-control-allow-origin'),moz);eq(preflight.headers.get('access-control-allow-credentials'),null);
eq((await ff.handler(new Request(callbackUrl,{method:'DELETE',headers:{Origin:moz}}))).status,405);
const oversized=await ff.handler(new Request('https://slotdesk-leads.vercel.app/api/google?op=start',{method:'POST',headers:{Origin:moz,'Content-Type':'application/json'},body:JSON.stringify({value:'x'.repeat(17000)})}));eq(oversized.status,413);
const limited=fixture();for(let i=0;i<60;i++)await limited.request('start',{returnUri,challenge});eq((await limited.request('start',{returnUri,challenge})).status,429);
const saturation=fixture();for(let i=0;i<300;i++)await saturation.request('start',{},'moz-extension://00000000-0000-4000-8000-'+i.toString(16).padStart(12,'0'));
eq((await saturation.request('start',{returnUri,challenge})).status,200,'Invalid varying origins never exhaust unrelated sign-in admission');
const rotating=fixture();for(let i=0;i<60;i++)await rotating.request('start',{returnUri,challenge},'moz-extension://00000000-0000-4000-8000-'+i.toString(16).padStart(12,'0'));
eq((await rotating.request('start',{returnUri,challenge})).status,429,'Changing an Origin does not reset the same client budget');
const diverse=fixture();for(let i=0;i<300;i++)assert.equal((await diverse.handler(new Request('https://slotdesk-leads.vercel.app/api/google?op=start',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','x-real-ip':'2001:db8::'+i.toString(16)},body:JSON.stringify({returnUri,challenge})}))).status,200,'New valid clients remain admitted after bounded eviction');checks++;
console.log(checks+' Google OAuth broker checks passed; synthetic credentials and mocked provider only.');
