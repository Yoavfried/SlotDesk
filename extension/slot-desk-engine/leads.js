(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotLeads=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const browsers=['Chrome','Chromium','Edge','Vivaldi','Brave','Opera','Firefox','Safari','Unknown'];
  function browserName(nav=globalThis.navigator){
    const brands=(nav?.userAgentData?.brands||[]).map(item=>item.brand),ua=nav?.userAgent||'';
    for(const [name,pattern]of [['Vivaldi',/Vivaldi|VivaiOS/i],['Edge',/Microsoft Edge|Edg(?:e|A|iOS)?\//i],['Opera',/Opera|OPR\//i],['Brave',/Brave/i],['Firefox',/Firefox|FxiOS/i]])if(brands.some(brand=>pattern.test(brand))||pattern.test(ua)||name==='Brave'&&nav?.brave)return name;
    if(brands.includes('Microsoft Edge'))return 'Edge';
    if(brands.includes('Google Chrome')||/CriOS\//.test(ua))return 'Chrome';
    // A Chrome-compatible UA does not prove which Chromium browser is running.
    if(brands.includes('Chromium')||/Chrom(?:e|ium)\//.test(ua))return 'Chromium';
    if(/Safari\//.test(ua))return 'Safari';return 'Unknown';
  }
  function record(profile,updates,at=new Date().toISOString(),details={}){
    const email=String(profile?.email||'').trim().toLowerCase(),name=String(profile?.name||'').trim(),timezone=String(profile?.tz||'');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>320||!name||name.length>200||typeof updates!=='boolean'||!Number.isFinite(Date.parse(at)))throw new Error('Complete your email, name and timezone before finishing setup.');try{if(!timezone)throw new Error();new Intl.DateTimeFormat('en',{timeZone:timezone});}catch(_){throw new Error('Choose a valid timezone for your profile.');}
    const value={email,name,timezone,onboarded_at:new Date(at).toISOString(),updates_opt_in:updates},browser=details.browser??browserName();
    if(!browsers.includes(browser))throw new Error('Invalid registration browser.');
    if(details.onboarding_id!==false){const id=details.onboarding_id||globalThis.crypto.randomUUID();if(!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id))throw new Error('Invalid onboarding identifier.');value.onboarding_id=id.toLowerCase();}
    value.browser=browser;return value;
  }
  function prepare(state,profile,updates,at){if(state.settings.leadRegistration)return state.settings.leadRegistration;const value=record(profile,updates,at);state.settings.leadRegistration={record:value,status:'pending'};return state.settings.leadRegistration;}
  function createClient({endpoint,fetchImpl=globalThis.fetch,timeoutMs=10000}){
    const inFlight=new Map();async function submit(value){if(!endpoint)throw new Error('Registration is waiting for a connection.');const url=new URL(endpoint);if(url.protocol!=='https:'&&!['127.0.0.1','localhost'].includes(url.hostname))throw new Error('Registration needs a secure connection.');const payload=record({email:value.email,name:value.name,tz:value.timezone},value.updates_opt_in,value.onboarded_at,{onboarding_id:value.onboarding_id||false,browser:value.browser||'Unknown'});if(!('browser' in value))delete payload.browser;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);try{const response=await fetchImpl(url.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',cache:'no-store'});if(!response.ok)throw new Error(response.status===429?'Registration will retry later; the service is temporarily busy.':'Registration could not be saved yet. Your setup is kept.');return true;}finally{clearTimeout(timer);}}
    return {submit:value=>{const key=JSON.stringify(value);if(inFlight.has(key))return inFlight.get(key);const task=submit(value).finally(()=>inFlight.delete(key));inFlight.set(key,task);return task;}};
  }
  return {record,prepare,createClient,browserName};
});
