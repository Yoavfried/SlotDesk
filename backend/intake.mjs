import {createHash} from 'node:crypto';
const keys=['email','name','timezone','onboarded_at','updates_opt_in'],optional=['onboarding_id','browser'];
const browsers=new Set(['Chrome','Chromium','Edge','Vivaldi','Brave','Opera','Firefox','Safari','Unknown']);
export function legacyId(email,at){const hex=createHash('md5').update(email+'\n'+at).digest('hex');return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');}
export function validate(value){
  if(!value||Array.isArray(value)||keys.some(key=>!Object.hasOwn(value,key))||Object.keys(value).some(key=>!keys.includes(key)&&!optional.includes(key)))throw new Error('Invalid fields');
  const {email,name,timezone,onboarded_at,updates_opt_in}=value;
  if(typeof email!=='string'||email.length>320||email!==email.trim().toLowerCase()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof name!=='string'||name!==name.trim()||!name||name.length>200||/[\u0000-\u001f\u007f]/.test(name)||typeof timezone!=='string'||!timezone||timezone.length>100||typeof updates_opt_in!=='boolean'||typeof onboarded_at!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(onboarded_at)||!Number.isFinite(Date.parse(onboarded_at)))throw new Error('Invalid registration');
  new Intl.DateTimeFormat('en',{timeZone:timezone});
  const onboarding_id=Object.hasOwn(value,'onboarding_id')?value.onboarding_id:legacyId(email,onboarded_at),browser=Object.hasOwn(value,'browser')?value.browser:'Unknown';
  if(typeof onboarding_id!=='string'||!(/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i).test(onboarding_id)||!browsers.has(browser))throw new Error('Invalid registration metadata');
  return {email,name,timezone,onboarded_at,updates_opt_in,onboarding_id:onboarding_id.toLowerCase(),browser};
}
export function createIntake({insert,origin,now=Date.now}){
  // Coarse per-instance throttling, not identity verification. IP keys and counts
  // stay in this short-lived map; no submitted fields are stored or logged here.
  const attempts=new Map();let window=0;
  return async request=>{
    const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
    const respond=(status,body)=>new Response(body?JSON.stringify(body):null,{status,headers:{...headers,'Content-Type':'application/json'}});
    if(request.headers.get('origin')!==origin)return respond(403,{error:'Origin not allowed'});
    headers['Access-Control-Allow-Origin']=origin;
    if(request.method==='OPTIONS'){headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type';headers['Access-Control-Max-Age']='600';return respond(204);}
    if(request.method!=='POST'){headers.Allow='POST, OPTIONS';return respond(405,{error:'Method not allowed'});}
    if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return respond(415,{error:'Use JSON'});
    if(Number(request.headers.get('content-length'))>2048)return respond(413,{error:'Registration too large'});
    const bucket=Math.floor(now()/60000);if(window!==bucket){attempts.clear();window=bucket;}
    const ip=request.headers.get('x-vercel-forwarded-for')||'unknown',count=(attempts.get(ip)||0)+1;
    if(attempts.size>=2000&&!attempts.has(ip)||count>20){headers['Retry-After']='60';return respond(429,{error:'Try later'});}attempts.set(ip,count);
    let value;try{const reader=request.body?.getReader();if(!reader)throw new Error();const chunks=[];let bytes=0;for(;;){const {value:chunk,done}=await reader.read();if(done)break;bytes+=chunk.byteLength;if(bytes>2048){await reader.cancel();return respond(413,{error:'Registration too large'});}chunks.push(chunk);}const body=Buffer.concat(chunks).toString('utf8');value=validate(JSON.parse(body));}catch(_){return respond(400,{error:'Review registration details'});}
    try{await insert(value);return respond(202,{accepted:true});}catch(_){return respond(503,{error:'Registration waiting; try later'});}
  };
}
