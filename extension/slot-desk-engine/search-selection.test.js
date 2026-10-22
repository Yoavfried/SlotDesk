'use strict';
const assert=require('node:assert/strict'),E=require('./slotdesk-engine'),U=require('./workspace-model'),P=require('./search-policy');
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(v,m)=>{assert.ok(v,m);checks++;};
const day='2026-11-03',instant=(d,h,m=0,zone='UTC')=>E.zonedToInstant(d,h*60+m,zone),iso=(d,h,m=0,zone='UTC')=>new Date(instant(d,h,m,zone)).toISOString();
const allDays=Object.fromEntries(Array.from({length:7},(_,d)=>[d,{on:true,s:'09:00',e:'18:00'}]));
const person=(extra={})=>({...U.newProfile('person@example.test','Person','UTC'),calendar:'detail',coverages:[{from:'2026-10-01T00:00:00Z',to:'2026-12-01T00:00:00Z',complete:true}],busy:[],...extra});
const event=(id,from,to)=>({id,calendarId:'work',title:id,start:from,end:to});
const request=(p,extra={})=>({automaticAlternatives:true,people:Array.isArray(p)?p:[p],duration:15,range:{from:day,to:day},anchorTz:'UTC',now:'2026-10-22T00:00:00Z',...extra});
const search=(p,extra)=>E.findSlots(request(p,extra));
const blocked=event('Occupied',iso('2026-10-01',0),iso('2026-12-01',0));

// Exactly three local time groups, with the earliest equally suitable start, not a margin at 10:00.
let r=search(person());eq(r.options.map(s=>s.anchorMinute),[540,720,840]);eq(r.options.length,3);
eq([0,719,720,839,840,1439].map(P.band),['morning','morning','midday','midday','afternoon','afternoon']);
r=search(person({days:allDays,ignoreConvenience:true}));eq(r.options.length,3,'evening/night do not create extra groups');
ok(r.allOptions.every(s=>s.anchorMinute%5===0),'start precision stays at five minutes or coarser');

// One good in-range option hides the compromises until Generate more uses allOptions.
const threeWindows=[9,12,14].map(h=>({days:[2],s:String(h).padStart(2,'0')+':00',exact:true,tz:'UTC'}));
r=search(person({availability:threeWindows,busy:[event('Noon',iso(day,12),iso(day,13)),event('Afternoon',iso(day,14),iso(day,15))]}));
eq(r.options.length,1);eq(r.options[0].anchorMinute,540);ok(r.allOptions.length>1);ok(!r.allOptions.some(s=>s.alternativeType.startsWith('extended')),'a good working-hours choice suppresses all later dates');
const shortAndFull=person({availability:[{days:[2],s:'09:00',e:'09:30',tz:'UTC'},{days:[2],s:'14:00',e:'15:00',tz:'UTC'}]});
r=search(shortAndFull,{duration:45});eq(r.options.map(s=>s.duration),[45,30],'requested duration still precedes a clear shorter alternative in another group');

// A short range can use three groups each day; a longer range gets one representative per date.
r=search(person(),{range:{from:day,to:'2026-11-05'}});eq(r.allOptions.length,9);eq(r.options.length,5);
const ten={from:day,to:'2026-11-12'};
r=search(person({days:allDays}),{range:ten});eq(r.allOptions.length,10);eq(new Set(r.allOptions.map(s=>s.day)).size,10);ok(r.allOptions.every(s=>s.anchorMinute===540));
r=search(person({days:allDays,busy:[blocked]}),{range:ten});eq(r.options.length,3);eq(r.options.map(s=>s.day),['2026-11-03','2026-11-04','2026-11-05']);eq(r.allOptions.length,10,'more choices eventually reaches every eligible date');
r=search(person({busy:[blocked]}));eq(r.options.map(s=>s.anchorMinute),[540,720,840]);eq(r.allOptions.length,3,'no fourth evening compromise');

// One clear later choice comes first, followed by three nearby in-range compromises.
r=search(person({days:allDays,busy:[event('Busy until later',iso(day,0),iso('2026-11-13',0))]}),{range:ten});
eq(r.options.length,4);eq(r.options[0].day,'2026-11-13');eq(r.options[0].anchorMinute,540);eq(r.allOptions.filter(s=>s.alternativeType.startsWith('extended')).length,1);
eq(r.options.slice(1).map(s=>s.day),['2026-11-03','2026-11-04','2026-11-05']);

