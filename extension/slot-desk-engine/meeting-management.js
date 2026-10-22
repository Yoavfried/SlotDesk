(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./calendar-view'),require('./workspace-model'),require('./profile-rules'));else root.SlotMeetingManagement=factory(root.SlotCalendarView,root.SlotWorkspace,root.SlotProfileRules);})(typeof self!=='undefined'?self:this,function(V,U,PR){
  'use strict';
  const copy=v=>JSON.parse(JSON.stringify(v)),stamp=time=>time?.date|| (time?.dateTime?String(Date.parse(time.dateTime)):'');
  function identity(event,calendarId){return JSON.stringify(event.iCalUID?[event.iCalUID,event.recurringEventId?stamp(event.originalStartTime):'']:[calendarId,event.id]);}
  function organizingCopy(event,cal){return event.organizer?.self===true||!!event.organizer?.email&&U.emailKey(event.organizer.email)===U.emailKey(cal.id);}
  function editReason(event,cal){if(!U.writable(cal))return 'This calendar is read-only.';if(event.status==='cancelled')return 'This meeting was cancelled.';if(event.locked)return 'Google has locked this meeting’s main fields.';if(!organizingCopy(event,cal))return 'Only the organizing calendar can change this meeting.';if(event.recurrence?.length&&!event.recurringEventId)return 'Choose a single occurrence from Existing meetings.';if((event.eventType||'default')!=='default')return 'Change this calendar-managed item in Google Calendar.';return '';}
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
  function collisionTargets(slot,existing=[],origin=null){
    const merged=new Map();
    function add(item){
      if(typeof item.calendarId!=='string'||!item.calendarId||typeof item.eventId!=='string'||!item.eventId||item.eventId.startsWith('freebusy:'))return;
      const key=JSON.stringify([item.calendarId,item.eventId]),record=merged.get(key)||{calendarId:item.calendarId,eventId:item.eventId,protectedTimes:[]};
      for(const time of item.protectedTimes||[item.protectedTime].filter(Boolean)){
        if(!time||typeof time.start!=='string'||typeof time.end!=='string'||!Number.isFinite(Date.parse(time.start))||Date.parse(time.end)<=Date.parse(time.start))continue;
        const source=time.origin||origin,valid=source&&typeof source.calendarId==='string'&&source.calendarId&&typeof source.eventId==='string'&&source.eventId;
        const next={start:time.start,end:time.end,...(valid?{origin:{calendarId:source.calendarId,eventId:source.eventId}}:{})};
        const same=record.protectedTimes.findIndex(old=>valid?old.origin?.calendarId===source.calendarId&&old.origin?.eventId===source.eventId:!old.origin&&old.start===time.start&&old.end===time.end);
        if(same>=0)record.protectedTimes[same]=next;else record.protectedTimes.push(next);
      }
      if(record.protectedTimes.length)merged.set(key,record);
    }
    for(const item of existing)add(item);for(const clash of slot?.overrides||[])if(clash.causedBySlotDesk!==false&&clash.category!=='own-leave')add({calendarId:clash.event.calendarId,eventId:clash.event.id,protectedTime:{start:slot.startISO,end:slot.endISO}});
    return [...merged.values()];
  }
  function linkFollowupOrigins(items,records){
    return items.map(item=>({...item,protectedTimes:(item.protectedTimes||[item.protectedTime].filter(Boolean)).flatMap(time=>{
      if(time.origin)return [time];const found=[];
      for(const row of records){if(row.source.stale||row.source.failure)continue;for(const event of row.source.items||[]){
        const interval=V.interval(event,row.source.timeZone||row.cal.timeZone||'UTC');
        if(event.status!=='cancelled'&&event.transparency!=='transparent'&&V.slotdeskEvent(event)&&organizingCopy(event,row.cal)&&interval&&interval.start===Date.parse(time.start)&&interval.end===Date.parse(time.end)&&!(row.cal.id===item.calendarId&&event.id===item.eventId))found.push({...time,origin:{calendarId:row.cal.id,eventId:event.id}});
      }}return found.length?found:[time];
    })}));
  }
  function overlapChanges(before,slot,people=[]){for(const clash of slot.overrides||[]){const e=clash.event,time=V.interval({start:e.allDay?{date:e.start}:{dateTime:e.start},end:e.allDay?{date:e.end}:{dateTime:e.end}},e.tz||'UTC');if(!time)continue;const padding=e.allDay||['ooo','leave','flight'].includes(e.type)?0:Math.max(0,...people.filter(p=>clash.participants?.includes(p.id)).map(p=>p.radius?(p.radius.mode==='blocked'?p.radius.minutes:0):(p.buffer||0)))*60000,start=time.start-padding,end=time.end+padding,minutes=(s,t)=>Math.max(0,Math.min(t,end)-Math.max(s,start))/60000;clash.previousOverlapMinutes=minutes(before.start,before.end);clash.proposedOverlapMinutes=minutes(slot.start,slot.end);clash.preExisting=clash.previousOverlapMinutes>0;clash.causedBySlotDesk=!clash.preExisting||clash.proposedOverlapMinutes>clash.previousOverlapMinutes;}return slot;}
  function sameBusy(event,normalized,calendarId){if(normalized.calendarId===calendarId&&normalized.id===event.id)return true;if(!event.iCalUID||normalized.iCalUID!==event.iCalUID)return false;if(!event.recurringEventId&&!normalized.recurringEventId)return true;const original=event.originalStartTime||event.start;return !!(original.date?normalized.originalStart===original.date:original.dateTime&&Date.parse(normalized.originalStart)===Date.parse(original.dateTime));}
  function remainingFollowups(items,records,profiles=[]){
    const sources=records.filter(row=>row.cal&& !row.source.stale&&!row.source.failure&&Array.isArray(row.source.items));
    const covers=(row,time)=>row?.source.coverage?.complete&&Date.parse(row.source.coverage.from)<=Date.parse(time.start)&&Date.parse(row.source.coverage.to)>=Date.parse(time.end);
    const find=(cal,id)=>sources.find(row=>row.cal.id===cal&&row.source.items.some(event=>event.id===id));
    return linkFollowupOrigins(items,sources).flatMap(item=>{
      const padding=Math.max(0,...profiles.filter(profile=>profile.calendarIds?.includes(item.calendarId)).map(profile=>profile.radius?.mode==='blocked'?profile.radius.minutes||0:profile.buffer||0))*60000;
      const record=find(item.calendarId,item.eventId),event=record?.source.items.find(event=>event.id===item.eventId),interval=event&&V.interval(event,record.source.timeZone||record.cal.timeZone||'UTC');
      if(event&&(event.status==='cancelled'||event.transparency==='transparent'))return [];
      const mapped=profiles.filter(profile=>profile.calendarIds?.includes(item.calendarId));
      if(event&&mapped.length&&mapped.every(profile=>{const rule=PR.override({...event,calendarId:item.calendarId},profile);return rule==='ignore'||profile.allowOverlap&&!['protected','leave'].includes(rule);}))return [];
      const times=(item.protectedTimes||[item.protectedTime].filter(Boolean)).flatMap(time=>{
        let next=time;
        if(time.origin){const source=find(time.origin.calendarId,time.origin.eventId),origin=source?.source.items.find(event=>event.id===time.origin.eventId);
          if(origin){if(origin.status==='cancelled'||origin.transparency==='transparent')return [];const moved=V.interval(origin,source.source.timeZone||source.cal.timeZone||'UTC');if(moved)next={...time,start:new Date(moved.start).toISOString(),end:new Date(moved.end).toISOString()};}
          else if(sources.some(row=>row.cal.id===time.origin.calendarId&&covers(row,time)))return [];
        }
        if(interval)return interval.start-padding<Date.parse(next.end)&&interval.end+padding>Date.parse(next.start)?[next]:[];
        if(!event&&sources.some(row=>row.cal.id===item.calendarId&&covers(row,{start:new Date(Date.parse(next.start)-padding).toISOString(),end:new Date(Date.parse(next.end)+padding).toISOString()})))return [];
        return [next];
      });
      return times.length?[{...item,protectedTimes:times}]:[];
    });
  }
  function overlapGroups(items){
    const nodes=new Map(),edges=[];const node=(calendarId,eventId,slotdesk=false)=>{const key=JSON.stringify([calendarId,eventId]);if(!nodes.has(key))nodes.set(key,{key,calendarId,eventId,slotdesk,neighbors:new Set(),times:[]});if(slotdesk)nodes.get(key).slotdesk=true;return nodes.get(key);};
    for(const item of items){const old=node(item.calendarId,item.eventId);for(const time of item.protectedTimes||[item.protectedTime].filter(Boolean)){if(!time.origin)continue;const current=node(time.origin.calendarId,time.origin.eventId,true);if(old.key===current.key)continue;old.neighbors.add(current.key);current.neighbors.add(old.key);current.times.push(time);edges.push([old.key,current.key]);}}
    const seen=new Set(),groups=[];for(const current of nodes.values()){if(seen.has(current.key)||!current.neighbors.size)continue;const stack=[current],group=[];while(stack.length){const n=stack.pop();if(seen.has(n.key))continue;seen.add(n.key);group.push(n);for(const neighbor of n.neighbors)stack.push(nodes.get(neighbor));}groups.push({id:group.map(n=>n.key).sort().join('|'),nodes:group,edges:edges.filter(([key])=>group.some(n=>n.key===key))});}return groups;
  }
  return {overlapGroups,identity,organizingCopy,editReason,overlapIndex,observe,dismiss,sameBusy,collisionTargets,linkFollowupOrigins,overlapChanges,remainingFollowups};
});
