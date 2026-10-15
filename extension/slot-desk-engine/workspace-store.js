(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotWorkspaceStore=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  // Account namespaces retain profiles and pending outgoing invitations, never fetched events/tokens.
  function createStore(storage){
    const key=account=>`slotdesk-settings-v2:${account?'google:'+encodeURIComponent(account):'sample'}`;
    function load(account,fallback){
      const raw=storage.getItem(key(account));if(!raw)return fallback;
      const value=JSON.parse(raw);if(value?.version!==2||!Array.isArray(value.profiles)||!Array.isArray(value.constraints)||!value.settings||typeof value.settings!=='object')throw new Error('Saved workspace settings are invalid.');
      return {revision:Number.isSafeInteger(value.revision)?value.revision:0,profiles:value.profiles,constraints:value.constraints,settings:{...fallback.settings,...value.settings,onboardingComplete:typeof value.settings.onboardingComplete==='boolean'?value.settings.onboardingComplete:!!(value.settings.ownProfileId&&value.settings.defaultCalendarSelected)},...(value.pendingBooking?{pendingBooking:{...value.pendingBooking,account:value.pendingBooking.account||account}}:{}),...(value.pendingReschedule?{pendingReschedule:value.pendingReschedule}:{})};
    }
    const profileFields=['id','name','email','tz','tzConfirmed','required','enabled','calendarIds','calendarLabels','leaveCalendarIds','days','limit','radius','notice','availability','travel','flights','holidayExclusions','eventRules','eventOverrides','ruleTerms','airportRule','ignoreWorkingHours','ignoreConvenience','allowOverlap','workingMode','templateDays','templateHours','manualDays'];
    function save(account,state){
      const raw=storage.getItem(key(account)),current=raw?JSON.parse(raw):null,revision=Number.isSafeInteger(current?.revision)?current.revision:0;
      if(revision!==(state.revision||0)){const error=new Error('Another SlotDesk window changed this workspace. Review the updated details before sending.');error.code='WORKSPACE_CHANGED';throw error;}
      const profiles=state.profiles.map(profile=>Object.fromEntries(profileFields.filter(field=>profile[field]!==undefined).map(field=>[field,profile[field]]))),next=revision+1;
      storage.setItem(key(account),JSON.stringify({version:2,revision:next,profiles,constraints:state.constraints,settings:state.settings,...(state.pendingBooking?{pendingBooking:state.pendingBooking}:{}),...(state.pendingReschedule?{pendingReschedule:state.pendingReschedule}:{})}));state.revision=next;
    }
    function reset(account){storage.removeItem(key(account));}
    return {load,save,reset,raw:account=>storage.getItem(key(account))};
  }
  return {createStore};
});
