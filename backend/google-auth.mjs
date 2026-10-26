import {createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual} from 'node:crypto';

export const GOOGLE_SCOPES = Object.freeze([
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
  'https://www.googleapis.com/auth/calendar.events.freebusy'
]);
const AUTHORIZE = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN = 'https://oauth2.googleapis.com/token';
const MAX_BODY = 16384, TRANSACTION_MS = 10 * 60000, SESSION_MS = 7 * 86400000;
const CLIENT = /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/i;
const VERIFIER = /^[A-Za-z0-9._~-]{43,128}$/;
const CHALLENGE = /^[A-Za-z0-9_-]{43}$/;
const equal = (a,b) => typeof a === 'string' && typeof b === 'string' && a.length === b.length && timingSafeEqual(Buffer.from(a),Buffer.from(b));
const challengeFor = verifier => createHash('sha256').update(verifier).digest('base64url');

export function createGoogleBroker({clientId, clientSecret, secret, callbackUrl, returnUrls = [], register,
  fetchImpl = fetch, now = Date.now, random = randomBytes} = {}) {
  let callback, key;
  const returns = new Set(returnUrls);
  try {
    callback = new URL(callbackUrl);
    if(callback.protocol !== 'https:' || callback.username || callback.password || callback.hash) callback = null;
    key = typeof secret === 'string' && /^[a-f0-9]{64}$/i.test(secret) ? Buffer.from(secret,'hex') : null;
  } catch {callback = null;}
  const validReturn = value => {
    if(!returns.has(value)) return false;
    try {const u=new URL(value);return u.protocol==='https:' && !u.username && !u.password && !u.search && !u.hash &&
      (/^[a-p]{32}\.chromiumapp\.org$/.test(u.hostname) || /^[a-z0-9-]+\.extensions\.allizom\.org$/.test(u.hostname));}
    catch {return false;}
  };
  const ready = !!(CLIENT.test(clientId || '') && typeof clientSecret === 'string' && clientSecret.length >= 8 && key && callback && returns.size && [...returns].every(validReturn));
  const chromeIds = new Set([...returns].map(value=>{try{return new URL(value).hostname.match(/^([a-p]{32})\.chromiumapp\.org$/)?.[1];}catch{return null;}}).filter(Boolean));
  // Firefox installation UUIDs vary. Origin is transport isolation, not app/user authentication.
  // Every sensitive operation also requires its encrypted, origin-bound transaction/session and PKCE verifier.
  const allowedOrigin = origin => /^moz-extension:\/\/[a-f0-9-]{36}$/i.test(origin || '') ||
    /^chrome-extension:\/\/([a-p]{32})$/.test(origin || '') && chromeIds.has(origin.slice('chrome-extension://'.length));
  const budgets = new Map();
  const fail = (code,status=400) => Object.assign(new Error(code),{safeCode:code,status});
  function seal(value,purpose) {
    const iv=random(12),cipher=createCipheriv('aes-256-gcm',key,iv);
    cipher.setAAD(Buffer.from('slotdesk-google-v1:'+purpose));
    const content=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);
    return Buffer.concat([iv,cipher.getAuthTag(),content]).toString('base64url');
  }
  function open(value,purpose) {
    try {
      if(typeof value!=='string' || value.length>12000 || !/^[A-Za-z0-9_-]+$/.test(value)) throw Error();
      const bytes=Buffer.from(value,'base64url');if(bytes.length<29)throw Error();
      const decipher=createDecipheriv('aes-256-gcm',key,bytes.subarray(0,12));
      decipher.setAAD(Buffer.from('slotdesk-google-v1:'+purpose));decipher.setAuthTag(bytes.subarray(12,28));
      const data=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8'));
      if(data.v!==1 || !Number.isFinite(data.expires) || data.expires<=now() || !validReturn(data.returnUri) || !allowedOrigin(data.origin) || !CHALLENGE.test(data.challenge))throw Error();
      return data;
    } catch {throw fail('AUTH_SESSION_INVALID',401);}
  }
  function verify(data,verifier,origin) {
    if(data.origin!==origin || !VERIFIER.test(verifier || '') || !equal(challengeFor(verifier),data.challenge)) throw fail('AUTH_PROOF_INVALID',401);
  }
  function authorization(ticket,state) {
    const target=new URL(AUTHORIZE);target.search=new URLSearchParams({client_id:clientId,redirect_uri:callback.href,response_type:'code',scope:GOOGLE_SCOPES.join(' '),
      state,code_challenge:ticket.challenge,code_challenge_method:'S256',access_type:'offline',prompt:'select_account consent'}).toString();return target.href;
  }
  async function boundedJson(request,limit=MAX_BODY) {
    if(Number(request.headers.get('content-length'))>limit)throw fail('REQUEST_TOO_LARGE',413);
    if(!/application\/json/i.test(request.headers.get('content-type') || ''))throw fail('JSON_REQUIRED',415);
    const reader=request.body?.getReader();let length=0,parts=[];
    if(!reader)throw fail('INVALID_REQUEST');
    try {for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>limit){await reader.cancel();throw fail('REQUEST_TOO_LARGE',413);}parts.push(value);}}
    finally {reader.releaseLock();}
    try {const value=JSON.parse(Buffer.concat(parts).toString('utf8'));if(!value || typeof value!=='object' || Array.isArray(value))throw Error();return value;}
    catch {throw fail('INVALID_REQUEST');}
  }
  function fields(body,names) {if(Object.keys(body).some(name=>!names.includes(name)))throw fail('INVALID_REQUEST');}
  async function google(body) {
    let response,data;
    try {
      response=await fetchImpl(TOKEN,{method:'POST',redirect:'error',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({...body,client_id:clientId,client_secret:clientSecret}).toString(),signal:AbortSignal.timeout(15000)});
      data=await boundedJson(response,65536);
    } catch {throw fail('AUTH_PROVIDER_UNAVAILABLE',503);}
    if(!response.ok) {
      if(data.error==='invalid_client')throw fail('AUTH_CONFIGURATION',503);
      if(data.error==='invalid_grant')throw fail('AUTH_RECONNECT',401);
      throw fail('AUTH_PROVIDER_REJECTED',response.status===429?429:400);
    }
    if(typeof data.access_token!=='string' || !data.access_token || data.access_token.length>8192 || !Number.isFinite(data.expires_in) || data.expires_in<=0 || data.expires_in>86400 || !/^Bearer$/i.test(data.token_type || ''))throw fail('AUTH_INVALID_RESPONSE',502);
    return data;
  }
  function credentials(data,context,previousRefresh,previousScopes) {
    const scopes=typeof data.scope==='string'?data.scope.split(/\s+/).filter(Boolean):previousScopes || [];
    if(GOOGLE_SCOPES.some(scope=>!scopes.includes(scope)))throw fail('AUTH_PERMISSIONS',403);
    const refresh=data.refresh_token || previousRefresh;
    if(typeof refresh!=='string' || !refresh || refresh.length>8192)throw fail('AUTH_RECONNECT',401);
    const expires=Math.min(context.expires || now()+SESSION_MS,now()+SESSION_MS,
      Number.isFinite(data.refresh_token_expires_in)?now()+data.refresh_token_expires_in*1000:Infinity);
    if(expires<=now())throw fail('AUTH_RECONNECT',401);
    return {token:data.access_token,expiresAt:now()+data.expires_in*1000,scopes,
      session:seal({v:1,returnUri:context.returnUri,origin:context.origin,challenge:context.challenge,expires,refresh,scopes},'session')};
  }
  return async function handle(request) {
    const url=new URL(request.url),op=url.searchParams.get('op') || 'status',origin=request.headers.get('origin');
    const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','Vary':'Origin'};
    if(allowedOrigin(origin))Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'});
    const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{...headers,'Content-Type':'application/json'}});
    if(request.method==='OPTIONS')return allowedOrigin(origin)?new Response(null,{status:204,headers}):json({error:'ORIGIN_NOT_ALLOWED'},403);
    if(op==='status' && request.method==='GET')return json({ready,version:'0.9.4.6',flow:'authorization-code'});
    if(!ready)return json({error:'AUTH_NOT_CONFIGURED'},503);
    try {
      if(op==='authorize' && request.method==='GET') {
        const state=url.searchParams.get('state'),ticket=open(state,'ticket');
        if(url.searchParams.get('redirect_uri')!==ticket.returnUri)throw fail('AUTH_RETURN_NOT_ALLOWED');
        return new Response(null,{status:302,headers:{...headers,'Location':authorization(ticket,state),'Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"}});
      }
      if(op==='callback' && request.method==='GET') {
        const state=url.searchParams.get('state'),ticket=open(state,'ticket'),code=url.searchParams.get('code'),providerError=url.searchParams.get('error');
        const target=new URL(ticket.returnUri);target.searchParams.set('state',state);
        if(providerError)target.searchParams.set('error',providerError==='access_denied'?'access_denied':'authorization_failed');
        else {if(typeof code!=='string' || !code || code.length>4096 || /\s/.test(code))throw fail('INVALID_REQUEST');target.searchParams.set('code',code);}
        return new Response(null,{status:302,headers:{...headers,'Location':target.href,'Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"}});
      }
      if(!allowedOrigin(origin))return json({error:'ORIGIN_NOT_ALLOWED'},403);
      if(request.method!=='POST')return json({error:'METHOD_NOT_ALLOWED'},405);
      const bucket=createHash('sha256').update(request.headers.get('x-real-ip') || 'unknown-client').digest('hex'),time=now();
      for(const [id,value]of budgets)if(value.until<=time)budgets.delete(id);
      function admit(){
        if(!budgets.has(bucket)){if(budgets.size>=256)budgets.delete(budgets.keys().next().value);budgets.set(bucket,{count:0,until:time+60000});}
        if(++budgets.get(bucket).count>60)throw fail('AUTH_RATE_LIMIT',429);
      }
      const body=await boundedJson(request);
      if(op==='start') {
        fields(body,['returnUri','challenge']);if(!validReturn(body.returnUri) || !CHALLENGE.test(body.challenge || ''))throw fail('AUTH_RETURN_NOT_ALLOWED');
        admit();
        const state=seal({v:1,returnUri:body.returnUri,challenge:body.challenge,origin,expires:time+TRANSACTION_MS},'ticket');
        const launch=new URL(callback.href);launch.searchParams.set('op','authorize');launch.searchParams.set('state',state);launch.searchParams.set('redirect_uri',body.returnUri);
        return json({state,launchUrl:launch.href});
      }
      if(op==='exchange') {
        fields(body,['state','code','verifier']);const ticket=open(body.state,'ticket');verify(ticket,body.verifier,origin);
        if(typeof body.code!=='string' || !body.code || body.code.length>4096 || /\s/.test(body.code))throw fail('INVALID_REQUEST');
        admit();
        const data=await google({code:body.code,code_verifier:body.verifier,redirect_uri:callback.href,grant_type:'authorization_code'});
        return json(credentials(data,{...ticket,expires:time+SESSION_MS}));
      }
      if(op==='refresh' || op==='registration') {
        fields(body,op==='refresh'?['session','verifier']:['session','verifier','record']);
        const session=open(body.session,'session');verify(session,body.verifier,origin);
        admit();
        if(op==='registration') {
          if(typeof register!=='function')throw fail('REGISTRATION_UNAVAILABLE',503);
          const result=await register(body.record);return result instanceof Response?new Response(result.body,{status:result.status,headers:{...headers,'Content-Type':'application/json'}}):json({accepted:true},202);
        }
        return json(credentials(await google({refresh_token:session.refresh,grant_type:'refresh_token'}),session,session.refresh,session.scopes));
      }
      throw fail('INVALID_REQUEST');
    } catch(error) {return json({error:error.safeCode || 'AUTH_TEMPORARILY_UNAVAILABLE'},error.status || 503);}
  };
}
