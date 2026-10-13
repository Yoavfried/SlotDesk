(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotGoogleAuth=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const SCOPES=['https://www.googleapis.com/auth/calendar.events','https://www.googleapis.com/auth/calendar.calendarlist.readonly','https://www.googleapis.com/auth/calendar.events.freebusy'];
  const validClient=id=>typeof id==='string'&&/^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/i.test(id);
  function configuredManifest(manifest,id){if(!validClient(id))throw new Error('Enter the full Chrome extension OAuth client ID ending in .apps.googleusercontent.com.');return {...manifest,oauth2:{client_id:id.trim(),scopes:[...SCOPES]}};}
  function createAuth(identity){
    async function getToken(interactive=false){
      let result;try{result=await identity.getAuthToken({interactive,enableGranularPermissions:true,scopes:[...SCOPES]});}catch(_){throw new Error('Google connection was not completed. Click Connect Google to retry using the intended Chrome profile. If Google says access is blocked, ask the person who sent you SlotDesk to add your Google email to the pilot. Open Help from the question-mark icon.');}
      if(!result?.token)throw new Error('No Google access token was provided. Click Connect Google to retry.');
      if(Array.isArray(result.grantedScopes)&&SCOPES.some(scope=>!result.grantedScopes.includes(scope)))throw new Error('SlotDesk needs all three calendar permissions. Connect again and allow calendar list, event reading and writing, and free/busy access.');
      return result.token;
    }
    return {getToken,invalidateToken:token=>identity.removeCachedAuthToken({token}),disconnect:()=>identity.clearAllCachedAuthTokens()};
  }
  return {SCOPES,validClient,configuredManifest,createAuth};
});
