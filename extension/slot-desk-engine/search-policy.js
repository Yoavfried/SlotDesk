(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./scheduling-ranking'));else root.SlotSearchPolicy=factory(root.SlotRanking);})(typeof self!=='undefined'?self:this,function(R){
  'use strict';
  const MIN=60000,overlaps=(a,b)=>a.start<b.end&&b.start<a.end;
  function durations(minutes){if(minutes<=30)return [];const floor=minutes>90?60:minutes>=60?45:30,out=[];for(let n=Math.floor((minutes-1)/15)*15;n>=floor;n-=15)out.push(n);return out;}
  function weekStart(person,enabled){
    if(!enabled.length)return 1;
    if(person.workingMode!=='manual')return person.templateDays==='sun-thu'?0:1;
    // A manual schedule owns its reference week. An inactive template must
    // not move the deadline; start after the longest weekly break instead.
    const active=new Set(enabled),gap=day=>{let n=0;while(n<7&&!active.has((day+6-n)%7))n++;return n;};
    return [...enabled].sort((a,b)=>gap(b)-gap(a)||(a+6)%7-(b+6)%7)[0];
  }
  function workweekBoundary(person,date,last,E){
    const zones=new Set([person.tz,person.tripTimezoneState?.baseZone]),changes=[];
    for(const change of person.tripTimezoneState?.history||[]){zones.add(change.tz);changes.push(Date.parse(change.at));}
    for(const trip of person.trips||[]){zones.add(trip.originZone);for(const flight of trip.flights||[]){zones.add(flight.departureZone);zones.add(flight.arrivalZone);changes.push(Date.parse(flight.departure),Date.parse(flight.arrival));}}
    for(const travel of person.travel||[])zones.add(travel.tz);
    // Legacy travel is keyed to home dates in the effective base zone, which
    // can change after a one-way trip or manual timezone history entry.
    for(const travel of person.travel||[])for(const zone of [...zones].filter(Boolean))changes.push(E.startOfDay(travel.from,zone),E.startOfDay(E.addDaysYmd(travel.to,1),zone));
    const candidates=[...zones].filter(Boolean).map(zone=>E.startOfDay(date,zone)).concat(changes);
    const localDate=time=>E.partsIn(time,E.tzFor(person,time).tz).ymd;
    // Resolve the real transition into the date after the workweek. Sampling
    // noon misses late arrivals and date-line jumps at the deadline itself.
    return Math.min(...candidates.filter(time=>Number.isFinite(time)&&time>last&&localDate(time-1)<date&&localDate(time)>=date));
  }
  function horizon(req,E){
    const anchor=req.anchorTz||req.people[0].tz,last=E.startOfDay(E.addDaysYmd(req.range.to,1),anchor)-1;
    const required=req.people.filter(p=>p.required!==false&&!p.isResource);return Math.min(...(required.length?required:req.people.filter(p=>p.required!==false)).map(p=>{
      const local=E.partsIn(last,E.tzFor(p,last).tz),days=p.days||{},enabled=Object.keys(days).map(Number).filter(d=>days[d]?.on),start=weekStart(p,enabled);
      const offset=(local.wd-start+7)%7,week=E.addDaysYmd(local.ymd,-offset),final=enabled.length?Math.max(...enabled.map(d=>(d-start+7)%7)):6;
      const end=E.addDaysYmd(week,7+final+1);
      return workweekBoundary(p,end,last,E);
    }));
  }
  const good=s=>!s.requiredConflictCount&&s.people.filter(p=>p.required).every(p=>!['no','bad'].includes(p.band));
  const working=s=>s.people.filter(p=>p.required).every(p=>!p.usualInconvenientMinutes);
  const perfect=s=>good(s)&&working(s)&&s.people.filter(p=>p.required).every(p=>!p.explicitInconvenientMinutes);
  const bandIndex=minute=>minute<720?0:minute<840?1:2;
  const band=minute=>['morning','midday','afternoon'][bandIndex(minute)];
  const rangeDays=req=>(Date.parse(req.range.to)-Date.parse(req.range.from))/86400000+1;
  const key=(s,req)=>s.day+(req&&rangeDays(req)>3?'':'|'+band(s.anchorMinute));
  const compare=(a,b)=>(a.alternativeRank||0)-(b.alternativeRank||0)||R.quality(a,b)||a.start-b.start||b.duration-a.duration;
  function select(slots,req,occupied=[],usedGroups=[]){
    const unique=[...new Map(slots.map(s=>[s.start+'|'+s.end,s])).values()];
    const diverse=!req||rangeDays(req)<=3;
    unique.sort((a,b)=>a.day.localeCompare(b.day)||(diverse?bandIndex(a.anchorMinute)-bandIndex(b.anchorMinute):0)||compare(a,b));
    const out=[],groups=new Set(usedGroups);
    for(const s of unique){const group=key(s,req);if(groups.has(group)||[...occupied,...out].some(x=>overlaps(x,s)))continue;out.push(s);groups.add(group);}
    return out;
  }
  function best(slots,outside=false){
    const distance=s=>{const p=s.people.filter(p=>p.required),values=p.map(p=>p.distance||0),minutes=p.map(p=>p.usualInconvenientMinutes||0);return [s.score?.explicitMax||0,s.score?.explicitTotal||0,Math.max(0,...minutes),minutes.reduce((a,b)=>a+b,0),Math.max(0,...values),values.reduce((a,b)=>a+b,0)];};
    return [...slots].sort((a,b)=>(a.alternativeRank||0)-(b.alternativeRank||0)||a.day.localeCompare(b.day)||(outside?distance(a).reduce((v,n,i)=>v||n-distance(b)[i],0):R.quality(a,b))||a.start-b.start)[0];
  }
  function find(req,E){
    const fixed={...req,step:10,spacingMode:'automatic',perDayMode:'automatic',minDuration:30,extendDays:0,want:5},base=E.evaluate(fixed),empty={options:[],allOptions:[],open:[],openCount:0,clearCount:0,rejected:base.rejected,rejectionDetails:base.rejectionDetails,protectedConflicts:base.protectedConflicts,errors:base.errors,warnings:base.warnings};
    if(base.errors.length)return empty;
    const label=(s,type,rank)=>({...s,alternativeType:type,alternativeRank:rank,automaticAlternatives:true}),full=[...base.open,...base.taken].map(s=>label(s,'requested',0)),memo=new Map();
    function burden(start,minutes){
      const key=start+'|'+minutes;if(memo.has(key))return memo.get(key);const end=start+minutes*MIN,events=new Map(),issues=[];
      for(const p of req.people.filter(p=>p.required!==false)){
        const fit=E.fitPerson(p,start,end,Number(new Date(req.now??Date.now())),{constraints:req.constraints});
        for(const issue of fit.issues||[fit.issue].filter(Boolean))if(issue.kind!=='past')issues.push(p.id+'|'+issue.kind);
        for(const ev of E.conflictsFor(p,start,end)){const k=E.eventKey(ev),a=ev.allDay?E.startOfDay(ev.start.slice(0,10),ev.tz||p.tz):Date.parse(ev.start),b=ev.allDay?E.startOfDay(ev.end.slice(0,10),ev.tz||p.tz):Date.parse(ev.end);events.set(k,Math.max(events.get(k)||0,Math.max(0,Math.min(end,b)-Math.max(start,a))/MIN));}
      }
      const value={count:events.size,minutes:[...events.values()].reduce((n,v)=>n+v,0),issues:[...new Set(issues)]};memo.set(key,value);return value;
    }
    function shortChoices(range,type,rank){
      const byStart=new Map();for(const duration of durations(req.duration)){
        const evaluated=E.evaluate({...fixed,range,duration});
        for(const s of [...evaluated.open,...evaluated.taken]){
          const before=burden(s.start,req.duration);if(!before.count&&!before.issues.length)continue;
          const after=burden(s.start,duration),better=before.issues.length>after.issues.length||after.count<before.count||after.count===before.count&&after.minutes<before.minutes;
          if(!better)continue;const candidate=label(s,type,rank);candidate.shortening={before,after};const old=byStart.get(s.start);
          if(!old||!s.requiredConflictCount&&old.requiredConflictCount||Boolean(s.requiredConflictCount)===Boolean(old.requiredConflictCount)&&(after.count<old.shortening.after.count||after.count===old.shortening.after.count&&(!after.count?duration>old.duration:after.minutes<old.shortening.after.minutes||after.minutes===old.shortening.after.minutes&&duration>old.duration)))byStart.set(s.start,candidate);
        }
      }
      return [...byStart.values()];
    }
    let shorter=shortChoices(req.range,'shorter',1);const hasGood=full.some(good)||shorter.some(good);
    shorter=shorter.filter(s=>!s.requiredConflictCount||!hasGood);
    const replacements=new Map(shorter.map(s=>[s.start,s]));
    const originals=full.filter(s=>{const replacement=shorter.find(x=>!x.requiredConflictCount&&overlaps(x,s))||replacements.get(s.start);return !replacement||!s.requiredConflictCount||replacement.requiredConflictCount&&replacement.shortening.after.count>=replacement.shortening.before.count&&replacement.shortening.after.minutes>=replacement.shortening.before.minutes;});
    const requested=[...originals,...shorter],clear=requested.filter(good),normal=select(clear.filter(working),req).sort((a,b)=>(a.alternativeRank||0)-(b.alternativeRank||0)||a.day.localeCompare(b.day)||a.start-b.start),deadline=horizon(req,E);
    if(normal.length){
      const groups=new Set(normal.map(s=>key(s,req))),outside=best(clear.filter(s=>!working(s)&&!groups.has(key(s,req))&&!normal.some(x=>overlaps(x,s))),true),kept=[...normal];
      if(outside){outside.outsideWorkingHours=true;kept.push(outside);}
      const bad=select(requested.filter(s=>!good(s)),req,kept,kept.map(s=>key(s,req))),allOptions=[...kept,...bad];
      return {...empty,options:normal.slice(0,5),allOptions,open:normal,openCount:base.open.length,clearCount:normal.length,deadline};
    }
    const later=[];
    const from=E.addDaysYmd(req.range.to,1),to=E.partsIn(deadline-1,req.anchorTz||req.people[0].tz).ymd;
    if(from<=to){const range={from,to},extended=E.evaluate({...fixed,range});
      for(const s of [...extended.open,...extended.taken])if(s.end<=deadline&&good(s))later.push(label(s,'extended',2));
      if(!later.some(working)&&!shorter.some(good))for(const s of shortChoices(range,'extended-shorter',3))if(s.end<=deadline&&good(s))later.push(s);
    }
    const laterWorking=best(later.filter(working)),within=best(clear.filter(s=>!laterWorking||!overlaps(s,laterWorking)),true),featured=[laterWorking,within].filter(Boolean);
    if(!featured.length){const combined=best(later,true);if(combined)featured.push(combined);}
    for(const slot of featured){slot.featuredFallback=true;slot.outsideWorkingHours=!working(slot);}
    const bad=select(requested.filter(s=>!good(s)),req,featured),allOptions=[...featured,...bad];
    return {...empty,options:[...featured,...bad.slice(0,3)],allOptions,open:within?[within]:[],openCount:base.open.length,clearCount:within?1:0,deadline};
  }
  return {durations,horizon,perfect,good,working,band,select,find};
});
