const assert=require('node:assert/strict'),{webcrypto}=require('node:crypto'),P=require('./browser-platform'),W=require('./web-auth'),A=require('./google-auth');
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(v,m)=>{assert.ok(v,m);checks++;};
const response=value=>({ok:true,json:async()=>value}),id='blpliafbiiidhcffegochddjhagkhhip',base='chrome-extension://'+id+'/',returnUri='https://'+id+'.chromiumapp.org/google';
function browser(overrides={}){
  const listeners={},tabs=[],values={},api={runtime:{id,getURL:path=>base+path,getManifest:()=>({side_panel:{default_path:'index.html'}}),onInstalled:{addListener:fn=>{listeners.install=fn;}},onMessage:{addListener:fn=>{listeners.message=fn;}}},
    action:{onClicked:{addListener:fn=>{listeners.click=fn;}}},tabs:{create:async value=>{tabs.push(value);return value;}},
    identity:{getRedirectURL:()=>returnUri},storage:{session:{get:async key=>({[key]:values[key]}),set:async value=>Object.assign(values,value),remove:async key=>{delete values[key];}}},...overrides};
  return {api,listeners,tabs,values};
}
async function main(){
  eq(P.apiFor({browser:{x:1},chrome:{x:2}}),{x:1});eq(P.manifest(null),{});eq(P.capabilities({},{}).sidePanel,false);
  const a=browser(),launcher=P.installLauncher(a.api);await launcher.launch({windowId:1});eq(a.tabs,[{url:base+'index.html'}]);
  const b=browser({sidePanel:{setPanelBehavior(){throw Error('unavailable');},open(){throw Error('rejected');}}});await P.installLauncher(b.api).launch({windowId:1});eq(b.tabs.length,1,'synchronous panel error falls back to tab');
  const c=browser({sidePanel:{setPanelBehavior:async()=>{throw Error();},open:async()=>{throw Error();}}});await P.installLauncher(c.api).launch({windowId:1});eq(c.tabs.length,1,'rejected panel APIs fall back to tab');
  const d=browser({sidePanel:{setPanelBehavior:async()=>{}}}),native=P.installLauncher(d.api);await native.configure();eq(await native.launch({windowId:1}),'panel');eq(d.tabs.length,0);
  let opened=0;const e=browser({sidebarAction:{open:async()=>{opened++;}}});e.api.runtime.getManifest=()=>({sidebar_action:{default_panel:'index.html'}});eq(await P.installLauncher(e.api).launch(),'sidebar');eq(opened,1);
  const protectedLocks=P.locks({});await assert.rejects(()=>protectedLocks.request('any',{},()=>{throw Error('Should not execute');}),e=>e.diagnosticCode==='B103');checks++;
  const locks={request(){}};eq(P.locks({locks}),locks);
  let time=100000,mode='broker',providerCalls=0,windowCalls=0;const seen=[],g=browser();
  g.api.identity.launchWebAuthFlow=async details=>{windowCalls++;const u=new URL(details.url);eq(u.searchParams.get('op'),'authorize');return returnUri+'?state='+u.searchParams.get('state')+'&code=synthetic-code';};
  const fetchImpl=async(url,options)=>{const op=new URL(url).searchParams.get('op'),body=options.body&&JSON.parse(options.body);seen.push({op,body});
    if(op==='status')return response({ready:mode==='broker'});
    if(op==='start'){const launch=new URL('https://service.example.test/api/google?op=authorize');launch.searchParams.set('state','opaque-state');launch.searchParams.set('redirect_uri',body.returnUri);return response({state:'opaque-state',launchUrl:launch.href});}
    if(op==='exchange'||op==='refresh'){providerCalls++;return response({token:'synthetic-token-'+providerCalls,expiresAt:time+3600000,session:'opaque-session',scopes:A.SCOPES});}
    if(op==='registration')return response({accepted:true});throw Error(op);
  };
  const auth=W.create({api:g.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto,now:()=>time});
  const tokens=await Promise.all([auth.getToken(true),auth.getToken(true)]);eq(tokens,['synthetic-token-1','synthetic-token-1']);eq(windowCalls,1);eq(providerCalls,1);
  eq(await auth.getToken(false),'synthetic-token-1');eq(providerCalls,1);const stored=Object.values(g.values)[0];eq(stored.mode,'broker');eq(stored.verifier.length,64);ok(!JSON.stringify(stored).includes('refresh_token'));
  const bootstrap=seen.find(x=>x.op==='start').body;eq(bootstrap.returnUri,returnUri);eq(bootstrap.challenge.length,43);ok(!JSON.stringify(bootstrap).includes(stored.verifier));
  const exchange=seen.find(x=>x.op==='exchange').body;eq(exchange.code,'synthetic-code');eq(exchange.verifier,stored.verifier);eq(exchange.state,'opaque-state');
  const restarted=W.create({api:g.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto,now:()=>time});eq(await restarted.getToken(false),'synthetic-token-1','worker restart reuses memory-only session area');
  time+=3600000;eq(await restarted.getToken(false),'synthetic-token-2');eq(windowCalls,1,'token refresh does not open consent');eq(seen.find(x=>x.op==='refresh').body.session,'opaque-session');
  await restarted.invalidateToken('synthetic-token-2');eq(await restarted.getToken(false),'synthetic-token-3');
  eq(await restarted.registration({email:'person@example.test'}),{accepted:true});eq(seen.at(-1).op,'registration');
  await restarted.disconnect();eq(Object.keys(g.values).length,0);await assert.rejects(()=>restarted.getToken(false),e=>e.requiresReconnect===true);checks++;
  const mismatch=browser();mismatch.api.identity.launchWebAuthFlow=async()=>returnUri+'?state=wrong&code=code';const wrong=W.create({api:mismatch.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto});await assert.rejects(()=>wrong.getToken(true),e=>e.diagnosticCode==='G114');checks++;
  const noBackend=browser();mode='native';const unavailable=W.create({api:noBackend.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto});await assert.rejects(()=>unavailable.getToken(true),e=>e.diagnosticCode==='G110');checks++;
  let nativeCalls=0;const old=browser();old.api.identity.getAuthToken=async()=>{nativeCalls++;return {token:'native-token',grantedScopes:A.SCOPES};};old.api.identity.clearAllCachedAuthTokens=async()=>{};const fallback=W.create({api:old.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto});eq(await fallback.getToken(true),'native-token');eq(nativeCalls,1);eq(await fallback.registration({}),{useDirect:true});
  const rpc=browser();W.install({api:rpc.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto});const listener=rpc.listeners.message;eq(listener({channel:'slotdesk-google-v1',action:'token'},{id:'other',url:'https://evil.example'},()=>{throw Error();}),false);eq(listener({channel:'slotdesk-google-v1',action:'__proto__'},{id,url:base+'index.html'},()=>{throw Error();}),false);
  let directCalls=0;const client=P.connection({runtime:{sendMessage:async message=>{eq(message.channel,'slotdesk-google-v1');return {ok:true,value:message.action==='token'?'rpc-token':{useDirect:true}};}}},()=>{throw Error();});eq(await client.getToken(true),'rpc-token');await client.submitRegistration({},async()=>{directCalls++;});eq(directCalls,1);
  const denied=P.connection({runtime:{sendMessage:async()=>({ok:false,error:{kind:'configuration',message:'Setup pending',diagnosticCode:'G110'}})}},()=>{});await assert.rejects(()=>denied.getToken(true),e=>e.diagnosticCode==='G110');checks++;
  eq(P.connection({},()=> 'direct'),'direct');
  mode='broker';
  const malformed=browser();malformed.api.identity.launchWebAuthFlow=async()=> 'not a URL';
  await assert.rejects(()=>W.create({api:malformed.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto}).getToken(true),e=>e.diagnosticCode==='G114');checks++;
  const delayed=browser();let finishRead;delayed.api.storage.session.get=()=>new Promise(resolve=>{finishRead=resolve;});
  const delayedAuth=W.create({api:delayed.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto}),oldRead=delayedAuth.getToken(false);await new Promise(resolve=>setImmediate(resolve));await delayedAuth.disconnect();
  finishRead({'slotdesk-google-session-v1':{...stored,expiresAt:Date.now()+3600000}});await assert.rejects(()=>oldRead,e=>e.diagnosticCode==='G103');checks++;eq(Object.keys(delayed.values).length,0,'late hydration cannot restore a disconnected credential');
  const opening=browser();let finishWindow,launch;opening.api.identity.launchWebAuthFlow=details=>{launch=details.url;return new Promise(resolve=>{finishWindow=resolve;});};
  const openingAuth=W.create({api:opening.api,endpoint:'https://service.example.test/api/google',fetchImpl,cryptoImpl:webcrypto}),openingResult=openingAuth.getToken(true);while(!finishWindow)await new Promise(resolve=>setImmediate(resolve));
  const exchanges=seen.filter(x=>x.op==='exchange').length;await openingAuth.disconnect();finishWindow(returnUri+'?state='+new URL(launch).searchParams.get('state')+'&code=late-code');await assert.rejects(()=>openingResult,e=>e.diagnosticCode==='G103');checks++;eq(seen.filter(x=>x.op==='exchange').length,exchanges,'disconnect during consent prevents code exchange');eq(Object.keys(opening.values).length,0);
  console.log(checks+' browser platform and session-auth checks passed; synthetic credentials only.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
