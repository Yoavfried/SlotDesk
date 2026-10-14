(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./slotdesk-engine.js'));else root.SlotWorkspace=factory(root.SlotEngine);})(typeof self!=='undefined'?self:this,function(E){
  'use strict';
  const emailKey=value=>String(value||'').trim().toLowerCase();
  const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailKey(value));
  const writable=calendar=>['owner','writer','writerWithoutPrivateAccess'].includes(calendar.accessRole);
  function schedule(days,hours='09:00|18:00'){const [s,e]=hours.split('|');return Object.fromEntries(Array.from({length:7},(_,d)=>[d,{on:(days==='sun-thu'?[0,1,2,3,4]:[1,2,3,4,5]).includes(d),s,e}]));}
  function newProfile(email='',name='',tz='',calendars=[]){const key=emailKey(email),mapped=calendars.filter(c=>emailKey(c.id)===key);return {id:key?'person:'+key:'person:'+globalThis.crypto.randomUUID(),email:key,name,tz,tzConfirmed:false,enabled:true,required:true,calendarIds:mapped.map(c=>c.id),leaveCalendarIds:[],workingMode:'template',templateDays:tz==='Asia/Jerusalem'?'sun-thu':'mon-fri',templateHours:'09:00|18:00',manualDays:schedule(tz==='Asia/Jerusalem'?'sun-thu':'mon-fri'),days:schedule(tz==='Asia/Jerusalem'?'sun-thu':'mon-fri'),ignoreWorkingHours:false,ignoreConvenience:false,allowOverlap:false,limit:{s:'07:00',e:'20:00'},radius:{minutes:0,mode:'inconvenient'},notice:0,availability:[],travel:[],flights:[],holidayExclusions:[],eventOverrides:{}};}
  function migrate(state,account){
    const byEmail=new Map(),others=[];
    for(const old of state.profiles){const p={...old,email:emailKey(old.email)},key=p.email;if(!p.workingMode){p.workingMode='manual';p.manualDays=p.days||schedule(p.tz==='Asia/Jerusalem'?'sun-thu':'mon-fri');}p.templateDays=p.templateDays||(p.tz==='Asia/Jerusalem'?'sun-thu':'mon-fri');p.templateHours=p.templateHours||'09:00|18:00';p.manualDays=p.manualDays||p.days||schedule(p.templateDays);p.ignoreWorkingHours=!!p.ignoreWorkingHours;p.ignoreConvenience=p.ignoreConvenience===true;p.allowOverlap=p.allowOverlap===true;
      if(!key){others.push(p);continue;}if(byEmail.has(key)){const first=byEmail.get(key);first.calendarIds=[...new Set([...(first.calendarIds||[]),...(p.calendarIds||[])])];first.leaveCalendarIds=[...new Set([...(first.leaveCalendarIds||[]),...(p.leaveCalendarIds||[])])];}else byEmail.set(key,p);
    }
    state.profiles=[...byEmail.values(),...others];const own=state.profiles.find(p=>p.email===emailKey(account));
    if(own&&!state.settings.ownProfileId){state.settings.ownProfileId=own.id;own.enabled=false;}
    state.settings.guestProfiles=(state.settings.guestProfiles||[]).filter(p=>validEmail(p.email)&&!state.profiles.some(saved=>emailKey(saved.email)===emailKey(p.email)));const known=new Set([...state.profiles,...state.settings.guestProfiles].map(p=>p.id));state.settings.participantIds=[...new Set((Array.isArray(state.settings.participantIds)?state.settings.participantIds:[]).filter(id=>known.has(id)))];return state;
  }
  function participant(state,id){return state.profiles.find(p=>p.id===id)||(state.settings.guestProfiles||[]).find(p=>p.id===id);}
  function effectiveParticipant(state,p){return {...p,...Object.fromEntries(Object.entries(state.settings.participantRules?.[p.id]||{}).filter(([k,v])=>['required','ignoreWorkingHours','ignoreConvenience','allowOverlap'].includes(k)&&typeof v==='boolean'))};}
  function selectedProfiles(state){return (state.settings.participantIds||[]).map(id=>participant(state,id)).filter(Boolean).map(p=>effectiveParticipant(state,p));}
  function addParticipant(state,id){if(!participant(state,id))return false;state.settings.participantIds=[...new Set([...(state.settings.participantIds||[]),id])];state.settings.manualParticipantIds=[...new Set([...(state.settings.manualParticipantIds||[]),id])];state.settings.removedAutomaticParticipantIds=(state.settings.removedAutomaticParticipantIds||[]).filter(value=>value!==id);return true;}
  function removeParticipant(state,id){state.settings.participantIds=(state.settings.participantIds||[]).filter(value=>value!==id);state.settings.manualParticipantIds=(state.settings.manualParticipantIds||[]).filter(value=>value!==id);state.settings.removedAutomaticParticipantIds=[...new Set([...(state.settings.removedAutomaticParticipantIds||[]),id])];}
  function addEmailGuest(state,email){const key=emailKey(email);if(!validEmail(key))throw new Error('Enter a valid email address.');let p=[...state.profiles,...(state.settings.guestProfiles||[])].find(p=>emailKey(p.email)===key);if(!p){p=newProfile(key,key,'',[]);state.settings.guestProfiles=[...(state.settings.guestProfiles||[]),p];}addParticipant(state,p.id);return p;}
  function confirmGuestTimezone(state,id,zone){const p=(state.settings.guestProfiles||[]).find(p=>p.id===id);if(!p||typeof zone!=='string'||!zone)throw new Error('Choose a guest timezone.');try{E.partsIn(0,zone);}catch(_){throw new Error('Choose a supported timezone.');}p.tz=zone;p.tzConfirmed=true;p.templateDays=zone==='Asia/Jerusalem'?'sun-thu':'mon-fri';p.days=schedule(p.templateDays,p.templateHours||'09:00|18:00');p.manualDays=schedule(p.templateDays,p.templateHours||'09:00|18:00');return p;}
  function setParticipantRule(state,id,key,value){if(!['required','ignoreWorkingHours','ignoreConvenience','allowOverlap'].includes(key)||typeof value!=='boolean')throw new Error('Invalid participant setting.');state.settings.participantRules={...(state.settings.participantRules||{}),[id]:{...(state.settings.participantRules?.[id]||{}),[key]:value}};}
  function promoteGuest(state,profile){const old=(state.settings.guestProfiles||[]).find(p=>emailKey(p.email)===emailKey(profile.email));state.settings.guestProfiles=(state.settings.guestProfiles||[]).filter(p=>p.id!==profile.id&&emailKey(p.email)!==emailKey(profile.email));if(old&&old.id!==profile.id){for(const key of ['participantIds','manualParticipantIds','autoParticipantIds','removedAutomaticParticipantIds'])state.settings[key]=(state.settings[key]||[]).map(id=>id===old.id?profile.id:id);if(state.settings.participantRules?.[old.id]){state.settings.participantRules[profile.id]=state.settings.participantRules[old.id];delete state.settings.participantRules[old.id];}}}
  function switchOrganizingCalendar(state,id,available){const previous=new Set(state.settings.autoParticipantIds||[]),manual=new Set(state.settings.manualParticipantIds||(state.settings.participantIds||[]).filter(id=>!previous.has(id))),removed=new Set(state.settings.removedAutomaticParticipantIds||[]);const auto=available.includes(id)?state.profiles.filter(p=>(p.calendarIds||[]).includes(id)).map(p=>p.id):[];const keep=(state.settings.participantIds||[]).filter(id=>!previous.has(id)||manual.has(id));state.settings.participantIds=[...new Set([...keep,...auto.filter(id=>!removed.has(id))])];state.settings.autoParticipantIds=auto;state.settings.manualParticipantIds=[...manual];state.settings.organizingCalendar=id;return selectedProfiles(state);}
  function matchProfiles(profiles,query='',excluded=[]){const omit=new Set(excluded||[]),terms=String(query).trim().toLowerCase().split(/\s+/).filter(Boolean);return profiles.filter(p=>!omit.has(p.id)&&terms.every(term=>(String(p.name||'')+' '+String(p.email||'')).toLowerCase().includes(term))).sort((a,b)=>String(a.name||a.email).localeCompare(String(b.name||b.email))||String(a.email).localeCompare(String(b.email)));}
  function dateRange(choice,zone,now=Date.now()){
    const local=E.partsIn(now,zone),today=local.ymd,week=E.addDaysYmd(today,-(zone==='Asia/Jerusalem'?local.wd:(local.wd+6)%7));
    return choice==='next'?{from:E.addDaysYmd(week,7),to:E.addDaysYmd(week,13)}:{from:today,to:E.addDaysYmd(week,6)};
  }
  function formatClock(value,format='24'){if(!/^\d{2}:\d{2}$/.test(value||''))return value||'';const [h,m]=value.split(':').map(Number);return format==='12'?`${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`:value;}
  function parseClock(value){const match=String(value||'').trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);if(!match)return '';let h=+match[1],m=+match[2];if(m>59)return '';if(match[3]){if(h<1||h>12)return '';h=h%12+(/pm/i.test(match[3])?12:0);}else if(h>23)return '';return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
  function localTime(instant,zone,format='24'){return new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hour12:format==='12'}).format(new Date(instant));}
  function compactDate(instant,zone,{now=Date.now(),referenceZone=Intl.DateTimeFormat().resolvedOptions().timeZone,dateFormat='dmy'}={}){
    const year=+E.partsIn(Number(new Date(instant)),zone).ymd.slice(0,4),current=+E.partsIn(Number(new Date(now)),referenceZone).ymd.slice(0,4);
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:zone,weekday:'short',month:'short',day:'numeric',...(year>current?{year:'numeric'}:{})}).formatToParts(new Date(instant)).map(p=>[p.type,p.value]));
    return parts.weekday+', '+(dateFormat==='mdy'?parts.month+' '+parts.day+(parts.year?', '+parts.year:''):parts.day+' '+parts.month+(parts.year?' '+parts.year:''));
  }
  function compactRange(start,end,zone,format='24',options={}){
    const endZone=options.endZone||zone,sameDate=E.partsIn(Number(new Date(start)),zone).ymd===E.partsIn(Number(new Date(end)),endZone).ymd;
    return compactDate(start,zone,options)+', '+localTime(start,zone,format).toUpperCase()+' - '+(sameDate?'':compactDate(end,endZone,options)+', ')+localTime(end,endZone,format).toUpperCase();
  }
  function offsetAt(instant,zone){const value=new Intl.DateTimeFormat('en-GB',{timeZone:zone,timeZoneName:'shortOffset'}).formatToParts(new Date(instant)).find(p=>p.type==='timeZoneName').value;return value==='GMT'?'GMT+0':value;}
  function zoneLabel(start,end,zone,endZone=zone){const from=offsetAt(start,zone),to=offsetAt(end,endZone);return endZone!==zone?zone+' ('+from+') → '+endZone+' ('+to+')':zone+' ('+from+(from===to?'':' → '+to)+')';}
  function calendarDataSummary(slot){
    const unknown=slot.people.filter(p=>p.confirmed!==true);
    return {label:unknown.length?'Calendar data incomplete':'Calendar data complete',incomplete:!!unknown.length,
      explanation:unknown.length?'Complete calendar data was unavailable for: '+unknown.map(p=>p.name+(p.required===false?' (optional)':'')).join(', ')+'. Their availability is unconfirmed.':'Calendar data covers this time for every included participant. Fit and conflicts are shown below; this does not mean invitations were accepted.'};
  }
  function participantFit(p){
    const timing=p.band==='bad'?'Outside acceptable hours':p.band==='stretch'?(p.inconvenientMinutes?p.inconvenientMinutes+' inconvenient minutes':'Inconvenient time'):'Comfortable time';
    const incomplete=p.confirmed!==true,clash=p.hasCalendarConflict??(!p.available&&p.band!=='no');
    if(clash)return {label:'Calendar conflict',tone:'stop',detail:[p.calendarConflictCount?p.calendarConflictCount+' overlapping meeting'+(p.calendarConflictCount===1?'':'s'):'Overlaps an existing meeting',p.band!=='ok'?timing:'',incomplete?'Calendar data incomplete':''].filter(Boolean).join(' · ')};
    if(p.band==='no')return {label:'Does not fit profile',tone:'stop',detail:[p.availabilityReason||'Outside stated availability or profile rules',incomplete?'Calendar data incomplete':''].filter(Boolean).join(' · ')};
    if(incomplete)return {label:'Availability unconfirmed',tone:'warn',detail:'Calendar data incomplete · '+timing};
    if(p.band!=='ok')return {label:p.band==='bad'?'Outside acceptable hours':'Inconvenient time',tone:'warn',detail:'No calendar conflicts · '+timing};
    return {label:'Fits well',tone:'good',detail:'No calendar conflicts · Comfortable time'};
  }
  function proposalWarnings(slot,{clock='24',dateFormat='dmy',referenceZone,contactFor}={}){
    const warnings=[],seen=new Set(),duplicateNotes=new Set(),overridden=new Set((slot.overrides||[]).flatMap(c=>c.participants||[]));
    const add=(title,detail,identity)=>{const key=identity??title+'\n'+detail;if(!seen.has(key)){seen.add(key);warnings.push({title,detail});}};
    const local=p=>compactRange(slot.start,slot.end,p.tz,clock,{referenceZone,dateFormat,endZone:p.endTz})+' · '+zoneLabel(slot.start,slot.end,p.tz,p.endTz);
    for(const p of slot.people){
      if(['stretch','bad'].includes(p.band)){
        add(p.name+': '+(p.band==='bad'?'Outside acceptable hours':'Inconvenient time'),local(p)+'. '+(p.inconvenientMinutes?p.inconvenientMinutes+' minutes fall outside their comfortable times.':'This time falls outside their comfortable times.')+(p.band==='bad'?' Outside acceptable hours was explicitly enabled.':''));
        duplicateNotes.add(p.local+' for '+p.name+': '+p.inconvenientMinutes+' inconvenient minutes');
        duplicateNotes.add(p.name+': explicitly enabled hours outside acceptable range');
      }
      if((p.hasCalendarConflict??(!p.available&&p.band!=='no'))&&!overridden.has(p.id))add(p.name+': Calendar conflict',local(p)+'. '+(p.calendarConflictCount?p.calendarConflictCount+' overlapping meeting'+(p.calendarConflictCount===1?'':'s')+'.':'Overlaps an existing meeting.')+' They will still be invited unless you remove them.');
      if(p.band==='no')add(p.name+': Does not fit profile',local(p)+'. '+(p.availabilityReason||'Outside stated availability or profile rules')+'. They will still be invited unless you remove them.');
      if(p.confirmed!==true){
        const prefix='cannot see '+p.name+"'s complete calendar — availability unconfirmed",notes=(slot.notes||[]).filter(n=>String(n).startsWith(prefix));
        notes.forEach(n=>duplicateNotes.add(n));
        const errors=notes.filter(n=>n.startsWith(prefix+': ')).map(n=>n.slice(prefix.length+2));
        add(p.name+': Availability unconfirmed',local(p)+'. Complete calendar data is unavailable. Check their availability before sending.'+(errors.length?' '+errors.join(' · '):''));
      }
      if(p.required===false&&!p.available)for(const note of slot.notes||[])if(String(note).startsWith('optional guest '+p.name+' cannot attend: '))duplicateNotes.add(note);
    }
    for(const c of slot.overrides||[]){
      const organizer=String(c.organizer||''),calendarOwner=/@(?:group|resource)\.calendar\.google\.com$/i.test(organizer);
      const contact=contactFor?.(c)||(calendarOwner?'Coordinate with the calendar owner':c.ask||'Ask '+c.who);
      add(c.who+': Calendar conflict',c.label+'. This meeting would create a new overlap. '+contact+'. Find a replacement time immediately. Existing appointments remain in place.',E.eventKey(c.event));
    }
    if(slot.overrides?.length)duplicateNotes.add('WARNING: this SlotDesk proposal introduces conflicts. Existing appointments are unchanged. Find replacement times immediately.');
    for(const note of slot.notes||[])if(!duplicateNotes.has(note))add('Availability note',String(note));
    return warnings;
  }
  function fullTime(instant,zone,format='24',{dateFormat='dmy'}={}){return new Intl.DateTimeFormat(dateFormat==='mdy'?'en-US':'en-GB',{timeZone:zone,weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:format==='12',timeZoneName:'shortOffset'}).format(new Date(instant));}
  function resolveLocal(date,time,zone,previous){const clock=parseClock(time);if(!clock)return NaN;if(Number.isFinite(previous)){const part=E.partsIn(previous,zone);if(part.ymd===date&&part.hh===+clock.slice(0,2)&&part.mm===+clock.slice(3))return previous;}return E.zonedToInstant(date,+clock.slice(0,2)*60 + +clock.slice(3),zone);}
  function flightFields(flight,defaultZone,date){const out={label:flight.label||''};for(const key of ['departure','arrival']){const zone=flight[key+'Zone']||defaultZone,instant=Date.parse(flight[key]);out[key+'Zone']=zone;const part=Number.isFinite(instant)?E.partsIn(instant,zone):null;out[key+'Date']=part?.ymd||date;out[key+'Time']=part?String(part.hh).padStart(2,'0')+':'+String(part.mm).padStart(2,'0'):key==='departure'?'09:00':'11:00';}return out;}
  function flightFromFields(fields,previous={},defaultZone){const f={label:fields.label||''};for(const key of ['departure','arrival']){const zone=fields[key+'Zone'],date=fields[key+'Date'],time=parseClock(fields[key+'Time']);f[key+'Zone']=zone;try{const old=Number.isFinite(Date.parse(previous[key]))?flightFields(previous,defaultZone,date):null;if(old&&old[key+'Zone']===zone&&old[key+'Date']===date&&old[key+'Time']===time){f[key]=previous[key];continue;}const instant=time?E.zonedToInstant(date,+time.slice(0,2)*60 + +time.slice(3),zone):NaN;f[key]=Number.isFinite(instant)?new Date(instant).toISOString():'';}catch(_){f[key]='';}}return f;}
  function contacts(sources,profiles,ownEmail,limit=5){
    const excluded=new Set([...profiles.map(p=>emailKey(p.email)),emailKey(ownEmail)]),people=new Map(),seen=new Set();
    for(const source of sources)for(const event of source.items||[]){if(event.status==='cancelled')continue;const stamp=Date.parse(event.start?.dateTime||event.start?.date)||0,key=event.iCalUID||event.id;if(seen.has(key+'|'+stamp))continue;seen.add(key+'|'+stamp);
      for(const guest of [...(event.attendees||[]),...(event.organizer?[event.organizer]:[])]){const email=emailKey(guest.email);if(!validEmail(email)||guest.resource||excluded.has(email)||/@(?:group|resource)\.calendar\.google\.com$/i.test(email))continue;const person=people.get(email)||{email,name:guest.displayName||'',count:0,recent:0};person.count++;person.recent=Math.max(person.recent,stamp);if(!person.name&&guest.displayName)person.name=guest.displayName;people.set(email,person);}
    }
    return [...people.values()].sort((a,b)=>b.count-a.count||b.recent-a.recent||a.email.localeCompare(b.email)).slice(0,limit);
  }
  function calendarSuggestions(email,calendars,selected=[]){const key=emailKey(email),omit=new Set(selected);if(!validEmail(key))return [];return calendars.filter(c=>!omit.has(c.id)&&emailKey(c.id)!==key&&emailKey(c.dataOwner)===key);}
  function personLabel(person,profiles){const saved=profiles.find(p=>emailKey(p.email)===emailKey(person?.email));return {email:person?.email||'',name:saved?.name||person?.displayName||'',saved:!!saved};}
  function invitationEvents(source,email){const key=emailKey(email);return (source.items||[]).filter(event=>(event.attendees||[]).some(a=>emailKey(a.email)===key&&['accepted','tentative'].includes(a.responseStatus)));}
  return {participant,effectiveParticipant,addEmailGuest,confirmGuestTimezone,setParticipantRule,promoteGuest,switchOrganizingCalendar,invitationEvents,calendarSuggestions,personLabel,emailKey,validEmail,writable,schedule,newProfile,migrate,selectedProfiles,addParticipant,removeParticipant,matchProfiles,dateRange,formatClock,parseClock,localTime,compactDate,compactRange,offsetAt,zoneLabel,calendarDataSummary,participantFit,proposalWarnings,fullTime,resolveLocal,flightFields,flightFromFields,contacts};
});
