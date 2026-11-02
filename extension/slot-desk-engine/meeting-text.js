(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./workspace-model'),require('./timezone-search'),require('./slotdesk-engine'));else root.SlotMeetingText=factory(root.SlotWorkspace,root.SlotTimezoneSearch,root.SlotEngine);})(typeof self!=='undefined'?self:this,function(U,TZ,E){
  'use strict';
  function times(slot,{clock='24',dateFormat='dmy',referenceZone,profiles=[]}={}){
    const seen=new Set(),out=[];for(const p of slot.people){const key=p.tz+'|'+(p.endTz||p.tz);if(seen.has(key))continue;seen.add(key);const profile=profiles.find(x=>x.id===p.id),date=E.partsIn(slot.start,profile?.tz||p.tz).ymd,location=profile?.travel?.find(t=>t.tz===p.tz&&date>=t.from&&date<=t.to)?.tzLocation||profile?.tzLocation;out.push(U.compactRange(slot.start,slot.end,p.tz,clock,{dateFormat,referenceZone,endZone:p.endTz})+' · '+U.zoneLabel(slot.start,slot.end,p.tz,p.endTz||p.tz,location));}return out;
  }
  // Short zone names recipients recognise: ET/PT for North America, GMT/BST for the UK, otherwise the country or city.
  function shortZone(instant,zone){
    if(/^(Etc\/)?UTC$/.test(zone))return 'UTC';
    const part=(locale,style)=>new Intl.DateTimeFormat(locale,{timeZone:zone,timeZoneName:style}).formatToParts(new Date(instant)).find(p=>p.type==='timeZoneName').value;
    if(zone==='Europe/London')return part('en-GB','short');
    const generic=part('en-US','shortGeneric');return /^[A-Z]{2,4}$/.test(generic)?generic:/ Time$/.test(generic)?generic.slice(0,-5):TZ.label(zone);
  }
  const minutes=d=>d%60===0?(d/60)+'-hour':d+'-minute',spoken=d=>d%60===0?(d/60)+(d===60?' hour':' hours'):d+' minutes';
  function planning(slots,title,{clock='24',dateFormat='dmy',referenceZone,senderName}={}){
    const subject='Time options for '+(title||'our meeting'),durations=new Set(slots.map(s=>s.duration)),single=slots.length===1,same=durations.size===1;
    const lines=['Hi everyone,',single?'Would this '+(same?minutes(slots[0].duration)+' ':'')+'slot work for you?':'Would any of these '+(same?minutes(slots[0].duration)+' ':'')+'slots work for you?',''];
    for(const slot of slots){
      const zones=[...new Set(slot.people.map(p=>p.tz))].sort((a,b)=>(b===referenceZone)-(a===referenceZone)),lead=zones[0]||referenceZone||'UTC',day=E.partsIn(+new Date(slot.start),lead).ymd,seen=new Set(),parts=[];
      for(const zone of zones.length?zones:[lead]){const text=U.localTime(slot.start,zone,clock).toUpperCase()+' '+shortZone(slot.start,zone),other=E.partsIn(+new Date(slot.start),zone).ymd!==day;
        if(seen.has(text))continue;seen.add(text);parts.push(text+(other?' ('+new Intl.DateTimeFormat('en-GB',{timeZone:zone,weekday:'short'}).format(new Date(slot.start))+')':''));}
      lines.push('• '+U.compactDate(slot.start,lead,{dateFormat,referenceZone:lead})+': '+parts.join(' / ')+(same?'':' ('+spoken(slot.duration)+')'));
      for(const p of slot.people.filter(p=>p.required===false&&(p.hasCalendarConflict||p.band==='no')))lines.push('  '+p.name+' is unavailable for this option.');
    }
    const name=String(senderName||'').trim().split(/\s+/)[0];
    lines.push('',single?'Please let me know if it works, and I’ll send an invite.':'Please share all options that work and your preference, and I’ll send an invite.','Best,'+(name?'\n'+name:''));return {subject,body:lines.join('\n')};
  }
  function summary(slot,title,options={}){const localTimes=times(slot,options);if(!localTimes.length){const zone=options.meetingZone||'UTC';localTimes.push(U.compactRange(slot.start,slot.end,zone,options.clock||'24',{dateFormat:options.dateFormat||'dmy',referenceZone:options.referenceZone})+' · '+U.zoneLabel(slot.start,slot.end,zone,zone,options.timezoneLocation));}return [title||'Meeting',...localTimes,'Participants: '+slot.people.map(p=>p.name).join(', '),...(options.location?[options.location]:[]),...(slot.people.some(p=>p.hasCalendarConflict||p.band==='no')?['Known availability conflicts need review.']:[])].join('\n');}
  return {planning,summary,times};
});
