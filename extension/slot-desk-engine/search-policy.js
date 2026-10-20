(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./scheduling-ranking'));else root.SlotSearchPolicy=factory(root.SlotRanking);})(typeof self!=='undefined'?self:this,function(R){
  'use strict';
  const MIN=60000,overlaps=(a,b)=>a.start<b.end&&b.start<a.end;
  function durations(minutes){if(minutes<=30)return [];const floor=minutes>90?60:minutes>=60?45:30,out=[];for(let n=Math.floor((minutes-1)/15)*15;n>=floor;n-=15)out.push(n);return out;}
  function horizon(req,E){
    const anchor=req.anchorTz||req.people[0].tz,last=E.startOfDay(E.addDaysYmd(req.range.to,1),anchor)-1;
    const required=req.people.filter(p=>p.required!==false&&!p.isResource);return Math.min(...(required.length?required:req.people.filter(p=>p.required!==false)).map(p=>{
      const local=E.partsIn(last,E.tzFor(p,last).tz),days=p.days||{},enabled=Object.keys(days).map(Number).filter(d=>days[d]?.on),start=enabled.length&&p.templateDays==='sun-thu'?0:1;
      const offset=(local.wd-start+7)%7,week=E.addDaysYmd(local.ymd,-offset),final=enabled.length?Math.max(...enabled.map(d=>(d-start+7)%7)):6;
      const end=E.addDaysYmd(week,7+final+1),zone=E.tzFor(p,E.startOfDay(E.addDaysYmd(end,-1),p.tz)+12*60*MIN).tz;
      return E.startOfDay(end,zone);
    }));
  }
  const perfect=s=>!s.requiredConflictCount&&s.people.filter(p=>p.required).every(p=>p.band==='ok'&&!p.inconvenientMinutes);
  function select(slots){
    const unique=[...new Map(slots.map(s=>[s.start+'|'+s.end,s])).values()];
    unique.sort((a,b)=>(a.alternativeRank||0)-(b.alternativeRank||0)||R.quality(a,b)||a.day.localeCompare(b.day)||R.compare(a,b));
    const out=[],bands=new Set();for(const s of unique){const group=s.day+'|'+R.band(s.anchorMinute);if(bands.has(group)||out.some(x=>overlaps(x,s)))continue;out.push(s);bands.add(group);}
    return out;
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
    let shorter=shortChoices(req.range,'shorter',1);const good=full.some(perfect)||shorter.some(perfect);
    shorter=shorter.filter(s=>!s.requiredConflictCount||!good);
    const replacements=new Map(shorter.map(s=>[s.start,s]));
    const originals=full.filter(s=>{const replacement=shorter.find(x=>!x.requiredConflictCount&&overlaps(x,s))||replacements.get(s.start);return !replacement||!s.requiredConflictCount||replacement.requiredConflictCount&&replacement.shortening.after.count>=replacement.shortening.before.count&&replacement.shortening.after.minutes>=replacement.shortening.before.minutes;});
    const clear=full.filter(s=>!s.requiredConflictCount),later=[];
    if(!clear.length){const deadline=horizon(req,E),from=E.addDaysYmd(req.range.to,1),to=E.partsIn(deadline-1,req.anchorTz||req.people[0].tz).ymd;
      if(from<=to){const range={from,to},extended=E.evaluate({...fixed,range});for(const s of [...extended.open,...extended.taken])if(s.end<=deadline&&perfect(s))later.push(label(s,'extended',2));
        if(!shorter.length)for(const s of shortChoices(range,'extended-shorter',3))if(s.end<=deadline&&perfect(s))later.push(s);
      }
    }
    const allOptions=select([...originals,...shorter,...later]),clearCount=select(clear).length,initial=clearCount?Math.min(5,clearCount):3;
    return {...empty,options:allOptions.slice(0,initial),allOptions,open:select(clear),openCount:base.open.length,clearCount,deadline:horizon(req,E)};
  }
  return {durations,horizon,perfect,select,find};
});
