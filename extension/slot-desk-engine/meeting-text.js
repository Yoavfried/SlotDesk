(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./workspace-model'),require('./timezone-search'),require('./slotdesk-engine'));else root.SlotMeetingText=factory(root.SlotWorkspace,root.SlotTimezoneSearch,root.SlotEngine);})(typeof self!=='undefined'?self:this,function(U,TZ,E){
  'use strict';
  function times(slot,{clock='24',dateFormat='dmy',referenceZone,profiles=[]}={}){
    const seen=new Set(),out=[];for(const p of slot.people){const key=p.tz+'|'+(p.endTz||p.tz);if(seen.has(key))continue;seen.add(key);const profile=profiles.find(x=>x.id===p.id),date=E.partsIn(slot.start,profile?.tz||p.tz).ymd,location=profile?.travel?.find(t=>t.tz===p.tz&&date>=t.from&&date<=t.to)?.tzLocation||profile?.tzLocation;out.push(U.compactRange(slot.start,slot.end,p.tz,clock,{dateFormat,referenceZone,endZone:p.endTz})+' · '+U.zoneLabel(slot.start,slot.end,p.tz,p.endTz||p.tz,location));}return out;
  }
  function planning(slots,title,options={}){
    const subject='Time options for '+(title||'our meeting'),lines=['Hi everyone,','','Please let me know which options work for you. If several work, please include all of them and indicate your preference.',''];
    slots.forEach((slot,i)=>{lines.push((i+1)+'. '+slot.duration+' minutes'+(slot.alternativeType?.includes('shorter')?' — shorter option':''));for(const line of times(slot,options))lines.push('   '+line);for(const p of slot.people.filter(p=>p.required===false&&(p.hasCalendarConflict||p.band==='no')))lines.push('   '+p.name+' is unavailable for this option.');lines.push('');});
    lines.push('Once we agree on a time, I’ll send the calendar invitation.','','Thanks!');return {subject,body:lines.join('\n')};
  }
  function summary(slot,title,options={}){const localTimes=times(slot,options);if(!localTimes.length){const zone=options.meetingZone||'UTC';localTimes.push(U.compactRange(slot.start,slot.end,zone,options.clock||'24',{dateFormat:options.dateFormat||'dmy',referenceZone:options.referenceZone})+' · '+U.zoneLabel(slot.start,slot.end,zone,zone,options.timezoneLocation));}return [title||'Meeting',...localTimes,'Participants: '+slot.people.map(p=>p.name).join(', '),...(options.location?[options.location]:[]),...(slot.people.some(p=>p.hasCalendarConflict||p.band==='no')?['Known availability conflicts need review.']:[])].join('\n');}
  return {planning,summary,times};
});
