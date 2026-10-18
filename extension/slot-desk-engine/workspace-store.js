(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotWorkspaceStore=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  // Account namespaces retain profiles and pending outgoing invitations, never fetched events/tokens.
  function createStore(storage){
    const key=account=>`slotdesk-settings-v2:${account?'google:'+encodeURIComponent(account):'sample'}`;
    const transactionKey='slotdesk-configuration-transaction';
    const pendingReplacement=()=>!!storage.getItem(transactionKey);
    function load(account,fallback){
      const raw=storage.getItem(key(account));if(!raw)return fallback;
      const value=JSON.parse(raw);if(value?.version!==2||!Array.isArray(value.profiles)||!Array.isArray(value.constraints)||!value.settings||typeof value.settings!=='object')throw new Error('Saved workspace settings are invalid.');
      return {revision:Number.isSafeInteger(value.revision)?value.revision:0,profiles:value.profiles,constraints:value.constraints,settings:{...fallback.settings,...value.settings,onboardingComplete:typeof value.settings.onboardingComplete==='boolean'?value.settings.onboardingComplete:!!(value.settings.ownProfileId&&value.settings.defaultCalendarSelected)},...(value.pendingBooking?{pendingBooking:{...value.pendingBooking,account:value.pendingBooking.account||account}}:{}),...(value.pendingReschedule?{pendingReschedule:value.pendingReschedule}:{})};
    }
    const profileFields=['id','name','email','tz','tzConfirmed','required','enabled','calendarIds','calendarLabels','leaveCalendarIds','days','limit','radius','notice','availability','travel','flights','holidayExclusions','eventRules','eventOverrides','ruleTerms','airportRule','ignoreWorkingHours','ignoreConvenience','allowOverlap','workingMode','templateDays','templateHours','manualDays'];
    function save(account,state){
      if(pendingReplacement())throw new Error('A setup replacement needs recovery. Reload SlotDesk before saving.');
      const raw=storage.getItem(key(account)),current=raw?JSON.parse(raw):null,revision=Number.isSafeInteger(current?.revision)?current.revision:0;
      if(revision!==(state.revision||0)){const error=new Error('Another SlotDesk window changed this workspace. Review the updated details before sending.');error.code='WORKSPACE_CHANGED';throw error;}
      const profiles=state.profiles.map(profile=>Object.fromEntries(profileFields.filter(field=>profile[field]!==undefined).map(field=>[field,profile[field]]))),next=revision+1;
      storage.setItem(key(account),JSON.stringify({version:2,revision:next,profiles,constraints:state.constraints,settings:state.settings,...(state.pendingBooking?{pendingBooking:state.pendingBooking}:{}),...(state.pendingReschedule?{pendingReschedule:state.pendingReschedule}:{})}));state.revision=next;
    }
    function reset(account){storage.removeItem(key(account));}
    function rollback(record){for(const [name,value]of [[record.key,record.workspace],['slotdesk-display',record.display]]){if(value===null)storage.removeItem(name);else storage.setItem(name,value);}storage.removeItem(transactionKey);}
    async function recoverConfiguration(locks){if(!locks?.request)throw new Error('This browser cannot coordinate a setup replacement.');return locks.request('slotdesk-configuration',{mode:'exclusive'},()=>{const raw=storage.getItem(transactionKey);if(raw)rollback(JSON.parse(raw));});}
    async function replaceConfiguration(account,state,display,locks,expected){
      if(!locks?.request||!account)throw new Error('This browser cannot coordinate a setup replacement.');
      return locks.request('slotdesk-configuration',{mode:'exclusive'},()=>locks.request('slotdesk-workspace:'+account,{mode:'exclusive'},()=>{
        if(pendingReplacement())throw new Error('Reload SlotDesk to recover the previous setup replacement.');
        const old=storage.getItem(key(account));if(old!==expected){const error=new Error('Your setup changed in another window. Choose the file again to review the current setup.');error.code='WORKSPACE_CHANGED';throw error;}
        let previous;try{previous=JSON.parse(old||'null');}catch(_){previous=null;}
        if(previous?.pendingBooking||previous?.pendingReschedule)throw new Error('Resolve the unconfirmed calendar change before replacing your setup.');
        const next=JSON.parse(JSON.stringify(state));next.revision=(Number.isSafeInteger(previous?.revision)?previous.revision:0)+1;
        const record={key:key(account),workspace:old,display:storage.getItem('slotdesk-display')};
        storage.setItem(transactionKey,JSON.stringify(record));
        try{storage.setItem(key(account),JSON.stringify({version:2,...next}));if(display)storage.setItem('slotdesk-display',JSON.stringify(display));storage.removeItem(transactionKey);}catch(error){try{rollback(record);}catch(_){throw new Error('The setup could not be saved or fully recovered. Reload SlotDesk to recover; calendar events have not changed.');}throw error;}
        return next;
      }));
    }
    function recoveryRaw(account){try{const record=JSON.parse(storage.getItem(transactionKey)||'null');if(record?.key===key(account))return record.workspace;}catch(_){}return storage.getItem(key(account));}
    return {load,save,reset,recoveryRaw,replaceConfiguration,recoverConfiguration,pendingReplacement,transactionKey,raw:account=>storage.getItem(key(account))};
  }
  return {createStore};
});
