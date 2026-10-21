(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotRecovery=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  function issue(kind,message,extra={}){const error=new Error(message);return Object.assign(error,{kind,retryable:['network','timeout','temporary','rate'].includes(kind),requiresReconnect:kind==='auth',...extra});}
  function retryDelay(value,now=Date.now()){if(!value)return 0;const seconds=Number(value);return Number.isFinite(seconds)?Math.max(0,seconds*1000):Math.max(0,Date.parse(value)-now)||0;}
  function provider(status,reasons=[],{write=false,retryAfter,now}={}){
    const has=pattern=>reasons.some(reason=>pattern.test(reason));let kind,message;
    if(status===401){kind='auth';message='Reconnect Google to continue. Your saved profiles and draft are kept.';}
    else if(has(/accessNotConfigured|serviceDisabled|invalidClient/i)){kind='configuration';message='SlotDesk’s Google connection needs attention from its owner. Open Help for support.';}
    else if(has(/quotaExceeded|dailyLimitExceeded|limitExceeded/i)&&!has(/rateLimit/i)){kind='quota';message='Google’s usage limit was reached. Keep your draft and try later. Help has more information.';}
    else if(status===429||has(/rateLimit/i)){kind='rate';message='Google is temporarily limiting requests. Keep your draft; another attempt will be available shortly.';}
    else if(status===403){kind='access';message='Google did not allow access to this calendar or operation. Check calendar sharing and the connected account.';}
    else if(status===404||status===410){kind='missing';message='This calendar or meeting is no longer accessible. Check access before changing it.';}
    else if(status===412){kind='changed';message='Someone changed this meeting. Refresh its details and review your changes again.';}
    else if(status===409){kind='duplicate';message='This meeting identifier already exists. Check the same meeting before retrying.';}
    else if(status>=500){kind='temporary';message='Google Calendar is temporarily unavailable. Try again when you’re ready.';}
    else{kind='invalid';message='Google could not accept these details. Review the fields or open Help.';}
    if(write&&status>=500)message='Google could not confirm the calendar change. Check the result before retrying the same operation.';
    return issue(kind,message,{code:status,outcome:write&&status>=500?'uncertain':write?'rejected':'read_failed',uncertain:write&&status>=500,retryAt:retryAfter?(now??Date.now())+retryDelay(retryAfter,now):0,reasons:[...reasons]});
  }
  function network(error,{write=false,cancelled=false,offline=false}={}){if(cancelled)return issue('cancelled','Loading stopped. The data shown may be incomplete.',{outcome:'read_failed'});return issue(offline?'offline':error?.name==='AbortError'?'timeout':'network',write?'The calendar change could not be confirmed. Check the result before retrying.':offline?'You’re offline. You can keep editing saved details; calendar changes need a connection.':error?.name==='AbortError'?'Google Calendar took too long to respond. Try again when you’re ready.':'Could not reach Google Calendar. Check the connection and try again.',{uncertain:write,outcome:write?'uncertain':'read_failed',retryable:!offline});}
  function auth(error,interactive){
    if(error?.diagnosticCode&&error?.kind)return error;
    const text=String(error?.message||error||''),report=(kind,code,message,extra={})=>issue(kind,message+' Reference: '+code+'.',{diagnosticCode:code,...extra});
    if(/turned off browser sign.?in|browser sign.?in.*(disabled|not allowed|disallowed)/i.test(text))return report('browser-auth','G102','This browser has Google sign-in disabled or unavailable. Open SlotDesk in a Chrome profile with Google sign-in enabled.');
    if(/identity\.getAuthToken.*(unavailable|not a function)|getAuthToken is not a function/i.test(text))return report('browser-auth','G101','This browser does not support SlotDesk’s current Google connection. Open SlotDesk in Google Chrome to connect.');
    if(/admin_policy|administrator|blocked by.*(organization|organisation|admin)/i.test(text))return report('organization','G104','Your organization blocked SlotDesk’s Google access. Ask your administrator to review it.');
    if(/invalid_client|invalid.*client.?id|client.*(invalid|not found)|OAuth2.*invalid|redirect_uri_mismatch|invalid.*scopes/i.test(text))return report('configuration','G105','SlotDesk’s Google connection needs attention from its owner. Open Help for support.');
    if(interactive&&/cancel|did not approve|denied by user|user rejected/i.test(text))return report('cancelled','G109','Connection wasn’t completed. You can connect Google when you’re ready.');
    if(/not signed in|no.*(Google )?account|user.*not.*signed/i.test(text))return report('auth','G103','No Google account is available to this browser’s sign-in service. Sign in to Google in Chrome, then reconnect.',{requiresReconnect:true});
    if(/not granted|revoked|missing required scopes/i.test(text))return report('permissions','G106','Google Calendar permissions are missing or were withdrawn. Reconnect and allow calendar events, calendar list and availability access.',{requiresReconnect:true});
    if(/network|net::ERR_|timed? out|timeout|failed to fetch|connection failed/i.test(text))return report('network','G107','Could not reach Google sign-in. Check your internet connection and try again.');
    if(!text)return report(interactive?'connection':'auth','G108',interactive?'The browser returned no Google sign-in token. Try connecting again; open Help if it continues.':'Reconnect Google to continue. Your saved profiles and draft are kept.',{requiresReconnect:!interactive});
    return report(interactive?'connection':'auth','G199',interactive?'Google connection wasn’t completed. Try again. If it keeps failing, open Help for support.':'Reconnect Google to continue. Your saved profiles and draft are kept.',{requiresReconnect:!interactive});
  }
  function describe(error){if(error?.kind)return error;return issue('unknown',error?.message||String(error||'This action could not be completed.'));}
  function metadata(error){const e=describe(error);return {kind:e.kind,message:e.message,code:e.code,retryable:!!e.retryable,requiresReconnect:!!e.requiresReconnect,retryAt:e.retryAt||0,outcome:e.outcome,...(e.diagnosticCode?{diagnosticCode:e.diagnosticCode}:{})};}
  const transient=source=>source?.failure?.retryable===true||['auth','cancelled','offline'].includes(source?.failure?.kind);
  function pending(state){return state.pendingBooking?{type:'booking',value:state.pendingBooking}:state.pendingReschedule?{type:'change',value:state.pendingReschedule}:null;}
  const operationKey=item=>item?.type==='booking'?item.value.request?.eventId:item?.value.operationId;
  function resolveManually(state,item,result,now=new Date().toISOString()){
    if(!['found','unverified'].includes(result))throw new Error('Choose how you checked this calendar change.');const current=pending(state);if(!current||operationKey(current)!==operationKey(item)||current.type!==item.type)throw new Error('The unfinished calendar change changed in another window.');
    state.settings.recoveryHistory=[...(state.settings.recoveryHistory||[]),{id:operationKey(item),type:item.type,operation:JSON.parse(JSON.stringify(item.value)),status:result==='found'?'reported_found':'unverified',resolvedAt:now}];
    if(item.type==='booking')delete state.pendingBooking;else delete state.pendingReschedule;return state.settings.recoveryHistory.at(-1);
  }
  function sameVersion(a,b){const parts=v=>String(v||'0').split('.').map(Number),x=parts(a),y=parts(b);for(let i=0;i<Math.max(x.length,y.length);i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)-(y[i]||0);}return 0;}
  return {issue,provider,network,auth,describe,metadata,transient,retryDelay,pending,operationKey,resolveManually,sameVersion};
});