// Two distinct featured clear choices are permitted: later working hours and in-range after work.
const officeBusy=person({busy:[event('Office fully occupied',iso(day,9),iso(day,18))]});
r=search(officeBusy);eq(r.options.length,5);eq(r.options[0].alternativeType,'extended');eq(r.options[0].day,'2026-11-04');eq(r.options[0].anchorMinute,540);
eq(r.options[1].day,day);ok(r.options[1].outsideWorkingHours);ok(!r.options[1].requiredConflictCount);eq(r.options.filter(s=>s.day===day&&!s.requiredConflictCount).length,1);
eq(r.options.slice(2).map(s=>P.band(s.anchorMinute)),['morning','midday','afternoon']);

// When later office hours never open, keep only the in-range outside-work choice; no combined extra.
const longOffice=person({busy:Array.from({length:20},(_,i)=>{const d=E.addDaysYmd(day,i);return event('Office '+i,iso(d,9),iso(d,18));})});
r=search(longOffice);eq(r.options.length,4);eq(r.options[0].day,day);ok(r.options[0].outsideWorkingHours);ok(!r.allOptions.some(s=>s.alternativeType.startsWith('extended')));

// Combined later/outside-work is used only if both independent featured choices are absent.
const combined={...longOffice,busy:[...longOffice.busy,event('Whole requested day',iso(day,0),iso('2026-11-04',0))]};
r=search(combined);eq(r.options.length,4);eq(r.options[0].day,'2026-11-04');ok(r.options[0].outsideWorkingHours);eq(r.allOptions.filter(s=>s.alternativeType.startsWith('extended')).length,1);

// Sunday is a real Jerusalem workday. Monday wins only when Sunday is actually busy.
const zone='Asia/Jerusalem',il=person({tz:zone,templateDays:'sun-thu',days:U.schedule('sun-thu'),busy:[event('Until Sunday',iso(day,0,0,zone),iso('2026-11-08',9,0,zone))]});
r=search(il,{anchorTz:zone});eq(r.options[0].day,'2026-11-08');eq(r.options[0].anchorMinute,540);
r=search({...il,busy:[event('Through Sunday',iso(day,0,0,zone),iso('2026-11-09',0,0,zone))]},{anchorTz:zone});eq(r.options[0].day,'2026-11-09');eq(r.options[0].anchorMinute,540);
ok(r.allOptions.filter(s=>s.alternativeType.startsWith('extended')).every(s=>s.end<=r.deadline));

// Optional busy guests and unknown coverage do not change required-person feasibility.
const optional=person({id:'optional',email:'optional@example.test',required:false,busy:[blocked]});
r=search([person({calendar:'none',coverages:[]}),optional]);eq(r.options[0].day,day);eq(r.options[0].people[0].confirmed,false);eq(r.options[0].people[1].required,false);ok(!r.allOptions.some(s=>s.alternativeType.startsWith('extended')));

// A saved Ignore working hours setting removes the separate outside-work category.
r=search({...officeBusy,ignoreWorkingHours:true});ok(r.options.every(s=>!s.outsideWorkingHours));ok(!r.allOptions.some(s=>s.alternativeType.startsWith('extended')));

// Hard exclusions, flights and the five-minute floor remain in force in every category.
const exclusions=[{who:'all',kind:'blocked',from:iso(day,6),to:iso(day,10)}];
r=search(person({busy:[blocked]}),{constraints:exclusions});eq(r.options[0].anchorMinute,600);
const flight=person({flights:[{id:'f',departure:iso(day,9),arrival:iso(day,12)}]});r=search(flight);ok(r.allOptions.every(s=>s.day!==day||s.end<=instant(day,9)||s.start>=instant(day,12)));
for(const list of [search(officeBusy).allOptions,search(combined).allOptions,search(person({days:allDays,busy:[blocked]}),{range:ten}).allOptions]){
  ok(list.every(s=>s.anchorMinute%5===0));
  ok(list.every((s,i)=>list.slice(0,i).every(other=>s.start>=other.end||s.end<=other.start)),'every batch remains mutually non-overlapping');
}
console.log(checks+' search selection and fallback checks passed');
