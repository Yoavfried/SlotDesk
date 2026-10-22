(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./workspace-model'),require('./slotdesk-engine'),require('./profile-rules'));else root.SlotProfileConfiguration=factory(root.SlotWorkspace,root.SlotEngine,root.SlotProfileRules);})(typeof self!=='undefined'?self:this,function(U,E,ProfileRules){
  'use strict';
  const clone=v=>JSON.parse(JSON.stringify(v));
  const fields=['name','email','tz','tzLocation','tzConfirmed','required','enabled','calendarIds','calendarLabels','leaveCalendarIds','days','limit','radius','notice','availability','travel','flights','holidayExclusions','eventRules','eventOverrides','ruleTerms','airportRule','ignoreWorkingHours','ignoreConvenience','allowOverlap','workingMode','templateDays','templateHours','manualDays','eventDetectionEnabled','keywordMatchingVersion','blockers','eventTreatments','keywordCategories'];
  const zone=v=>{try{return typeof v==='string'&&!!v&&!!new Intl.DateTimeFormat('en',{timeZone:v});}catch(_){return false;}};
  const date=v=>/^\d{4}-\d\d-\d\d$/.test(v||'')&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
  const instant=v=>typeof v==='string'&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v));
  const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
  function error(field,message){return Object.assign(new Error(message),{field});}
  function checkProfile(profile){
    const p=profile,fail=(key,message)=>{throw error(key,message);},text=(value,key)=>{if(typeof value!=='string')fail(key,'Enter valid text for '+key+'.');};
    if(!U.validEmail(p.email))fail('email','Enter a valid email address.');if(p.tzLocation!==undefined&&p.tzLocation!==null&&(!object(p.tzLocation)||typeof p.tzLocation.id!=='string'||typeof p.tzLocation.timezone!=='string'||!zone(p.tzLocation.timezone)))fail('tz','Choose a valid timezone location.');if(typeof p.name!=='string'||!p.name.trim())fail('name','Enter a profile name.');if(!zone(p.tz))fail('tz','Choose a valid timezone.');
    for(const key of ['tzConfirmed','required','enabled','airportRule','ignoreWorkingHours','ignoreConvenience','allowOverlap','eventDetectionEnabled'])if(p[key]!==undefined&&typeof p[key]!=='boolean')fail(key,'Invalid '+key+' setting.');
    for(const key of ['calendarIds','leaveCalendarIds'])if(!Array.isArray(p[key])||p[key].some(v=>typeof v!=='string'||!v)||new Set(p[key]).size!==p[key].length)fail(key,'Choose valid, different availability calendars.');
    if(p.leaveCalendarIds.some(id=>!p.calendarIds.includes(id)))fail('leaveCalendarIds','Leave calendars must be linked availability calendars.');
    if(!['template','manual'].includes(p.workingMode)||!['mon-fri','sun-thu'].includes(p.templateDays)||!['09:00|18:00','08:00|17:00','09:00|17:00','10:00|19:00'].includes(p.templateHours))fail('days','Choose a valid working-time template.');
    const minutes=v=>v==='24:00'?1440:U.parseClock(v)?+U.parseClock(v).slice(0,2)*60 + +U.parseClock(v).slice(3):NaN,clock=v=>v==='24:00'||!!U.parseClock(v),hours=(v,key)=>{if(!object(v)||!clock(v.s)||!clock(v.e)||minutes(v.s)>=minutes(v.e))fail(key,'Start time must be before end time.');};
    for(const key of ['days','manualDays']){if(!object(p[key])||Object.keys(p[key]).length!==7)fail(key,'Define all seven working days.');for(let day=0;day<7;day++){const row=p[key][day];if(!object(row)||typeof row.on!=='boolean')fail(key,'Choose whether each day is a working day.');hours(row,key);}}
    hours(p.limit,'limit');
    if(!Number.isFinite(p.notice)||p.notice<0||p.notice>720)fail('notice','Minimum notice must be between 0 and 720 hours.');
    if(!object(p.radius)||!Number.isFinite(p.radius.minutes)||p.radius.minutes<0||p.radius.minutes>720||!['blocked','inconvenient'].includes(p.radius.mode))fail('radius','Choose valid time around meetings, from 0 to 720 minutes.');
    for(const key of ['availability','travel','flights','holidayExclusions'])if(!Array.isArray(p[key])||p[key].some(v=>!object(v)))fail(key,'Invalid '+key+' entries.');
    for(const a of p.availability){if(typeof a.exact!=='boolean'||!Array.isArray(a.days)||!a.days.length||a.days.some(d=>!Number.isInteger(d)||d<0||d>6)||!zone(a.tz)||!clock(a.s)||a.s==='24:00'||!a.exact&&(!clock(a.e)||minutes(a.s)>=minutes(a.e))||(a.from&&!date(a.from))||(a.to&&!date(a.to))||(a.from&&a.to&&a.from>a.to))fail('availability','Check the weekdays, timezone, dates and times in Available times.');}
    for(const t of p.travel){if(!date(t.from)||!date(t.to)||t.from>t.to||!zone(t.tz))fail('travel','Choose valid increasing travel dates and a destination timezone.');if(t.label!==undefined)text(t.label,'travel');}
    const trips=[...p.travel].sort((a,b)=>a.from.localeCompare(b.from));if(trips.some((t,i)=>i&&t.from<=trips[i-1].to))fail('travel','Travel date ranges overlap. Edit the dates so each day has one destination timezone.');
    for(const f of p.flights){if(!instant(f.departure)||!instant(f.arrival)||Date.parse(f.arrival)<=Date.parse(f.departure))fail('flights','Arrival must be after departure. Check both dates, times and timezones.');for(const key of ['departureZone','arrivalZone'])if(f[key]!==undefined&&!zone(f[key]))fail('flights','Choose valid flight timezones.');for(const key of ['label','departureLocation','arrivalLocation','id'])if(f[key]!==undefined)text(f[key],'flights');}
    for(const x of p.holidayExclusions)if(!date(x.from)||!date(x.to||x.from)||x.from>(x.to||x.from))fail('holidayExclusions','Choose valid increasing exception dates.');
    for(const key of ['calendarLabels','eventOverrides','eventRules','ruleTerms'])if(p[key]!==undefined&&(!object(p[key])||Object.values(p[key]).some(v=>typeof v!=='string')))fail(key,'Invalid '+key+' settings.');
    for(const value of Object.values(p.eventOverrides||{}))if(!['protected','soft','movable','leave','ignore','auto'].includes(value))fail('eventOverrides','Choose a supported event treatment.');
    for(const value of Object.values(p.eventRules||{})){if(value.length>10000)fail('eventRules','Event-matching text is too long.');try{new RegExp(value);}catch(_){fail('eventRules','Check the event-matching expression.');}}
    if(p.keywordCategories!==undefined&&(!Array.isArray(p.keywordCategories)||p.keywordCategories.some(key=>!['protect','soft','leave'].includes(key))))fail('eventRules','Invalid keyword categories.');
    if(p.keywordMatchingVersion!==undefined&&![0,1].includes(p.keywordMatchingVersion))fail('eventRules','Invalid keyword matching mode.');
    if(p.blockers!==undefined){if(!Array.isArray(p.blockers)||p.blockers.length>10000)fail('blockers','Invalid blockers.');for(const b of p.blockers)try{ProfileRules.validateBlocker(b);}catch(e){fail('blockers',e.message);}}
    if(p.eventTreatments!==undefined&&(!Array.isArray(p.eventTreatments)||p.eventTreatments.length>20000||p.eventTreatments.some(r=>!object(r)||!['occurrence','series'].includes(r.scope)||!['auto','ignore','protected','leave'].includes(r.value)||typeof r.key!=='string'||!r.key||typeof r.seriesKey!=='string')))fail('eventTreatments','Invalid meeting rules.');
    return p;
  }
  function emailEdit(existing,value,profiles,ownId){
    const entered=U.emailKey(value),prior=existing.email;
    const reason=existing.id===ownId&&entered!==U.emailKey(prior)?'Your profile email cannot be changed.':!U.validEmail(entered)?'The email address was invalid.':profiles.some(person=>person.id!==existing.id&&U.emailKey(person.email)===entered)?'That email belongs to another profile.':'';
    return reason?{email:prior,restored:true,message:reason+' Restored '+prior+' for '+(existing.name||prior)+'.'}:{email:entered,restored:false};
  }
  function localInstant(dateValue,timeValue,tz,previous){
    if(!date(dateValue)||!U.parseClock(timeValue)||!zone(tz))throw error('flight','Choose a date, time and timezone.');
    const time=U.parseClock(timeValue),base=E.zonedToInstant(dateValue,+time.slice(0,2)*60 + +time.slice(3),tz);
    const candidates=[];for(let offset=-180;offset<=180;offset+=15){const value=base+offset*60000;if(Number.isFinite(value)){const p=E.partsIn(value,tz);if(p.ymd===dateValue&&p.hh===+time.slice(0,2)&&p.mm===+time.slice(3)&&!candidates.includes(value))candidates.push(value);}}
    if(!candidates.length)throw error('flight','This local time does not exist because the clocks change. Choose another time.');
    if(candidates.length>1){if(previous&&candidates.includes(Date.parse(previous)))return {value:previous,candidates};return {value:null,candidates};}
    return {value:new Date(candidates[0]).toISOString(),candidates};
  }
  function flight(fields,previous={},uuid=()=>globalThis.crypto.randomUUID()){
    const result={id:previous.id||uuid(),label:fields.label||'',departureLocation:fields.departureLocation||'',arrivalLocation:fields.arrivalLocation||''};
    for(const side of ['departure','arrival']){const selected=fields[side+'Instant'],value=localInstant(fields[side+'Date'],fields[side+'Time'],fields[side+'Zone'],previous[side]);if(!value.value&&!value.candidates.includes(Date.parse(selected)))throw Object.assign(error(side,'Choose which occurrence of this clock time you mean.'),{candidates:value.candidates,side});result[side]=value.value||new Date(selected).toISOString();result[side+'Zone']=fields[side+'Zone'];if(fields[side+'ZoneLocation'])result[side+'ZoneLocation']=clone(fields[side+'ZoneLocation']);}
    if(Date.parse(result.arrival)<=Date.parse(result.departure))throw error('arrival','Arrival must be after departure. Check the local dates and timezones.');return result;
  }
  function returnFields(outbound){return {...(outbound.arrivalZoneLocation?{departureZoneLocation:outbound.arrivalZoneLocation}:{}),...(outbound.departureZoneLocation?{arrivalZoneLocation:outbound.departureZoneLocation}:{}),departureLocation:outbound.arrivalLocation||'',arrivalLocation:outbound.departureLocation||'',departureZone:outbound.arrivalZone||'',arrivalZone:outbound.departureZone||'',departureDate:'',arrivalDate:'',departureTime:'',arrivalTime:'',label:''};}
  function eventSettings(saved,entered,airport,defaults,baseTerms,compile){const prior=baseTerms||saved.ruleTerms||defaults,rules={...(saved.eventRules||{})};for(const key of ['protect','soft','leave'])if(entered[key]!== (prior[key]??defaults[key])||key==='protect'&&airport!==(saved.airportRule!==false)){rules[key]=compile(entered[key]);if(key==='protect'&&airport)rules[key]+='|\\b[A-Z]{3}\\s*>\\s*[A-Z]{3}\\b';}return {ruleTerms:entered,airportRule:airport,eventRules:rules};}
  function flightBatch(outbound,back,previous,uuid){const first=flight(outbound,previous,uuid),flights=[first];if(back){const second=flight(back,{},uuid);if(Date.parse(second.departure)<Date.parse(first.arrival))throw error('return','The return flight must depart after the outbound flight arrives.');flights.push(second);}return flights;}
  function flightWarnings(flights,existing,editingId){const warnings=[];for(const f of flights)for(const old of existing.filter(x=>!editingId||x.id!==editingId)){if(f.departure===old.departure&&f.arrival===old.arrival)warnings.push('A flight with these times is already saved.');else if(Date.parse(f.departure)<Date.parse(old.arrival)&&Date.parse(old.departure)<Date.parse(f.arrival))warnings.push('This flight overlaps another saved flight. Check the itinerary.');}return [...new Set(warnings)];}
  return {fields,zone,date,instant,checkProfile,emailEdit,localInstant,flight,returnFields,flightBatch,flightWarnings,eventSettings,clone};
});
