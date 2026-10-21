(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./recovery'),require('./google-auth'));else root.SlotWebAuth=factory(root.SlotRecovery,root.SlotGoogleAuth);})(typeof self!=='undefined'?self:this,function(R,A){
  'use strict';
  const KEY='slotdesk-google-session-v1',SCOPES=A.SCOPES;
  const base64=bytes=>{let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
  function create({api,endpoint,fetchImpl=globalThis.fetch,cryptoImpl=globalThis.crypto,now=Date.now}) {
    let session=null,pending=null,generation=0,loaded=false;
    const native=A.createAuth(api?.identity),store=api?.storage?.session;
    const origin=()=>{const u=new URL(api.runtime.getURL(''));return u.protocol+'//'+u.host;};
    function error(code) {
      const map={AUTH_NOT_CONFIGURED:['configuration','SlotDesk’s browser-independent Google connection needs owner setup. Google Chrome can use the existing pilot connection for now.','G110'],
        AUTH_RETURN_NOT_ALLOWED:['configuration','This SlotDesk package needs its Google return address registered by the app owner.','G111'],
        AUTH_RECONNECT:['auth','Reconnect Google to continue. Your saved workspace is kept.','G103'],
        AUTH_SESSION_INVALID:['auth','Your Google connection expired. Reconnect to continue.','G103'],
        AUTH_PROOF_INVALID:['auth','The Google connection could not be verified. Reconnect to continue.','G114'],
        AUTH_PERMISSIONS:['permissions','Google Calendar permissions are incomplete. Reconnect and allow the requested Calendar access.','G106'],
        AUTH_CONFIGURATION:['configuration','SlotDesk’s Google connection needs attention from its owner. Open Help for support.','G105'],
        AUTH_RATE_LIMIT:['rate','Google sign-in is temporarily limited. Wait a minute and try again.','G107']};
      const [kind,message,diagnosticCode]=map[code] || ['connection','Google sign-in could not be completed. Try connecting again; open Help if it continues.','G199'];
      return R.issue(kind,message+' Reference: '+diagnosticCode+'.',{diagnosticCode,requiresReconnect:['auth','permissions'].includes(kind)});
    }
    async function request(op,body) {
      const url=new URL(endpoint);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&url.hostname==='127.0.0.1'))throw error('AUTH_CONFIGURATION');url.searchParams.set('op',op);
      let response,data;try{response=await fetchImpl(url.href,{method:body?'POST':'GET',credentials:'omit',redirect:'error',cache:'no-store',referrerPolicy:'no-referrer',
        headers:body?{'Content-Type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});data=await response.json();}
      catch{throw R.issue('network','Could not reach SlotDesk’s Google connection service. Check your connection and try again. Reference: G107.',{diagnosticCode:'G107'});}
      if(!response.ok)throw error(data?.error);return data;
    }
    async function load(){if(loaded)return;loaded=true;const expected=generation;if(store?.get)try{const values=await store.get(KEY),value=values?.[KEY];if(expected!==generation)return;
      if(value?.mode==='broker'&&typeof value.token==='string'&&typeof value.verifier==='string'&&typeof value.session==='string'&&Number.isFinite(value.expiresAt))session=value;
      else if(value?.mode==='native')session={mode:'native'};
    }catch{/* A missing session is recovered by a fresh sign-in, never localStorage. */}}
    async function save(value,expected=generation){if(expected!==generation)throw error('AUTH_RECONNECT');session=value;
      if(store?.set)try{await store.set({[KEY]:value});}catch{/* Background memory remains available; no persistent credential fallback. */}
      if(expected!==generation){session=null;if(store?.remove)await store.remove(KEY);throw error('AUTH_RECONNECT');}}
    async function accept(data,verifier,expected){if(typeof data.token!=='string'||!data.token||!Number.isFinite(data.expiresAt)||typeof data.session!=='string'||!Array.isArray(data.scopes)||SCOPES.some(scope=>!data.scopes.includes(scope)))throw error('AUTH_PERMISSIONS');
      await save({mode:'broker',token:data.token,expiresAt:data.expiresAt,session:data.session,verifier},expected);return data.token;}
    async function signIn(expected) {
      if(typeof api?.identity?.launchWebAuthFlow!=='function'||typeof api?.identity?.getRedirectURL!=='function')throw R.auth(new Error('identity.getAuthToken is unavailable'),true);
      const verifier=base64(cryptoImpl.getRandomValues(new Uint8Array(48))),digest=await cryptoImpl.subtle.digest('SHA-256',new TextEncoder().encode(verifier)),challenge=base64(new Uint8Array(digest));
      const returnUri=api.identity.getRedirectURL('google'),start=await request('start',{returnUri,challenge});
      let authorization;try{authorization=new URL(start.launchUrl);const service=new URL(endpoint);if(authorization.origin!==service.origin||authorization.pathname!==service.pathname||authorization.searchParams.get('op')!=='authorize'||!start.state||authorization.searchParams.get('state')!==start.state||authorization.searchParams.get('redirect_uri')!==returnUri)throw Error();}
      catch{throw error('AUTH_CONFIGURATION');}
      if(expected!==generation)throw error('AUTH_RECONNECT');
      let result;try{result=await api.identity.launchWebAuthFlow({url:authorization.href,interactive:true});}catch(e){throw R.auth(e,true);}
      if(!result)throw R.auth(new Error('canceled'),true);
      if(expected!==generation)throw error('AUTH_RECONNECT');
      let final;try{final=new URL(result);}catch{throw error('AUTH_PROOF_INVALID');}const expectedUrl=new URL(returnUri);
      if(final.origin!==expectedUrl.origin||final.pathname!==expectedUrl.pathname||final.hash||final.searchParams.get('state')!==start.state)throw error('AUTH_PROOF_INVALID');
      if(final.searchParams.get('error'))throw final.searchParams.get('error')==='access_denied'?R.auth(new Error('denied by user'),true):error('AUTH_PROVIDER_REJECTED');
      const code=final.searchParams.get('code');if(!code)throw error('AUTH_PROVIDER_REJECTED');
      return accept(await request('exchange',{state:start.state,code,verifier}),verifier,expected);
    }
    async function getToken(interactive=false) {
      if(pending)return pending;const expected=generation;
      pending=(async()=>{await load();if(expected!==generation)throw error('AUTH_RECONNECT');if(session?.mode==='broker'){
        if(session.token&&session.expiresAt>now()+60000)return session.token;
        try{return await accept(await request('refresh',{session:session.session,verifier:session.verifier}),session.verifier,expected);}
        catch(e){if(['auth','permissions'].includes(e.kind)){session=null;if(store?.remove)await store.remove(KEY);}if(!interactive||!['auth','permissions'].includes(e.kind))throw e;}
      }
      if(!interactive&&session?.mode==='native')return native.getToken(false);
      let status;try{status=await request('status');}catch(e){if(typeof api?.identity?.getAuthToken!=='function')throw e;}
      if(status?.ready){if(!interactive)throw error('AUTH_RECONNECT');return signIn(expected);}
      if(typeof api?.identity?.getAuthToken==='function')try{const token=await native.getToken(interactive);await save({mode:'native'},expected);return token;}
      catch(e){if(e.kind!=='browser-auth')throw e;}
      throw error('AUTH_NOT_CONFIGURED');
      })();try{return await pending;}finally{pending=null;}
    }
    async function disconnect(){await load();const nativeMode=session?.mode==='native';generation++;session=null;loaded=true;if(store?.remove)await store.remove(KEY);
      if(nativeMode&&typeof api?.identity?.clearAllCachedAuthTokens==='function')await api.identity.clearAllCachedAuthTokens();}
    async function invalidateToken(token){await load();if(session?.mode==='broker'){if(session.token===token)await save({...session,token:'',expiresAt:0});}
      else if(typeof api?.identity?.removeCachedAuthToken==='function')await api.identity.removeCachedAuthToken({token});}
    async function registration(record){await getToken(false);if(session?.mode!=='broker')return {useDirect:true};return request('registration',{session:session.session,verifier:session.verifier,record});}
    return {getToken,disconnect,invalidateToken,registration};
  }
  function install({api,endpoint,fetchImpl,cryptoImpl,now}) {
    const auth=create({api,endpoint,fetchImpl,cryptoImpl,now});
    api.runtime.onMessage.addListener((message,sender,sendResponse)=>{
      if(message?.channel!=='slotdesk-google-v1')return false;
      if(sender.id!==api.runtime.id || typeof sender.url!=='string' || !sender.url.startsWith(api.runtime.getURL('')))return false;
      const tasks={token:()=>auth.getToken(message.interactive===true),invalidate:()=>auth.invalidateToken(message.token),disconnect:()=>auth.disconnect(),registration:()=>auth.registration(message.record)};
      if(!Object.hasOwn(tasks,message.action))return false;
      Promise.resolve().then(tasks[message.action]).then(value=>sendResponse({ok:true,value}),e=>sendResponse({ok:false,error:{kind:e.kind||'connection',message:e.kind?e.message:'SlotDesk’s Google connection could not be completed. Reference: G199.',diagnosticCode:e.diagnosticCode||'G199',requiresReconnect:!!e.requiresReconnect}}));
      return true;
    });
    return auth;
  }
  return {create,install};
});
