(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotLeads=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  function record(profile,updates,at=new Date().toISOString()){
    const email=String(profile?.email||'').trim().toLowerCase(),name=String(profile?.name||'').trim(),timezone=String(profile?.tz||'');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>320||!name||name.length>200||typeof updates!=='boolean'||!Number.isFinite(Date.parse(at)))throw new Error('Complete your email, name and timezone before finishing setup.');try{if(!timezone)throw new Error();new Intl.DateTimeFormat('en',{timeZone:timezone});}catch(_){throw new Error('Choose a valid timezone for your profile.');}
    return {email,name,timezone,onboarded_at:new Date(at).toISOString(),updates_opt_in:updates};
  }
  function prepare(state,profile,updates,at){if(state.settings.leadRegistration)return state.settings.leadRegistration;const value=record(profile,updates,at);state.settings.leadRegistration={record:value,status:'pending'};return state.settings.leadRegistration;}
  function createClient({endpoint,fetchImpl=globalThis.fetch,timeoutMs=10000}){
    const inFlight=new Map();async function submit(value){if(!endpoint)throw new Error('Registration is waiting for a connection.');const url=new URL(endpoint);if(url.protocol!=='https:'&&!['127.0.0.1','localhost'].includes(url.hostname))throw new Error('Registration needs a secure connection.');const {email,name,timezone,onboarded_at,updates_opt_in}=record({email:value.email,name:value.name,tz:value.timezone},value.updates_opt_in,value.onboarded_at),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetchImpl(url.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,timezone,onboarded_at,updates_opt_in}),signal:controller.signal,credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',cache:'no-store'});if(!response.ok)throw new Error(response.status===429?'Registration will retry later; the service is temporarily busy.':'Registration could not be saved yet. Your setup is kept.');return true;}finally{clearTimeout(timer);}}
    return {submit:value=>{const key=JSON.stringify(value);if(inFlight.has(key))return inFlight.get(key);const task=submit(value).finally(()=>inFlight.delete(key));inFlight.set(key,task);return task;}};
  }
  return {record,prepare,createClient};
});
