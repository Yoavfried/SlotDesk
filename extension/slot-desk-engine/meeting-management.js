(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./calendar-view'),require('./workspace-model'));else root.SlotMeetingManagement=factory(root.SlotCalendarView,root.SlotWorkspace);})(typeof self!=='undefined'?self:this,function(V,U){
  'use strict';
  const copy=v=>JSON.parse(JSON.stringify(v)),stamp=time=>time?.date|| (time?.dateTime?String(Date.parse(time.dateTime)):'');
  function identity(event,calendarId){return JSON.stringify(event.iCalUID?[event.iCalUID,event.recurringEventId?stamp(event.originalStartTime):'']:[calendarId,event.id]);}
  function organizingCopy(event,cal){return event.organizer?.self===true||!!event.organizer?.email&&U.emailKey(event.organizer.email)===U.emailKey(cal.id);}
  function editReason(event,cal){if(!U.writable(cal))return 'This calendar is read-only.';if(event.status==='cancelled')return 'This meeting was cancelled.';if(event.locked)return 'Google has locked this meeting’s main fields.';if(!organizingCopy(event,cal))return 'Only the organizing calendar can reschedule this meeting.';if(event.recurrence?.length&&!event.recurringEventId)return 'Choose a single occurrence from Existing meetings.';if((event.eventType||'default')!=='default')return 'Change this calendar-managed item in Google Calendar.';return '';}
  function eligible(row){const e=row.event;return row.busyOnly||e.status!=='cancelled'&&e.transparency!=='transparent'&&!['birthday','workingLocation'].includes(e.eventType)&&!(e.attendees||[]).some(a=>a.self&&a.responseStatus==='declined');}
  function overlapIndex(rows){
    const groups=new Map(),rowKeys=new Map();
    rows.forEach(row=>{if(!eligible(row))return;const key=identity(row.event,row.cal.id)+'|'+row.start+'|'+row.end;rowKeys.set(row,key);if(!groups.has(key))groups.set(key,{key,start:row.start,end:row.end,row,overlapping:false});});
    const list=[...groups.values()].sort((a,b)=>a.start-b.start||a.end-b.end);let longest=null;
    for(const item of list){if(longest&&item.start<longest.end){item.overlapping=true;longest.overlapping=true;}if(!longest||item.end>longest.end)longest=item;}
    const prefix=[];let end=-Infinity;for(const item of list){end=Math.max(end,item.end);prefix.push(end);}
    function has(row){return !!groups.get(rowKeys.get(row))?.overlapping;}
    function details(row,limit=20){const key=rowKeys.get(row);if(!key)return {rows:[],more:false};let lo=0,hi=list.length;while(lo<hi){const mid=(lo+hi)>>1;if(prefix[mid]<=row.start)lo=mid+1;else hi=mid;}const found=[];for(let i=lo;i<list.length&&list[i].start<row.end;i++){const item=list[i];if(item.key===key||item.end<=row.start)continue;if(found.length===limit)return {rows:found,more:true};found.push(item.row);}return {rows:found,more:false};}
    return {has,details};
  }
  function observe(records,tracking={},now=Date.now()){
    const next=copy(tracking),notices=[],resolved=[];
    for(const [key,record]of Object.entries(next))if(record.end<=now)delete next[key];
    const seen=new Set();
    for(const {cal,source}of records){
      if(source.coverage?.complete&&Array.isArray(source.items)){const present=new Set(source.items.filter(event=>event&&typeof event==='object').map(event=>identity(event,cal.id)));for(const [key,record]of Object.entries(next))if(record.calendarId===cal.id&&Date.parse(source.coverage.from)<=record.start&&Date.parse(source.coverage.to)>=record.end&&!present.has(key)){delete next[key];resolved.push(key);}}
      for(const event of source.items||[]){
      if(!event?.id||!organizingCopy(event,cal))continue;
      const key=identity(event,cal.id);if(seen.has(key))continue;seen.add(key);
      const time=V.interval(event,source.timeZone||cal.timeZone||'UTC');if(event.status==='cancelled'||time&&time.end<=now){delete next[key];resolved.push(key);continue;}if(!time)continue;
      const record=next[key]||{responses:{},dismissed:{}},responses={...record.responses},dismissed={...record.dismissed};
      for(const guest of event.attendees||[]){const email=U.emailKey(guest.email);if(!U.validEmail(email)||guest.organizer||email===U.emailKey(event.organizer?.email))continue;const status=guest.responseStatus||'needsAction';if(status==='declined'&&responses[email]!=='declined')delete dismissed[email];if(status!=='declined')delete dismissed[email];responses[email]=status;}
      if(!event.attendeesOmitted){const present=new Set((event.attendees||[]).map(g=>U.emailKey(g.email)));for(const email of Object.keys(responses))if(!present.has(email)){delete responses[email];delete dismissed[email];}}
      // Save only response/acknowledgement metadata, never fetched titles or descriptions.
      if(Object.values(responses).includes('declined'))next[key]={responses,dismissed,calendarId:cal.id,start:time.start,end:time.end};else delete next[key];
      const declined=(event.attendees||[]).filter(g=>responses[U.emailKey(g.email)]==='declined'&&!dismissed[U.emailKey(g.email)]);
      if(declined.length)notices.push({key,event,cal,guests:declined,...time});else resolved.push(key);
    }}
    return {tracking:next,notices,resolved};
  }
  function dismiss(tracking,key,emails){const next=copy(tracking),record=next[key];if(record)for(const email of emails||Object.keys(record.responses))if(record.responses[U.emailKey(email)]==='declined')record.dismissed[U.emailKey(email)]=true;return next;}
  function collisionTargets(slot,existing=[]){
    const merged=new Map();function add(item){if(typeof item.calendarId!=='string'||!item.calendarId||typeof item.eventId!=='string'||!item.eventId||item.eventId.startsWith('freebusy:'))return;const key=JSON.stringify([item.calendarId,item.eventId]),record=merged.get(key)||{calendarId:item.calendarId,eventId:item.eventId,protectedTimes:[]};for(const time of item.protectedTimes||[item.protectedTime].filter(Boolean))if(time&&typeof time.start==='string'&&typeof time.end==='string'&&Number.isFinite(Date.parse(time.start))&&Date.parse(time.end)>Date.parse(time.start)&&!record.protectedTimes.some(old=>old.start===time.start&&old.end===time.end))record.protectedTimes.push({start:time.start,end:time.end});if(record.protectedTimes.length)merged.set(key,record);}
    for(const item of existing)add(item);for(const clash of slot?.overrides||[])if(clash.causedBySlotDesk!==false)add({calendarId:clash.event.calendarId,eventId:clash.event.id,protectedTime:{start:slot.startISO,end:slot.endISO}});return [...merged.values()];
  }
  function overlapChanges(before,slot,people=[]){for(const clash of slot.overrides||[]){const e=clash.event,time=V.interval({start:e.allDay?{date:e.start}:{dateTime:e.start},end:e.allDay?{date:e.end}:{dateTime:e.end}},e.tz||'UTC');if(!time)continue;const padding=e.allDay||['ooo','leave','flight'].includes(e.type)?0:Math.max(0,...people.filter(p=>clash.participants?.includes(p.id)).map(p=>p.radius?(p.radius.mode==='blocked'?p.radius.minutes:0):(p.buffer||0)))*60000,start=time.start-padding,end=time.end+padding,minutes=(s,t)=>Math.max(0,Math.min(t,end)-Math.max(s,start))/60000;clash.previousOverlapMinutes=minutes(before.start,before.end);clash.proposedOverlapMinutes=minutes(slot.start,slot.end);clash.preExisting=clash.previousOverlapMinutes>0;clash.causedBySlotDesk=!clash.preExisting||clash.proposedOverlapMinutes>clash.previousOverlapMinutes;}return slot;}
  function sameBusy(event,normalized,calendarId){if(normalized.calendarId===calendarId&&normalized.id===event.id)return true;if(!event.iCalUID||normalized.iCalUID!==event.iCalUID)return false;if(!event.recurringEventId&&!normalized.recurringEventId)return true;const original=event.originalStartTime||event.start;return !!(original.date?normalized.originalStart===original.date:original.dateTime&&Date.parse(normalized.originalStart)===Date.parse(original.dateTime));}
  return {identity,organizingCopy,editReason,overlapIndex,observe,dismiss,sameBusy,collisionTargets,overlapChanges};
});
