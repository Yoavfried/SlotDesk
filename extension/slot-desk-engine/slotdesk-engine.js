/* Dependency-free scheduling engine. Calendar creation lives in google-writer.js.
 * API and scheduling semantics: docs/products/slotdesk/engine-api.md at repo root. */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./scheduling-ranking.js')); else root.SlotEngine = factory(root.SlotRanking);
})(typeof self !== 'undefined' ? self : this, function(Ranking) {
  'use strict';
  const MIN = 60000, DAY3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], formats = new Map(), instants = new Map();
  const DEFAULTS = { work: {s:'09:00',e:'18:00'}, ok: {s:'07:00',e:'20:00'}, radius:0, notice:0 };
  const RULES = {
    protect: 'flight|✈|→|->|\\b[A-Z]{3}\\s*>\\s*[A-Z]{3}\\b|airport|commute|travel|trip to|train|offsite|off-site|\\bdns\\b|do not (schedule|book|move)|\\booo\\b|out of office|vacation|holiday|annual leave|doctor|dentist|medical|family|personal|school|pick ?up|board meeting',
    soft: '^\\s*hold\\b|\\bhold:|placeholder|tentative|\\btbc\\b|\\btbd\\b|focus|prep\\b|buffer|catch ?up on',
    leave: '\\booo\\b|out of office|vacation|holiday|annual leave|sick leave|parental leave'
  };
  function formatter(tz) {
    if (!formats.has(tz)) formats.set(tz,new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    return formats.get(tz);
  }
  function partsIn(t,tz) {
    const p={}; for(const q of formatter(tz).formatToParts(new Date(t))) p[q.type]=q.value;
    const hh=+p.hour%24,mm=+p.minute;
    return {y:+p.year,m:+p.month,d:+p.day,hh,mm,wd:DAY3.indexOf(p.weekday),min:hh*60+mm,ymd:`${p.year}-${p.month}-${p.day}`,asUtc:Date.UTC(+p.year,+p.month-1,+p.day,hh,mm,+p.second)};
  }
  const ms=t=>typeof t==='number'?t:Date.parse(t), toMin=t=>+t.slice(0,2)*60 + +t.slice(3,5);
  const hhmm=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  function addDaysYmd(d,n) {const [y,m,day]=d.split('-').map(Number); return new Date(Date.UTC(y,m-1,day+n)).toISOString().slice(0,10);}
  function zonedToInstant(d,min,tz) {
    const key=`${d}|${min}|${tz}`; if(instants.has(key)) return instants.get(key);
    const [y,m,day]=d.split('-').map(Number), base=Date.UTC(y,m-1,day,Math.floor(min/60),min%60);
    const offsets=new Set([-36,0,36].map(h=>{const t=base+h*3600000;return partsIn(t,tz).asUtc-t;}));
    const date=new Date(base).toISOString().slice(0,10), minute=((min%1440)+1440)%1440;
    const matches=[...offsets].map(o=>base-o).filter(t=>{const p=partsIn(t,tz);return p.ymd===date&&p.min===minute;});
    const result=matches.length?Math.min(...matches):NaN; // Missing DST time is rejected; repeated time chooses earlier occurrence.
    if(instants.size>20000) instants.clear(); instants.set(key,result); return result;
  }
  function startOfDay(d,tz) {
    // Some zones advance clocks at midnight. The date begins at its first real local minute.
    for(let m=0;m<=180;m++){const t=zonedToInstant(d,m,tz);if(Number.isFinite(t))return t;}
    throw new Error(`No supported midnight boundary for ${d} in ${tz}`);
  }
  const WEEK=(on,s,e)=>Object.fromEntries(Array.from({length:7},(_,i)=>[i,{on:on.includes(i),s,e}]));
  const WEEK_MON_FRI=(s='09:00',e='18:00')=>WEEK([1,2,3,4,5],s,e), WEEK_SUN_THU=(s='09:00',e='18:00')=>WEEK([0,1,2,3,4],s,e);
  const pattern=(v,f)=>v instanceof RegExp?v:new RegExp(v===undefined?f:v,'i');
  const matches=(r,t)=>{r.lastIndex=0;return r.test(t||'');};
  const overlap=(a,b,c,d)=>Math.max(0,Math.min(b,d)-Math.max(a,c));
  function merge(intervals) {
    const out=[];
    for(const [s,e] of intervals.filter(x=>Number.isFinite(x[0])&&x[1]>x[0]).sort((a,b)=>a[0]-b[0])) {
      const last=out[out.length-1]; if(last&&s<=last[1]) last[1]=Math.max(last[1],e); else out.push([s,e]);
    } return out;
  }
  const covered=(xs,s,e)=>merge(xs).some(x=>x[0]<=s&&x[1]>=e);
  function subtract(intervals,cuts) {
    let out=intervals;
    for(const [cs,ce] of merge(cuts)) out=out.flatMap(([s,e])=>!overlap(s,e,cs,ce)?[[s,e]]:[[s,Math.min(e,cs)],[Math.max(s,ce),e]].filter(x=>x[1]>x[0]));
    return out;
  }
  function tzFor(p,t) {
    const home=partsIn(t,p.tz).ymd,trip=(p.travel||[]).find(x=>home>=x.from&&home<=x.to);
    return {tz:trip?trip.tz:p.tz,trip:trip||null};
  }
  function localWindows(start,end,tz,getRules,cache) {
    const a=partsIn(start,tz).ymd,b=partsIn(end-1,tz).ymd,out=[];
    for(let d=a;d<=b;d=addDaysYmd(d,1)) {
      const key=`${tz}|${d}`; let windows=cache&&cache.get(key);
      if(!windows) {const wd=partsIn(zonedToInstant(d,720,tz),tz).wd; windows=(getRules(wd,d)||[]).map(r=>[r.s==='00:00'?startOfDay(d,tz):zonedToInstant(d,toMin(r.s),tz),r.e==='24:00'?startOfDay(addDaysYmd(d,1),tz):zonedToInstant(d,toMin(r.e),tz)]);if(cache)cache.set(key,windows);}
      out.push(...windows);
    }return out;
  }
  function availabilityFits(p,start,end) {
    if(!(p.availability||[]).length)return true;
    return p.availability.some(r=>{
      const tz=r.tz||p.tz,l=partsIn(start,tz);
      if((r.from&&l.ymd<r.from)||(r.to&&l.ymd>r.to)||(r.days&&!r.days.includes(l.wd)))return false;
      if(r.exact)return start===zonedToInstant(l.ymd,toMin(r.s),tz);
      return covered([[zonedToInstant(l.ymd,toMin(r.s),tz),zonedToInstant(l.ymd,toMin(r.e),tz)]],start,end);
    });
  }
  function eventKey(ev) {return ev.identity||(ev.iCalUID?`${ev.iCalUID}|${ev.originalStart||ev.start}`:ev.id?`${ev.calendarId||''}|${ev.id}`:ev);}
  const eventOverride=(ev,p)=>(p.eventOverrides||{})[ev.identity]||(p.eventOverrides||{})[ev.id]||ev.override;
  function classify(ev,p,words) {
    const override=eventOverride(ev,p),title=`“${(ev.title||'untitled').trim()}”`;
    if(override==='ignore')return {cost:0,category:'ignored',label:`${title} ignored by EA`};
    if(override==='protected'||override==='leave')return {cost:Infinity,category:override,label:`${title} protected by EA`};
    if(override==='soft'||override==='movable')return {cost:override==='soft'?1:3,category:override,label:`${title}: EA override (${override})`};
    if(p.isOwnProfile&&ev.calendarId&&!override&&(ev.type==='ooo'||ev.type==='leave'||ev.allDay))return {cost:8,category:'own-leave',label:`${ev.detailsVisible===false?'Time off':title} is time off in your calendar — review before overlapping`};
    if(ev.type==='ooo'||ev.type==='leave'||ev.allDay)return {cost:Infinity,category:'leave',label:`${title}: leave / protected all-day time`};
    if(p.calendar!=='detail'||ev.detailsVisible===false)return {cost:4,category:'hidden',label:`busy, details hidden — ask ${p.name}`};
    const rules=p.eventRules||words||{},n=ev.attendees||1;
    if(matches(pattern(rules.protect,RULES.protect),ev.title))return p.isOwnProfile&&ev.calendarId?{cost:8,category:'own-inferred',label:`${title} matches a title-based protection rule in your calendar — review before overlapping`}:{cost:Infinity,category:'protected',label:`${title} matches a protected rule`};
    if(ev.external)return {cost:6+(n>=5?1:0),category:'external',label:`${title} has external guests — avoid`};
    if(ev.status==='tentative'||ev.type==='focus'||matches(pattern(rules.soft,RULES.soft),ev.title))return {cost:1,category:'soft',label:`${title} is a hold or tentative event`};
    if(n>1&&ev.recurring)return {cost:2+(n>=5?1:0),category:'recurring',label:`${title} is a recurring internal meeting (${n} people)`};
    return {cost:3+(n>=5?1:0),category:'internal',label:`${title} is ${n>1?'a one-off internal meeting':'a solo event; check its purpose'}`};
  }
  function eventIntervals(ev,p) {
    const tz=ev.tz||p.tz;
    let intervals=[ev.allDay?[startOfDay(ev.start.slice(0,10),tz),startOfDay(ev.end.slice(0,10),tz)]:[ms(ev.start),ms(ev.end)]];
    if(ev.type==='ooo'||ev.type==='leave'||eventOverride(ev,p)==='leave')intervals=subtract(intervals,(p.holidayExclusions||[]).map(x=>[startOfDay(x.from,tz),startOfDay(addDaysYmd(x.to||x.from,1),tz)]));
    return intervals;
  }
  const eventsFor=p=>[...(p.busy||[]),...(p.flights||[]).map((f,i)=>({id:`flight-${i}`,start:f.departure,end:f.arrival,title:f.label||'Flight',override:'protected',type:'flight',detailsVisible:true}))];
  function conflictsFor(p,start,end) {
    const out=[],seen=new Set();
    for(const ev of eventsFor(p)) {
      if(eventOverride(ev,p)==='ignore')continue;
      const key=eventKey(ev);if(seen.has(key))continue;seen.add(key);
      // Hard radii are separate profile constraints, not extra meeting minutes.
      if(eventIntervals(ev,p).some(([s,e])=>overlap(start,end,s,e)))out.push(ev);
    }return out;
  }
  function fitPerson(p,start,end,now=0,options={}) {
    const zone=tzFor(p,start).tz,endZone=tzFor(p,end-1).tz,L=partsIn(start,zone),R=partsIn(end,endZone);
    const res={band:'ok',outside:0,usualOutside:0,explicitOutside:0,distance:0,margin:1e9,why:null,issue:null,timing:[],local:`${DAY3[L.wd]} ${hhmm(L.min)}`,localEnd:hhmm(R.min),date:L.ymd,endDate:R.ymd,tz:zone,endTz:endZone,notes:[]};
    const no=(why,kind='protected',detail={})=>Object.assign(res,{band:'no',why,issue:{kind,detail},margin:0});
    if(start<now)return no('already in the past','past');
    if(start<now+(p.notice||0)*3600000)return no(`less than ${p.notice}h notice for ${p.name}`,'notice');
    const positive=(p.availability||[]).length>0;
    if(!availabilityFits(p,start,end))return no(`outside stated availability for ${p.name}`,'availability');
    const usual=[],explicit=[],cache=options.cache;
    const addExplicit=(s,e,kind,label)=>{if(overlap(start,end,s,e)){explicit.push([s,e]);res.timing.push({kind,label,from:new Date(s).toISOString(),to:new Date(e).toISOString(),minutes:overlap(start,end,s,e)/MIN});}};
    for(let s=start;s<end;) {
      const home=partsIn(s,p.tz).ymd,boundary=startOfDay(addDaysYmd(home,1),p.tz),e=Math.min(end,boundary),tz=tzFor(p,s).tz,days=p.days||WEEK_MON_FRI();
      const work=localWindows(s,e,tz,wd=>days[wd]?.on?[days[wd]]:[],cache&&cache.work);
      const acceptable=localWindows(s,e,tz,wd=>{const r=days[wd];if(!p.ignoreWorkingHours&&(!r||!r.on))return [];const lim=p.limit||DEFAULTS.ok;return [{s:hhmm(p.ignoreWorkingHours?toMin(lim.s):Math.min(toMin(r.s),toMin(lim.s))),e:hhmm(p.ignoreWorkingHours?toMin(lim.e):Math.max(toMin(r.e),toMin(lim.e)))}];},cache&&cache.ok);
      if(!positive){
        if(!p.ignoreWorkingHours){const workDay=localWindows(s,e,tz,wd=>days[wd]?.on?[{s:'00:00',e:'24:00'}]:[],cache&&cache.day);if(!covered(workDay,s,e))return no(`not a working day for ${p.name}`,'nonworking-day');}
        if(!covered(acceptable,s,e)){if(!options.allowBadHours)return no(`bad hour for ${p.name} (outside acceptable hours)`,'acceptable-hours');res.band='bad';res.notes.push(`${p.name}: explicitly enabled hours outside acceptable range`);}
        const comfort=p.ignoreWorkingHours?acceptable:work;
        if(!p.ignoreConvenience)usual.push(...subtract([[s,e]],comfort));
        const inside=comfort.find(w=>w[0]<=s&&w[1]>=e);res.margin=Math.min(res.margin,inside?Math.min(s-inside[0],inside[1]-e)/MIN:0);
        if(!p.ignoreConvenience){const distance=comfort.length?Math.min(...comfort.map(([a,b])=>e<=a?(a-e)/MIN:s>=b?(s-b)/MIN:0)):0;res.distance=Math.max(res.distance,distance);}
      }
      if(localWindows(s,e,tz,wd=>(p.blocks||[]).filter(b=>b.day===wd)).some(b=>overlap(s,e,...b)))return no(`runs into protected time for ${p.name}`,'protected');
      if(!(e>s))throw new Error('Unable to resolve local date boundary');s=e;
    }
    if(p.ignoreConvenience){res.margin=60;res.distance=0;}
    for(const c of options.constraints||[]){if(c.who&&c.who!=='all'&&c.who!==p.id)continue;if(!overlap(start,end,ms(c.from),ms(c.to)))continue;if(c.kind==='inconvenient')addExplicit(ms(c.from),ms(c.to),'manual-inconvenience',c.label||'Marked inconvenient time');else return no(`blocked: ${c.label||'manual constraint'} (${p.name})`,'protected',{label:c.label,from:c.from,to:c.to});}
    const radius=p.radius?.minutes??p.buffer??0,blocked=p.radius?p.radius.mode==='blocked':!!p.buffer;
    if(radius)for(const ev of eventsFor(p))if(eventOverride(ev,p)!=='ignore'&&!ev.allDay&&!['ooo','leave','flight'].includes(ev.type))for(const [a,b]of eventIntervals(ev,p)){
      for(const [s,e]of [[a-radius*MIN,a],[b,b+radius*MIN]])if(overlap(start,end,s,e)){
        if(blocked)return no(`runs into a blocked meeting radius for ${p.name}`,'meeting-radius',{label:ev.detailsVisible===false?'Busy appointment':ev.title,from:new Date(s).toISOString(),to:new Date(e).toISOString()});
        addExplicit(s,e,'meeting-radius',ev.detailsVisible===false?'Time around a busy appointment':'Time around '+(ev.title||'an appointment'));
      }
    }
    for(const f of p.flights||[])for(const t of [ms(f.departure),ms(f.arrival)])addExplicit(t-120*MIN,t+120*MIN,'flight-buffer',f.label||'Flight buffer');
    for(const x of p.inconvenience||[])addExplicit(ms(x.from),ms(x.to),'manual-inconvenience',x.label||'Marked inconvenient time');
    const minutes=intervals=>merge(intervals).reduce((n,[a,b])=>n+overlap(start,end,a,b)/MIN,0);
    res.usualOutside=minutes(usual);res.explicitOutside=minutes(explicit);res.outside=minutes([...usual,...explicit]);
    if(res.usualOutside)res.timing.unshift({kind:p.ignoreWorkingHours?'convenience-hours':'working-hours',label:p.ignoreWorkingHours?'Outside usual convenience hours':'Outside working hours',minutes:res.usualOutside});
    if(res.outside){if(res.band!=='bad')res.band='stretch';res.margin=0;res.why=`${res.local} for ${p.name}: ${res.outside} inconvenient minutes`;res.notes.push(res.why);}
    if(res.margin===1e9)res.margin=60;return res;
  }
  const dateValid=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
  const timeValid=t=>/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(t||'')||t==='24:00';
  const zoneValid=tz=>{try{formatter(tz);return typeof tz==='string'&&!!tz;}catch(_){return false;}};
  const instantValid=t=>Number.isFinite(ms(t))&&(typeof t==='number'||/(?:Z|[+-]\d\d:\d\d)$/i.test(t));
  function validate(req={}) {
    req=req||{};
    const errors=[],warnings=[],err=m=>errors.push(m),r=req.range||{};
    if(!dateValid(r.from)||!dateValid(r.to)||r.from>r.to)err('Choose a valid inclusive date range');else if((Date.parse(r.to)-Date.parse(r.from))/86400000>92)err('Search at most 93 days at once');
    for(const [key,v,min,max] of [['duration',req.duration,1,1440],['step',req.step??30,5,1440],['want',req.want??3,1,20],['perDay',req.perDay??1,1,20],['minDuration',req.minDuration??30,1,1440],['extendDays',req.extendDays??5,0,30]])if(!Number.isInteger(v)||v<min||v>max)err(`${key} must be an integer from ${min} to ${max}`);
    for(const key of ['spacingMode','perDayMode'])if(req[key]!==undefined&&!['automatic','custom'].includes(req[key]))err('Invalid '+key);
    if(req.spacingMode==='custom'&&(req.step??10)%5!==0)err('Start-time spacing must use multiples of 5 minutes');
    if(req.anchorTz&&!zoneValid(req.anchorTz))err('Invalid search timezone');if(req.now!==undefined&&!instantValid(req.now))err('now must have a timezone offset');
    const people=Array.isArray(req.people)?req.people.filter(p=>p&&typeof p==='object'):[];
    if(!people.length||!people.some(p=>p.required!==false))err('At least one required participant is needed');
    if(!Array.isArray(req.people)||people.length!==req.people.length)err('Participants must be a list of profiles');
    const ids=new Set();
    for(const p of people) {
      for(const flag of ['ignoreWorkingHours','ignoreConvenience','allowOverlap'])if(p[flag]!==undefined&&typeof p[flag]!=='boolean')err(`Invalid ${flag} setting for ${p.name}`);
      if(!p.id||ids.has(p.id))err('Each participant needs a unique ID');ids.add(p.id);
      if(!zoneValid(p.tz))err(`Enter a valid timezone for ${p.name||p.id}`);
      if(!Number.isFinite(p.notice??0)||(p.notice??0)<0||(p.notice??0)>720)err(`Invalid notice for ${p.name}`);
      if(p.buffer!==undefined&&(!Number.isFinite(p.buffer)||p.buffer<0))err(`Invalid buffer for ${p.name}`);
      if(p.radius&&(!['blocked','inconvenient'].includes(p.radius.mode)||!Number.isFinite(p.radius.minutes)||p.radius.minutes<0||p.radius.minutes>720))err(`Invalid meeting radius for ${p.name}`);
      for(const w of [...Object.values(p.ignoreWorkingHours?{}:p.days||{}).filter(x=>x.on),...(p.blocks||[]),...(p.limit?[p.limit]:[])])if(!timeValid(w.s)||!timeValid(w.e)||toMin(w.s)>=toMin(w.e))err(`Hours must increase within one day for ${p.name}`);
      for(const a of p.availability||[]) {
        if(!timeValid(a.s)||a.s==='24:00'||(!a.exact&&(!timeValid(a.e)||toMin(a.s)>=toMin(a.e))))err(`Invalid stated availability for ${p.name}`);
        if(a.tz&&!zoneValid(a.tz))err(`Invalid availability timezone for ${p.name}`);
        if((a.from&&!dateValid(a.from))||(a.to&&!dateValid(a.to))||(a.from&&a.to&&a.from>a.to)||(a.days&&(!a.days.length||a.days.some(d=>!Number.isInteger(d)||d<0||d>6))))err(`Invalid availability dates/weekdays for ${p.name}`);
      }
      for(const tr of p.travel||[])if(!dateValid(tr.from)||!dateValid(tr.to)||tr.from>tr.to||!zoneValid(tr.tz))err(`Invalid travel dates/timezone for ${p.name}`);
      const trips=[...(p.travel||[])].sort((a,b)=>a.from.localeCompare(b.from));if(trips.some((x,i)=>i&&x.from<=trips[i-1].to))err(`Travel ranges overlap for ${p.name}`);
      for(const x of p.holidayExclusions||[])if(!dateValid(x.from)||!dateValid(x.to||x.from)||x.from>(x.to||x.from))err(`Invalid leave exclusion for ${p.name}`);
      for(const f of p.flights||[])if(!instantValid(f.departure)||!instantValid(f.arrival)||ms(f.departure)>=ms(f.arrival))err(`Flight times need offsets and arrival after departure for ${p.name}`);
      for(const ev of p.busy||[]) {if(ev.allDay?!dateValid(ev.start?.slice(0,10))||!dateValid(ev.end?.slice(0,10))||ev.start>=ev.end:!instantValid(ev.start)||!instantValid(ev.end)||ms(ev.start)>=ms(ev.end))err(`Invalid calendar event for ${p.name}`);if(ev.tz&&!zoneValid(ev.tz))err(`Invalid event timezone for ${p.name}`);}
      for(const x of p.inconvenience||[])if(!instantValid(x.from)||!instantValid(x.to)||ms(x.from)>=ms(x.to))err(`Invalid inconvenience window for ${p.name}`);
      try{for(const key of ['protect','soft','leave'])pattern((p.eventRules||{})[key],'');}catch(_){err(`Invalid classification expression for ${p.name}`);}
    }
    try{for(const key of ['protect','soft'])pattern((req.words||{})[key],'');}catch(_){err('Invalid classification expression');}
    for(const c of req.constraints||[]) {if(!instantValid(c.from)||!instantValid(c.to)||ms(c.from)>=ms(c.to))err('Manual constraints need increasing ranges with offsets');if(c.who&&c.who!=='all'&&!ids.has(c.who))warnings.push(`Constraint for absent participant ${c.who} ignored`);}
    return {errors,warnings};
  }
  function coverageKnown(p,start,end,now) {
    const sources=p.coverages||(p.coverage?[p.coverage]:[]);
    return p.calendar!=='none'&&sources.length>0&&sources.every(c=>c.complete&&!c.error&&ms(c.from)<=start&&ms(c.to)>=end&&(!c.fetchedAt||now-ms(c.fetchedAt)<=(c.maxAgeMinutes??5)*MIN));
  }
  function conflictFact(event,p,rule){
    return {key:eventKey(event),id:event.id,calendarId:event.calendarId,kind:event.type==='flight'?'flight':event.allDay||['ooo','leave'].includes(event.type)?'leave':'meeting',title:event.detailsVisible===false?'Busy appointment':event.title||'Untitled appointment',start:event.start,end:event.end,tz:event.tz||p.tz,allDay:!!event.allDay,hidden:event.detailsVisible===false,category:rule.category,label:rule.label};
  }
  function evaluate(req,opt={}) {
    req=req||{};const check=validate(req);if(check.errors.length)return {open:[],taken:[],rejected:{},protectedConflicts:[],rejectionDetails:[],...check};
    const duration=opt.duration??req.duration,to=opt.to||req.range.to,people=opt.people||req.people,anchor=req.anchorTz||Intl.DateTimeFormat().resolvedOptions().timeZone,now=ms(req.now??Date.now());
    const open=[],taken=[],rejected={},protectedConflicts=new Map(),rejectionDetails=new Map(),seen=new Set(),caches=people.map(()=>({work:new Map(),ok:new Map(),day:new Map()}));
    const reject=why=>{rejected[why]=(rejected[why]||0)+1;},automatic=req.spacingMode!=='custom',step=automatic?5:req.step??10;
    for(let day=req.range.from;day<=to;day=addDaysYmd(day,1)){
      const starts=new Set();if(opt.exactStart!==undefined)starts.add(opt.exactStart);else for(let m=0;m<1440;m+=step)starts.add(zonedToInstant(day,m,anchor));
      for(const start of starts){
        if(!Number.isFinite(start)||seen.has(start)||partsIn(start,anchor).ymd!==day)continue;seen.add(start);
        const end=start+duration*MIN,fits=people.map((p,i)=>fitPerson(p,start,end,now,{constraints:req.constraints,allowBadHours:opt.allowBadHours,cache:caches[i]}));
        const bad=fits.findIndex((f,i)=>f.band==='no'&&people[i].required!==false);
        if(bad>=0){const f=fits[bad],p=people[bad];reject(f.why);const key=p.id+'|'+f.issue?.kind+'|'+JSON.stringify(f.issue?.detail||{});if(!rejectionDetails.has(key))rejectionDetails.set(key,{personId:p.id,name:p.name,reason:f.why,...f.issue});continue;}
        const required=fits.filter((_,i)=>people[i].required!==false),clashes=new Map();
        const slot={start,end,startISO:new Date(start).toISOString(),endISO:new Date(end).toISOString(),day,duration,anchorMinute:partsIn(start,anchor).min,maxOutside:Math.max(0,...required.map(f=>f.outside)),sumOutside:required.reduce((n,f)=>n+f.outside,0),maxDistance:Math.max(0,...required.map(f=>f.distance)),sumDistance:required.reduce((n,f)=>n+f.distance,0),margin:Math.min(...required.map(f=>f.margin)),optionalAttendance:0,notes:[],confirmed:true,people:[]};
        people.forEach((p,i)=>{
          const f=fits[i],conflicts=conflictsFor(p,start,end),available=f.band!=='no'&&!conflicts.length,confirmed=coverageKnown(p,start,end,now);
          const facts=conflicts.map(ev=>conflictFact(ev,p,classify(ev,p,req.words)));
          slot.people.push({id:p.id,name:p.name,email:p.email,required:p.required!==false,local:f.local,localEnd:f.localEnd,date:f.date,endDate:f.endDate,tz:f.tz,endTz:f.endTz,band:f.band,available,confirmed,inconvenientMinutes:f.outside,usualInconvenientMinutes:f.usualOutside,explicitInconvenientMinutes:f.explicitOutside,distance:f.distance,timing:f.timing,fitIssue:f.issue,availabilityReason:f.band==='no'?f.why:null,hasCalendarConflict:!!conflicts.length,calendarConflictCount:conflicts.length,conflicts:facts,ignoreConvenience:p.ignoreConvenience===true,allowOverlap:p.allowOverlap===true});slot.notes.push(...f.notes);
          if(!confirmed){if(p.required!==false)slot.confirmed=false;slot.notes.push(`cannot see ${p.name}'s complete calendar — availability unconfirmed${p.calendarError?': '+p.calendarError:''}`);}
          if(p.required===false){if(available)slot.optionalAttendance++;else slot.notes.push(`optional guest ${p.name} cannot attend: ${f.why||'busy'}`);}
          else for(const ev of conflicts){const c=classify(ev,p,req.words);if(c.category==='ignored')continue;const key=eventKey(ev),old=clashes.get(key);if(old){if(c.cost>old.cost){old.cost=c.cost;old.label=c.label;old.category=c.category;}old.participants.push(p.id);old.who+=', '+p.name;}else clashes.set(key,{who:p.name,participants:[p.id],required:true,cost:c.cost,category:c.category,label:c.label,event:ev,organizer:ev.organizer||null,ask:ev.organizer?`Coordinate with ${ev.organizer}`:`Ask ${p.name}`,action:c.category==='own-leave'?'Review this time off before sending':'Find a replacement time immediately'});}
          for(const mk of p.markers||[])if(f.date>=mk.from&&f.date<mk.to)slot.notes.push(`${p.name}: all-day note “${mk.title||'untitled'}”${mk.review?' — review classification':''}`);
        });
        const blocking=[...clashes.values()];slot.requiredConflictCount=blocking.length;slot.outsideHours=slot.people.some(p=>p.required&&p.band==='bad');slot.permissionTier=0;
        if(blocking.some(c=>!Number.isFinite(c.cost))){for(const conflict of blocking.filter(c=>!Number.isFinite(c.cost))){const key=eventKey(conflict.event),previous=protectedConflicts.get(key),participants=[...new Set([...(previous?.participants||[]),...conflict.participants])];protectedConflicts.set(key,{...conflict,participants,who:people.filter(p=>participants.includes(p.id)).map(p=>p.name).join(', ')});}reject('runs into travel, time off or protected time');continue;}
        if(blocking.length){slot.overrides=slot.toMove=blocking;slot.rescheduleCount=blocking.filter(c=>c.category!=='own-leave').length;slot.cost=blocking.reduce((n,c)=>n+c.cost,0);slot.peopleHit=new Set(blocking.flatMap(c=>c.participants)).size;slot.permissionTier=blocking.every(c=>c.category!=='hidden'&&c.participants.every(id=>people.find(p=>p.id===id)?.allowOverlap===true))?0:1;slot.notes.push('Warning: this SlotDesk proposal introduces conflicts. Existing appointments are unchanged. Find replacement times immediately.');}
        Ranking.metrics(slot,people);(slot.permissionTier?taken:open).push(slot);
      }
    }
    const candidates=opt.exactStart===undefined?Ranking.precision([...open,...taken],automatic):[...open,...taken],allowed=new Set(candidates);
    return {open:open.filter(s=>allowed.has(s)).sort(Ranking.compare),taken:taken.filter(s=>allowed.has(s)).sort(Ranking.compare),rejected,protectedConflicts:[...protectedConflicts.values()],rejectionDetails:[...rejectionDetails.values()],errors:[],warnings:check.warnings};
  }
  function findSlots(req){
    req=req||{};const base=evaluate(req),want=req.want??3,perDay=req.perDayMode==='automatic'?Infinity:req.perDay??Infinity;
    const choose=slots=>Ranking.select(slots,want,perDay),result={open:[],openCount:base.open.length,clearCount:base.open.filter(s=>!s.requiredConflictCount).length,options:[],rejected:base.rejected,protectedConflicts:base.protectedConflicts,rejectionDetails:base.rejectionDetails,errors:base.errors,warnings:base.warnings,fallback:null,lastResort:null};if(base.errors.length)return result;
    result.open=choose(base.open);
    const label=(slots,type,rank)=>slots.map(s=>({...s,alternativeType:type,alternativeRank:rank}));
    const original=label([...base.open,...base.taken],'requested',0),short=req.duration>(req.minDuration??30)?evaluate(req,{duration:req.minDuration??30}):null;
    const extended=req.extendDays===0?null:evaluate(req,{to:addDaysYmd(req.range.to,req.extendDays??5)});
    const shortAll=label(short?[...short.open,...short.taken]:[],'shorter',1),extendedAll=label(extended?[...extended.open,...extended.taken].filter(s=>s.day>req.range.to):[],'extended',2);
    const shortSlots=choose(short?.open||[]),extSlots=choose(extended?.open.filter(s=>s.day>req.range.to)||[]),taken=choose(base.taken),sameDates=choose(base.open.filter(s=>!result.open.some(x=>overlap(s.start,s.end,x.start,x.end))));
    if(result.open.length<want){const groups=[{id:'same-dates',change:'Another time in your chosen dates',slots:sameDates},{id:'shorter',change:`Shorten to ${req.minDuration??30} minutes`,slots:shortSlots},{id:'extended',change:`Look ${req.extendDays??5} days further out`,slots:extSlots},{id:'occupied',change:'Overlap existing appointments',slots:taken}].filter(g=>g.slots.length);if(groups.length)result.fallback={groups,softer:groups.filter(g=>['shorter','extended'].includes(g.id)),taken};}
    const last=[];if(req.allowBadHours===true){const collect=(opt,type,rank)=>{const evaluated=evaluate(req,{...opt,allowBadHours:true}),slots=label([...evaluated.open,...evaluated.taken].filter(s=>s.outsideHours&&(type!=='extended'||s.day>req.range.to)),type,rank);last.push(...slots);return slots;};const normalLast=collect({},'requested',0);if(short)collect({duration:req.minDuration??30},'shorter',1);if(extended)collect({to:addDaysYmd(req.range.to,req.extendDays??5)},'extended',2);result.lastResort={open:choose(normalLast.filter(s=>!s.permissionTier)),taken:choose(normalLast.filter(s=>s.permissionTier))};}
    result.options=Ranking.select([...original,...shortAll,...extendedAll,...last],want,perDay,{complement:true,profiles:req.people});return result;
  }
  function proposalText(slot) {
    return [`${slot.overrides?'Override warning — ':''}${slot.confirmed?'Required calendars checked':'Availability unconfirmed'} · ${slot.duration} minutes`,...slot.people.map(p=>`${p.name}${p.required?'':' (optional)'}: ${p.date} ${p.local.slice(4)} – ${p.endDate} ${p.localEnd} (${p.tz}${p.endTz!==p.tz?' → '+p.endTz:''})${p.available?'':' — conflict / unavailable'}`),...(slot.overrides||[]).map(c=>`New conflict: ${c.who}: ${c.label}. ${c.ask}. ${c.action}.`),...slot.notes].join('\n');
  }
  return {findSlots,evaluate,fitPerson,classify,conflictsFor,validate,partsIn,zonedToInstant,startOfDay,tzFor,addDaysYmd,eventKey,proposalText,merge,WEEK,WEEK_MON_FRI,WEEK_SUN_THU,DEFAULTS,RULES};
});
