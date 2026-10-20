(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotParticipantStatus=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  function reasons(person){
    const out=[],add=(priority,kind,label,source={})=>out.push({priority,kind,label,tone:priority<13?'stop':priority<18?'warn':'good',...source}),conflicts=[...new Map((person.conflicts||[]).map(c=>[c.key,c])).values()];
    const title=c=>c.hidden?'Busy appointment':c.title||'Untitled appointment';
    for(const c of conflicts){
      if(c.kind==='flight')add(1,'flight','Unavailable · '+(c.arrivalLocation?'Flight to '+c.arrivalLocation:c.title||'Flight'),{event:c});
      else if(c.override==='protected')add(3,'protected-event','Unavailable · Protected appointment: '+title(c),{event:c});
      else if(c.kind!=='leave'&&c.category==='protected')add(5,'protected-rule','Unavailable · Protected by rule: '+title(c),{event:c});
      else if(c.kind==='leave')add(c.leaveSource==='title'?8:7,'leave',(c.leaveSource==='title'?'Possible day off · ':'Unavailable · Day off: ')+title(c),{event:c});
    }
    const meetings=conflicts.filter(c=>c.kind==='meeting'&&c.override!=='protected'&&c.category!=='protected');
    if(meetings.length){const anonymous=meetings.some(c=>String(c.key||c.id).includes('freebusy:')),hidden=meetings.some(c=>c.hidden);add(6,'meeting',anonymous?'Calendar overlap · Details '+(meetings.some(c=>!c.hidden)?'partly unavailable':'unavailable'):meetings.length+' meeting overlap'+(meetings.length===1?'':'s')+' · '+title(meetings[0])+(meetings.length>1?' (+'+(meetings.length-1)+')':''),{events:meetings,anonymous,hidden});}
    for(const issue of person.issues||[person.fitIssue].filter(Boolean)){const d=issue.detail||{};
      if(issue.kind==='protected')add(2,'blocked','Unavailable · Blocked time'+(d.label&&d.label!=='Blocked time'?': '+d.label:''),{period:d});
      if(issue.kind==='meeting-radius')add(4,'blocked-radius','Unavailable · Blocked time around '+(d.label||'an appointment'),{period:d});
      if(issue.kind==='availability')add(9,'availability','Unavailable · Outside available times');
      if(issue.kind==='nonworking-day')add(10,'nonworking-day','Unavailable · Nonworking day');
      if(issue.kind==='notice'){const hours=d.hours||person.notice||0;add(11,'notice','Unavailable · Less than '+(hours<1?hours*60+' minutes’':hours+(hours===1?' hour’s':' hours’'))+' notice');}
      if(issue.kind==='acceptable-hours'&&!person.ignoreConvenience)add(12,'usual-hours','Unavailable · Outside usual hours');
    }
    for(const t of person.timing||[]){
      if(t.kind==='flight-buffer'&&!conflicts.some(c=>c.kind==='flight'))add(13,'flight-buffer','Inconvenient · Near a flight',{period:t});
      if(t.kind==='manual-inconvenience')add(14,'manual-inconvenience','Inconvenient · Marked time'+(t.label?': '+t.label:''),{period:t});
      if(t.kind==='meeting-radius'&&!out.some(r=>r.kind==='blocked-radius'&&r.period?.from===t.from))add(15,'meeting-radius','Inconvenient · '+(t.label||'Time around an appointment'),{period:t});
      if(t.kind==='working-hours'&&!person.ignoreConvenience)add(16,'working-hours','Inconvenient · Outside working hours');
    }
    if(person.confirmed!==true)add(17,'unknown','Availability unconfirmed');
    if(!out.length)add(18,'available','Available');
    const exposure=r=>{const start=Date.parse(r.event?.start||r.period?.from),end=Date.parse(r.event?.end||r.period?.to);return Number.isFinite(start)&&Number.isFinite(end)?Math.max(0,Math.min(end,person.slotEnd||end)-Math.max(start,person.slotStart||start)):0;};return out.sort((a,b)=>a.priority-b.priority||exposure(b)-exposure(a)||String(a.event?.key||a.label).localeCompare(String(b.event?.key||b.label)));
  }
  function primary(p){return {...reasons(p)[0],detail:''};}
  function warnings(slot,{format=()=>'',includePrimary=false}={}){
    const groups=new Map();
    for(const p of slot.people){const list=reasons(p);for(const r of list){
      if(r.priority>=17)continue;
      const sources=r.events||[r.event||r.period||null];
      for(const source of sources){if(!includePrimary&&(!source||!source.start&&!source.from)&&r===list[0])continue;
        const key=source?.key||p.id+'|'+r.kind+'|'+(source?.from||'')+'|'+r.label,old=groups.get(key);
        if(old){if(!old.names.includes(p.name))old.names.push(p.name);continue;}
        let detail=source?.start?format(source.start,source.end,source.tz||p.tz,source.allDay):source?.from?format(source.from,source.to,p.tz):r.label;
        if(r.kind==='meeting')detail=(source.hidden?'Busy appointment':source.title||'Untitled appointment')+' · '+detail+'. Existing appointments remain in place.'+(p.required?' Review replacement times before booking.':'');
        else if(source)detail=(source.hidden?'Busy appointment':source.title||source.label||r.label)+' · '+detail;
        groups.set(key,{names:[p.name],label:r.label,detail});
      }
    }}
    return [...groups.values()].map(g=>({title:g.names.join(', ')+': '+g.label,detail:g.detail}));
  }
  return {reasons,primary,warnings};
});
