(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./slotdesk-engine.js'),require('./profile-rules.js'));else root.SlotGoogle=factory(root.SlotEngine,root.SlotProfileRules);
})(typeof self!=='undefined'?self:this,function(E,ProfileRules){
  'use strict';
  const domain=e=>(e||'').toLowerCase().split('@')[1]||'',isRoom=e=>/resource\.calendar\.google\.com$|group\.calendar\.google\.com$/.test(e||'');
  const enumKey=v=>(v||'').replace(/_/g,'').toLowerCase();
  function instant(value,tz){
    if(!value)return null;
    if(/(?:Z|[+-]\d\d:\d\d)$/i.test(value))return Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;
    const match=/^(\d{4}-\d{2}-\d{2})T(\d\d):(\d\d)(?::(\d\d))?$/.exec(value);
    if(!match||!tz)return null;
    const t=E.zonedToInstant(match[1],+match[2]*60 + +match[3],tz);
    return Number.isFinite(t)?new Date(t+(+match[4]||0)*1000).toISOString():null;
  }
  function fromGoogle(list,ownerEmail,options={}){
    const role=list.accessRole||options.accessRole||'reader',calendarId=options.calendarId||list.calendarId||list.id||'',tz=options.timeZone||list.timeZone;
    const out={calendar:role==='freeBusyReader'?'busy':'detail',busy:[],markers:[],clues:[],skipped:{},warnings:[],complete:true};
    const skip=why=>{out.skipped[why]=(out.skipped[why]||0)+1;};
    const home=domain(ownerEmail),rules=options.eventRules||{},leaveRE=new RegExp(rules.leave===undefined?E.RULES.leave:rules.leave,'i');
    for(const ev of list.items||list.events||[]){
      if(enumKey(ev.status)==='cancelled'){skip('cancelled');continue;}
      // A shared calendar's "self" attendee may be the assistant, not this person.
      const me=(ev.attendees||[]).find(a=>(a.email||'').toLowerCase()===(ownerEmail||'').toLowerCase());
      if(me&&enumKey(me.responseStatus)==='declined'){skip('declined by them');continue;}
      const kind=enumKey(ev.eventType),allDay=!!ev.start?.date,title=ev.summary||'';
      const clue=[title,ev.location,ev.workingLocationProperties?.officeLocation?.label].filter(Boolean).join(' · ');
      if(clue)out.clues.push({text:clue,date:ev.start?.date?.slice(0,10),source:`Calendar event ${ev.id||'(no ID)'} on ${calendarId}`});
      const rawOriginal=ev.originalStartTime?.dateTime||ev.originalStartTime?.date?.slice(0,10)||ev.start?.dateTime||ev.start?.date?.slice(0,10);
      const original=rawOriginal?.includes('T')?instant(rawOriginal,ev.originalStartTime?.timeZone||ev.start?.timeZone||tz):rawOriginal;
      const identity=ev.iCalUID?`${ev.iCalUID}|${original}`:ev.id?`${calendarId}|${ev.id}`:undefined;
      const override=ProfileRules.override({...ev,identity,calendarId},options);
      if(override==='ignore'){skip('ignored by EA');continue;}
      if((kind==='workinglocation'||kind==='birthday')&&!override){skip('not a meeting');continue;}
      const marker={from:ev.start?.date?.slice(0,10),to:ev.end?.date?.slice(0,10),title,free:false,id:ev.id,identity,calendarId,tz,recurringEventId:ev.recurringEventId,iCalUID:ev.iCalUID,originalStart:original};
      if(!override&&(enumKey(ev.transparency)==='transparent'||enumKey(ev.availability)==='availabilityfree')){
        if(allDay)out.markers.push({...marker,free:true});skip('marked free');continue;
      }
      leaveRE.lastIndex=0;
      const leave=kind==='outofoffice'||override==='leave'||(allDay&&(options.leaveCalendar||ProfileRules.detects(options,'leave',title,E.RULES.leave)));
      if(allDay&&!leave&&override!=='protected'&&override!=='movable'&&override!=='soft'){
        out.markers.push({...marker,review:true});skip('all-day marker (review)');continue;
      }
      const eventTz=ev.start?.timeZone||tz;
      const start=allDay?ev.start.date.slice(0,10):instant(ev.start?.dateTime,eventTz),end=allDay?ev.end?.date?.slice(0,10):instant(ev.end?.dateTime,ev.end?.timeZone||eventTz);
      if(!start||!end||(!allDay&&Date.parse(end)<=Date.parse(start))||(allDay&&(!eventTz||end<=start))){out.complete=false;out.warnings.push(`Cannot normalize event ${ev.id||'(unknown)'}: missing/invalid time or timezone`);continue;}
      const others=(ev.attendees||[]).filter(a=>enumKey(a.responseStatus)!=='declined'&&!a.resource&&!isRoom(a.email));
      // Private does not imply hidden: a private event with readable details stays detailed.
      const hidden=out.calendar==='busy'||ev.detailsVisible===false||ev.redacted===true||(enumKey(ev.visibility)==='private'&&!Object.prototype.hasOwnProperty.call(ev,'summary'));
      out.busy.push({id:ev.id,calendarId,identity,iCalUID:ev.iCalUID,originalStart:original,organizer:ev.organizer?.email||null,start,end,tz:eventTz,title:ev.summary||'(no title)',detailsVisible:!hidden,
        type:leave?'leave':kind==='focustime'?'focus':'default',leaveSource:leave?(override==='leave'?'ea':kind==='outofoffice'?'google':options.leaveCalendar?'calendar':'title'):'',allDay,override,
        status:enumKey(ev.status)==='tentative'||enumKey(me?.responseStatus)==='tentative'?'tentative':'accepted',eventStatus:ev.status,responseStatus:me?.responseStatus,
        attendees:Math.max(1,others.length),external:!!home&&others.some(a=>domain(a.email)&&domain(a.email)!==home),recurring:!!ev.recurringEventId,recurringEventId:ev.recurringEventId});
    }return out;
  }
  function mergeCalendars(sources){
    const busy=new Map(),markers=new Map(),coverages=[],errors=[];
    for(const s of sources){
      coverages.push(s.coverage||{complete:false,error:'Calendar not loaded'});if(s.error)errors.push(s.error);
      for(const ev of s.busy||[]){const key=E.eventKey(ev),old=busy.get(key);if(!old||(!old.detailsVisible&&ev.detailsVisible))busy.set(key,ev);}
      for(const m of s.markers||[])markers.set(m.identity||`${m.calendarId}|${m.id}`,m);
    }
    return {calendar:sources.some(s=>s.calendar==='detail')?'detail':sources.length?'busy':'none',busy:[...busy.values()],markers:[...markers.values()],coverages,calendarError:errors.join('; ')};
  }
  function profileFromCalendar(calendar){
    return {id:`profile:${calendar.id}`,name:calendar.summaryOverride||calendar.summary||calendar.id,email:calendar.id.includes('@')&&!isRoom(calendar.id)?calendar.id:'',tz:calendar.timeZone||'',tzConfirmed:false,required:true,enabled:true,calendarIds:[calendar.id],days:E.WEEK_MON_FRI(),limit:{...E.DEFAULTS.ok},radius:{minutes:0,mode:'inconvenient'},notice:0,availability:[],travel:[],flights:[],holidayExclusions:[],eventRules:{...E.RULES},eventOverrides:{},eventDetectionEnabled:false,keywordMatchingVersion:1,ruleTerms:{...ProfileRules.defaults},blockers:[],eventTreatments:[],keywordCategories:[]};
  }
  function timezoneSuggestions(text,calendar){
    const suggestions=[];
    if(calendar?.timeZone)suggestions.push({tz:calendar.timeZone,source:`Calendar timezone (${calendar.summary||calendar.id}) — confirm location`});
    for(const zone of (text||'').match(/\b[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?\b/g)||[])try{new Intl.DateTimeFormat('en',{timeZone:zone});suggestions.push({tz:zone,source:`Explicit timezone: ${zone}`});}catch(_){}
    for(const [re,tz,label] of [[/\bnew york\b|\bus eastern\b/i,'America/New_York','New York / US Eastern'],[/\blondon\b/i,'Europe/London','London'],[/\btokyo\b/i,'Asia/Tokyo','Tokyo'],[/\bjerusalem\b|\btel aviv\b/i,'Asia/Jerusalem','Jerusalem / Tel Aviv'],[/\bsingapore\b/i,'Asia/Singapore','Singapore'],[/\bsydney\b/i,'Australia/Sydney','Sydney']])if(re.test(text||''))suggestions.push({tz,source:`Recognized place/region: ${label}`});
    return [...new Map(suggestions.map(s=>[s.tz,s])).values()];
  }
  return {fromGoogle,mergeCalendars,profileFromCalendar,timezoneSuggestions};
});
