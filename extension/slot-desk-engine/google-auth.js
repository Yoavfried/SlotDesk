(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./recovery.js'));else root.SlotGoogleAuth=factory(root.SlotRecovery);})(typeof self!=='undefined'?self:this,function(R){
  'use strict';
  const SCOPES=['https://www.googleapis.com/auth/calendar.events','https://www.googleapis.com/auth/calendar.calendarlist.readonly','https://www.googleapis.com/auth/calendar.events.freebusy'];
  const validClient=id=>typeof id==='string'&&/^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/i.test(id);
  function configuredManifest(manifest,id){if(!validClient(id))throw new Error('Enter the full Chrome extension OAuth client ID ending in .apps.googleusercontent.com.');return {...manifest,oauth2:{client_id:id.trim(),scopes:[...SCOPES]}};}
  function createAuth(identity){
    let pending=null;
    async function getToken(interactive=false){
      if(pending)return pending;
      pending=(async()=>{let result;try{result=await identity.getAuthToken({interactive,enableGranularPermissions:true,scopes:[...SCOPES]});}catch(error){throw R.auth(error,interactive);}
        if(!result?.token)throw R.auth(null,interactive);
        if(Array.isArray(result.grantedScopes)&&SCOPES.some(scope=>!result.grantedScopes.includes(scope))){await identity.removeCachedAuthToken({token:result.token});throw R.issue('permissions','Review Google permissions to enable the calendar list, events and free/busy features. Your saved profiles are kept.',{requiresReconnect:true});}
        return result.token;
      })();try{return await pending;}finally{pending=null;}
    }
    return {getToken,invalidateToken:token=>identity.removeCachedAuthToken({token}),disconnect:()=>identity.clearAllCachedAuthTokens()};
  }
  return {SCOPES,validClient,configuredManifest,createAuth};
});
