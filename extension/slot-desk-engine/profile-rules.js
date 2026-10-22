(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotProfileRules=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const defaults={leave:'holiday, vacation, annual leave, sick leave, parental leave, OOO, out of office',soft:'hold, tentative, placeholder, TBC, TBD, focus, prep',protect:'do not schedule, do not book, do not move, doctor, dentist, medical, personal'};
  const stamp=v=>{const t=typeof v==='object'?(v?.dateTime||v?.date):v;return typeof t==='string'&&t.includes('T')&&Number.isFinite(Date.parse(t))?new Date(t).toISOString():t||'';};
  function seriesKey(ev){return ev.recurringEventId?(ev.iCalUID?'uid:'+ev.iCalUID:(ev.calendarId||'')+'|'+ev.recurringEventId):'';}
  function eventKey(ev){return ev.iCalUID?ev.iCalUID+'|'+(ev.recurringEventId?stamp(ev.originalStart||ev.originalStartTime||ev.start):'single'):(ev.calendarId||'')+'|'+ev.id;}
  function override(ev,p={}){
    const keys=new Set([eventKey(ev),ev.identity,ev.id,(ev.calendarId||'')+'|'+ev.id,ev.iCalUID?ev.iCalUID+'|'+stamp(ev.originalStart||ev.originalStartTime||ev.start):''].filter(Boolean)),series=seriesKey(ev);
    const rules=p.eventTreatments||[];
    for(let i=rules.length-1;i>=0;i--){const rule=rules[i];if(rule.scope==='series'?!!series&&rule.key===series:keys.has(rule.key))return rule.value==='auto'?undefined:rule.value;}
    for(const key of keys)if(p.eventOverrides?.[key])return p.eventOverrides[key]==='auto'?undefined:p.eventOverrides[key];
    return ev.override==='auto'?undefined:ev.override;
  }
  function treatment(ev,p={}){
    const keys=new Set([eventKey(ev),ev.identity,ev.id].filter(Boolean)),series=seriesKey(ev);
    for(let i=(p.eventTreatments||[]).length-1;i>=0;i--){const r=p.eventTreatments[i];if(r.scope==='series'?series&&r.key===series:keys.has(r.key))return {value:r.value,scope:r.scope};}
    return {value:override(ev,p)||'auto',scope:'occurrence'};
  }
  function apply(p,ev,scope,value){
    if(!['auto','ignore','protected','leave'].includes(value)||!['occurrence','series'].includes(scope))throw new Error('Choose a meeting treatment.');
    const series=seriesKey(ev),key=scope==='series'?series:eventKey(ev);if(!key||scope==='series'&&!series)throw new Error('The recurring series could not be identified.');
    const next=(p.eventTreatments||[]).filter(r=>scope==='series'?(r.key!==series&&r.seriesKey!==series):!(r.scope==='occurrence'&&r.key===key));
    next.push({scope,key,value,seriesKey:series});return next;
  }
  const escape=v=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const words=value=>String(value??'').split(',').map(v=>v.trim()).filter(Boolean);
  const pattern=value=>{const terms=words(value);return terms.length?'(?:^|[^\\p{L}\\p{N}_])(?:'+terms.map(v=>escape(v).replace(/\s+/g,'\\s+')).join('|')+')(?=$|[^\\p{L}\\p{N}_])':'(?!)';};
  function detects(p,key,title,legacy){
    if(p.eventDetectionEnabled===false)return false;
    if(p.keywordMatchingVersion===1||(p.keywordCategories||[]).includes(key)){if(key==='protect'&&p.airportRule!==false&&/\b[A-Z]{3}\s*>\s*[A-Z]{3}\b/.test(title||''))return true;return new RegExp(pattern(p.ruleTerms?.[key]??defaults[key]),'iu').test(title||'');}
    const value=p.eventRules?.[key]??legacy;if(value===undefined)return false;const regex=value instanceof RegExp?value:new RegExp(value,'i');regex.lastIndex=0;return regex.test(title||'');
  }
  const date=v=>/^\d{4}-\d\d-\d\d$/.test(v||'')&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
  const clock=v=>/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v||'');
  function validateBlocker(b){
    if(!b||typeof b.id!=='string'||!b.id||typeof b.label!=='string'||typeof b.recurring!=='boolean'||typeof b.allDay!=='boolean'||!date(b.from)||b.to&&(!date(b.to)||b.from>b.to)||!clock(b.s)||!clock(b.e))throw new Error('Check the blocker dates and times.');
    if(b.recurring){if(!Array.isArray(b.days)||!b.days.length||b.days.some(d=>!Number.isInteger(d)||d<0||d>6)||!b.allDay&&b.s===b.e)throw new Error('Choose weekdays and a start and end time.');}
    else if(!date(b.to)||!b.allDay&&(b.from===b.to&&b.s>=b.e))throw new Error('The blocker must end after it starts.');
    return b;
  }
  const minute=v=>+v.slice(0,2)*60 + +v.slice(3);
  function blocked(p,start,end,E){
    const zone=p.tz,from=E.addDaysYmd(E.partsIn(start,zone).ymd,-1),to=E.partsIn(end-1,zone).ymd;
    function instant(day,m,endBoundary=false){if(m===1440)return E.startOfDay(E.addDaysYmd(day,1),zone);let t=E.zonedToInstant(day,m,zone);if(!Number.isFinite(t)){for(let n=m+1;n<1440&&!Number.isFinite(t);n++)t=E.zonedToInstant(day,n,zone);if(!Number.isFinite(t))t=E.startOfDay(E.addDaysYmd(day,1),zone);}const first=t;if(endBoundary)for(let n=15;n<=180;n+=15){const later=first+n*60000,part=E.partsIn(later,zone);if(part.ymd===day&&part.min===m)t=later;}return t;}
    for(const b of p.blockers||[]){
      const hit=(a,z)=>Math.max(start,a)<Math.min(end,z)?{label:b.label||'Blocked time',from:new Date(a).toISOString(),to:new Date(z).toISOString(),blockerId:b.id}:null;
      if(!b.recurring){const a=instant(b.from,b.allDay?0:minute(b.s)),z=b.allDay?E.startOfDay(E.addDaysYmd(b.to,1),zone):instant(b.to,minute(b.e),true),result=hit(a,z);if(result)return result;continue;}
      for(let d=from;d<=to;d=E.addDaysYmd(d,1)){if(d<b.from||b.to&&d>b.to||!b.days.includes(E.partsIn(E.startOfDay(d,zone)+43200000,zone).wd))continue;const a=instant(d,b.allDay?0:minute(b.s)),endDay=!b.allDay&&minute(b.e)<minute(b.s)?E.addDaysYmd(d,1):d,z=b.allDay?E.startOfDay(E.addDaysYmd(d,1),zone):instant(endDay,minute(b.e),true),result=hit(a,z);if(result)return result;}
    }return null;
  }
  const active=(b,today)=>!b.to||(b.recurring&&!b.allDay&&b.e<b.s?new Date(Date.parse(b.to)+86400000).toISOString().slice(0,10):b.to)>=today;
  return {defaults,words,pattern,detects,eventKey,seriesKey,override,treatment,apply,validateBlocker,blocked,active};
});
