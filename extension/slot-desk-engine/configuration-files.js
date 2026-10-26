(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./workspace-model'),require('./profile-configuration'));else root.SlotConfigurationFiles=factory(root.SlotWorkspace,root.SlotProfileConfiguration);})(typeof self!=='undefined'?self:this,function(U,C){
  'use strict';
  const clone=C.clone,version='0.9.5.3',columns=C.fields.map(k=>k==='tz'?'timezone':k).concat('constraints');
  const settingKeys=['from','to','anchor','anchorLocation','duration','step','spacingMode','want','perDay','perDayMode','minDuration','extendDays','dateChoice','defaultCalendar','defaultCalendarSelected','calendarScopeConfirmed','workspaceCalendarIds','meetingsCalendars','meetingsCalendarLabels','meetingsFrom','meetingsTo','meetingsTimezone','meetingsTimezoneLocation','dismissSuggestions'];
  const defaults=p=>({...U.newProfile(p.email,p.name,p.tz),calendarLabels:{},eventRules:{},ruleTerms:{},airportRule:true});
  function safe(value){if(value&&typeof value==='object')for(const key of Object.keys(value)){if(['__proto__','constructor','prototype'].includes(key))throw new Error('The file contains an unsupported field.');safe(value[key]);}return value;}
  function constraint(c){if(!c||typeof c!=='object'||!['blocked','inconvenient'].includes(c.kind)||!C.instant(c.from)||!C.instant(c.to)||Date.parse(c.from)>=Date.parse(c.to)||typeof c.label!=='string')throw new Error('Check the protected or inconvenient time rules in this file.');return {kind:c.kind,from:c.from,to:c.to,label:c.label};}
  function exportFile(state,display,ids=null,now=new Date()){
    const profiles=ids===null?state.profiles:state.profiles.filter(p=>ids.includes(p.id));if(ids!==null&&!profiles.length)throw new Error('Select at least one profile.');
    const rows=profiles.map(p=>{const full={...defaults(p),...p,constraints:state.constraints.filter(c=>c.who===p.id).map(constraint)};return columns.map(k=>clone(full[k==='timezone'?'tz':k]===undefined?null:full[k==='timezone'?'tz':k]));});
    const file={format:ids===null?'slotdesk-backup':'slotdesk-profiles',schemaVersion:1,appVersion:version,exportedAt:now.toISOString(),columns:[...columns],rows};
    if(ids===null){file.settings=Object.fromEntries(settingKeys.filter(k=>state.settings[k]!==undefined).map(k=>[k,clone(state.settings[k])]));file.display={theme:display.theme,clock:display.clock,dateFormat:display.dateFormat};file.constraints=state.constraints.filter(c=>!c.who||c.who==='all').map(constraint);const known=new Set(state.profiles.map(p=>p.id));if(state.constraints.some(c=>c.who&&c.who!=='all'&&!known.has(c.who)))throw new Error('Some time rules refer to missing profiles. Correct those rules before backing up.');}
    return file;
  }
  function inspect(text){
    if(typeof text!=='string'||text.length>10*1024*1024)throw new Error('Choose a SlotDesk JSON file smaller than 10 MB.');let file;try{file=safe(JSON.parse(text));}catch(error){if(error instanceof SyntaxError)throw new Error('This file is not valid JSON.');throw error;}
    if(!file||!['slotdesk-backup','slotdesk-profiles'].includes(file.format)||!Array.isArray(file.columns)||!Array.isArray(file.rows)||file.rows.length>10000)throw new Error('Choose a SlotDesk backup or profile file.');
    if(file.columns.some(k=>typeof k!=='string')||new Set(file.columns).size!==file.columns.length)throw new Error('Column names must be unique text values.');
    for(const key of ['email','timezone'])if(!file.columns.includes(key))throw new Error('The required '+key+' column is missing.');
    if(file.rows.some(row=>!Array.isArray(row)||row.length!==file.columns.length))throw new Error('Each profile row must have a value for every column.');
    return {file,people:file.rows.map((row,index)=>{const get=k=>row[file.columns.indexOf(k)];return {index,email:String(get('email')||''),name:String(get('name')||get('email')||'Unnamed profile')};})};
  }
  const requireTrips=()=>typeof SlotTrips!=='undefined'?SlotTrips:require('./trips');
  function readProfiles(file,selected){
    const missing=columns.filter(k=>!['email','timezone','name'].includes(k)&&!file.columns.includes(k)),warnings=missing.length?['Missing settings use this version’s defaults: '+missing.join(', ')+'.']:[],seen=new Set(),profiles=[],rules=[];
    for(const index of selected){const row=file.rows[index];if(!row)throw new Error('Choose valid profile rows.');const values=Object.fromEntries(file.columns.map((k,i)=>[k,row[i]])),email=U.emailKey(values.email),name=typeof values.name==='string'&&values.name.trim()?values.name.trim():email,p=defaults({email,name,tz:values.timezone});
      if(seen.has(email))throw new Error('The selected file rows contain more than one profile for '+email+'.');seen.add(email);
      for(const key of C.fields){const publicKey=key==='tz'?'timezone':key;if(file.columns.includes(publicKey)){if(key!=='tzLocation'||values[publicKey]!==null)p[key]=clone(values[publicKey]);}}if(!file.columns.includes('eventDetectionEnabled'))p.eventDetectionEnabled=true;if(!file.columns.includes('keywordMatchingVersion'))p.keywordMatchingVersion=0;p.email=email;p.name=name;p.id='person:'+email;if(!file.columns.includes('tripSchemaVersion'))p.tripSchemaVersion=0;requireTrips().migrate(p);
      try{C.checkProfile(p);}catch(error){throw new Error((name||email)+': '+error.message);}
      const items=file.columns.includes('constraints')?values.constraints:[];if(!Array.isArray(items))throw new Error(name+': time rules must be a list.');rules.push(...items.map(c=>({...constraint(c),who:p.id})));profiles.push(p);
    }return {profiles,rules,warnings};
  }
  function validateSettings(settings){
    if(!settings||typeof settings!=='object'||Array.isArray(settings))throw new Error('Backup settings are missing or invalid.');
    const out={};for(const key of settingKeys){if(settings[key]===undefined)continue;const v=settings[key];
      if(['from','to','meetingsFrom','meetingsTo'].includes(key)&&!C.date(v))throw new Error('Invalid date setting: '+key+'.');
      if(['anchor','meetingsTimezone'].includes(key)&&!C.zone(v))throw new Error('Invalid timezone setting: '+key+'.');
      const bounds={duration:[1,1440],step:[5,1440],want:[1,20],perDay:[1,20],minDuration:[1,1440],extendDays:[0,30]};if(bounds[key]&&(!Number.isInteger(v)||v<bounds[key][0]||v>bounds[key][1]))throw new Error('Invalid number setting: '+key+'.');
      if(['spacingMode','perDayMode'].includes(key)&&!['automatic','custom'].includes(v))throw new Error('Invalid search mode: '+key+'.');
      if(['defaultCalendar','dateChoice'].includes(key)&&typeof v!=='string')throw new Error('Invalid setting: '+key+'.');
      if(['defaultCalendarSelected','calendarScopeConfirmed','dismissSuggestions'].includes(key)&&typeof v!=='boolean')throw new Error('Invalid setting: '+key+'.');
      if(['workspaceCalendarIds','meetingsCalendars'].includes(key)&&(!Array.isArray(v)||v.some(x=>typeof x!=='string'||!x)||new Set(v).size!==v.length))throw new Error('Invalid calendar selection.');
      if(key==='meetingsCalendarLabels'&&(!v||typeof v!=='object'||Array.isArray(v)||Object.values(v).some(x=>typeof x!=='string')))throw new Error('Invalid calendar labels.');if(['anchorLocation','meetingsTimezoneLocation'].includes(key)&&v!==null&&(!v||typeof v!=='object'||typeof v.timezone!=='string'||!C.zone(v.timezone)))throw new Error('Invalid timezone display location.');out[key]=clone(v);
    }if(out.spacingMode==='custom'&&out.step%5!==0)throw new Error('Custom spacing must use multiples of 5 minutes.');if(out.from&&out.to&&out.from>out.to||out.meetingsFrom&&out.meetingsTo&&out.meetingsFrom>out.meetingsTo)throw new Error('The start date must be before the end date.');return out;
  }
  function displaySettings(v){if(v!==undefined&&(!v||typeof v!=='object'||Array.isArray(v)))throw new Error('Invalid display preferences in this backup.');const out={theme:'system',clock:'24',dateFormat:'dmy',...v};if(!['system','light','dark'].includes(out.theme)||!['12','24'].includes(out.clock)||!['dmy','mdy'].includes(out.dateFormat))throw new Error('Invalid display preferences in this backup.');return {theme:out.theme,clock:out.clock,dateFormat:out.dateFormat};}
  function prepare({file,selected,current,fresh,calendars=null,restore=false,epoch}){
    if(current.pendingBooking||current.pendingReschedule)throw new Error('Resolve the unconfirmed calendar change before importing or restoring.');
    if(restore&&file.format!=='slotdesk-backup')throw new Error('Choose a complete SlotDesk backup to restore.');
    const indexes=restore?file.rows.map((_,i)=>i):[...new Set(selected||[])];if(!indexes.length&&!restore)throw new Error('Select at least one profile.');
    const {profiles,rules,warnings}=readProfiles(file,indexes),own=current.profiles.find(p=>p.id===current.settings.ownProfileId),ownEmail=U.emailKey(own?.email);
    if(!restore&&own&&profiles.some(p=>p.email===ownEmail))throw new Error('Your own profile cannot be changed by profile import. Deselect '+ownEmail+' and try again.');
    const next=restore?clone(fresh):clone(current),aliases=new Map();let display=null;
    if(restore&&typeof current.settings.leadSharingConsent==='boolean')next.settings.leadSharingConsent=current.settings.leadSharingConsent;
    if(restore){next.settings={...next.settings,...validateSettings(file.settings),configurationEpoch:epoch,workspaceVersion:version};display=displaySettings(file.display);const missingSettings=settingKeys.filter(k=>fresh.settings[k]!==undefined&&file.settings[k]===undefined);if(missingSettings.length)warnings.push('Missing workspace settings use defaults: '+missingSettings.join(', ')+'.');if(['theme','clock','dateFormat'].some(k=>file.display?.[k]===undefined))warnings.push('Missing display preferences use defaults.');if(!Array.isArray(file.constraints))throw new Error('Backup time rules are missing or invalid.');next.constraints=file.constraints.map(c=>({...constraint(c),who:'all'}));if(current.settings.leadRegistration)next.settings.leadRegistration=clone(current.settings.leadRegistration);next.settings.onboardingComplete=!!own&&!!current.settings.onboardingComplete;next.settings.ownProfileId=own?.id||'';next.settings.ownProfileSetupRequired=!own;}
    const replaced=[];for(const p of profiles){const existing=(restore?(p.email===ownEmail?own:null):current.profiles.find(x=>U.emailKey(x.email)===p.email));if(existing){aliases.set(p.id,existing.id);p.id=existing.id;if(!restore)replaced.push(p.name);}if(restore)next.profiles.push(p);else{next.profiles=next.profiles.filter(x=>U.emailKey(x.email)!==p.email);next.profiles.push(p);}}
    if(restore&&own&&!profiles.some(p=>p.email===ownEmail)){next.profiles.push(clone(own));next.constraints.push(...current.constraints.filter(c=>c.who===own.id).map(clone));}
    if(!restore){const changedIds=new Set(profiles.map(p=>p.id));next.constraints=next.constraints.filter(c=>!changedIds.has(c.who));}
    next.constraints.push(...rules.map(c=>({...c,who:aliases.get(c.who)||c.who})));
    if(restore&&own){next.settings.ownProfileId=own.id;next.settings.ownProfileSetupRequired=false;}
    const selectedCalendars=new Set(next.settings.workspaceCalendarIds||[]),referenced=new Map();for(const p of profiles)for(const id of p.calendarIds)referenced.set(id,p.calendarLabels?.[id]||id);if(restore)for(const id of selectedCalendars)referenced.set(id,id);
    for(const [id,label]of referenced){const cal=calendars?.find(c=>c.id===id);if(calendars===null)warnings.push(label+': calendar access not checked yet.');else if(!cal)warnings.push(label+': calendar unavailable; its events cannot be checked.');else if(next.settings.calendarScopeConfirmed&&!selectedCalendars.has(id))warnings.push(label+': excluded from this workspace; its events will not be checked.');else if(cal.accessRole==='freeBusyReader')warnings.push(label+': only busy times are available.');}
    if(restore){if(!selectedCalendars.size)next.settings.calendarScopeConfirmed=false;next.settings.calendarConfigurationUnchecked=calendars===null;const id=next.settings.defaultCalendar,cal=calendars?.find(c=>c.id===id);if(id&&(!selectedCalendars.has(id)||calendars===null||!cal||!U.writable(cal)))warnings.push('The saved default calendar needs verification. Choose an organizing calendar for each meeting, or update the default in Settings.');}
    if(replaced.length)warnings.unshift('These existing profiles will be replaced: '+replaced.join(', ')+'.');
    return {state:next,display,warnings:[...new Set(warnings)],replaced};
  }
  return {columns,settingKeys,exportFile,inspect,prepare,readProfiles,validateSettings};
});
