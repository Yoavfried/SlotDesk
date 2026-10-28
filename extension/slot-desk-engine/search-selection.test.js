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

// A manual schedule owns its next-workweek deadline, independently of the
// inactive template retained by the profile editor.
const sundayRange={from:'2026-11-01',to:'2026-11-01'},manualWeek=person({tz:'Asia/Jerusalem',workingMode:'manual',templateDays:'sun-thu',days:E.WEEK_MON_FRI(),manualDays:E.WEEK_MON_FRI()});
const deadlineFor=(p,range=sundayRange,anchorTz='Asia/Jerusalem')=>P.horizon({people:[p],range,anchorTz},E);
eq(new Date(deadlineFor(manualWeek)).toISOString(),'2026-11-06T22:00:00.000Z','manual Monday–Friday follows its actual next workweek');
eq(deadlineFor(manualWeek),deadlineFor({...manualWeek,templateDays:'mon-fri'}),'changing an inactive template cannot move a manual deadline');
const manualSun={...manualWeek,templateDays:'mon-fri',days:E.WEEK_SUN_THU(),manualDays:E.WEEK_SUN_THU()};
eq(new Date(deadlineFor(manualSun)).toISOString(),'2026-11-12T22:00:00.000Z','manual Sunday–Thursday includes the following Sunday–Thursday week');
eq(deadlineFor({...manualSun,workingMode:'template',templateDays:'sun-thu'}),deadlineFor(manualSun),'the selected template retains its reference week');
const splitWeek={...manualWeek,days:E.WEEK([2,4],'09:00','18:00')};
eq(new Date(deadlineFor(splitWeek)).toISOString(),'2026-11-05T22:00:00.000Z','a split manual week starts after its longest disabled-day break');
eq(deadlineFor({...manualWeek,ignoreWorkingHours:true}),deadlineFor(manualWeek),'ignored hours retain the active saved reference week');
let bounded=search({...manualWeek,busy:[event('Unavailable until the later week',iso('2026-10-01',0),iso('2026-11-09',0))]},{range:sundayRange,anchorTz:'Asia/Jerusalem'});
eq(bounded.options.length,0,'inactive templates cannot admit a clear fallback from the week after the deadline');

// A late arrival can change the timezone after the old noon probe. Resolve
// midnight against the actual timeline rather than the profile base zone.
const tripWeek=person({tz:'Asia/Jerusalem',templateDays:'sun-thu',days:E.WEEK_SUN_THU(),trips:[{id:'late-arrival',name:'Westbound',originZone:'Asia/Jerusalem',originLocation:'Jerusalem',flights:[{id:'leg',departure:'2026-11-05T08:00:00Z',arrival:'2026-11-05T18:00:00Z',departureZone:'Asia/Jerusalem',arrivalZone:'America/Los_Angeles'}]}]});
const octoberRange={from:'2026-10-27',to:'2026-10-27'};
eq(new Date(deadlineFor(tripWeek,octoberRange)).toISOString(),'2026-11-06T08:00:00.000Z','the deadline uses the destination timezone after a late arrival');
bounded=search({...tripWeek,availability:[{from:'2026-11-05',to:'2026-11-05',days:[4],s:'15:00',e:'15:45',tz:'America/Los_Angeles'}]},{range:octoberRange,anchorTz:'Asia/Jerusalem',duration:45});
eq(bounded.options[0]?.startISO,'2026-11-05T23:00:00.000Z','a valid late-Thursday destination opening remains within its workweek');
ok(bounded.options.every(slot=>slot.end<=bounded.deadline),'the entire fallback still ends before the resolved boundary');
const eastbound={...tripWeek,trips:[{...tripWeek.trips[0],flights:[{...tripWeek.trips[0].flights[0],arrivalZone:'Asia/Tokyo',arrival:'2026-11-05T16:00:00Z'}]}]};
eq(new Date(deadlineFor(eastbound,octoberRange)).toISOString(),'2026-11-05T16:00:00.000Z','an arrival that jumps past local week end is itself the boundary');
const restricted=person({tz:'UTC',days:E.WEEK_MON_FRI()});
eq(P.horizon({people:[tripWeek,restricted],range:octoberRange,anchorTz:'Asia/Jerusalem'},E),Math.min(deadlineFor(tripWeek,octoberRange),deadlineFor(restricted,octoberRange)),'the earliest required boundary wins');
eq(P.horizon({people:[tripWeek,{...restricted,required:false}],range:octoberRange,anchorTz:'Asia/Jerusalem'},E),deadlineFor(tripWeek,octoberRange),'optional travel/workweeks do not shrink the horizon');
const mixedTravel=person({templateDays:'sun-thu',days:E.WEEK_SUN_THU(),trips:[{id:'westward',name:'One way',originZone:'UTC',originLocation:'Origin',flights:[{id:'west-leg',departure:'2026-11-03T12:00:00Z',arrival:'2026-11-04T00:00:00Z',departureZone:'UTC',arrivalZone:'Etc/GMT+12'}]}],travel:[{from:'2026-11-05',to:'2026-11-07',tz:'Pacific/Kiritimati'}]});
eq(E.validate(request(mixedTravel,{range:octoberRange})).errors,[],'mixed legacy travel and modern one-way trips are valid');
eq(new Date(deadlineFor(mixedTravel,octoberRange,'UTC')).toISOString(),'2026-11-05T12:00:00.000Z','legacy travel dates follow the effective base zone after a one-way arrival');
bounded=search(mixedTravel,{range:octoberRange});ok(Number.isFinite(bounded.deadline),'valid mixed travel always supplies a finite calendar-read boundary');ok(bounded.options.length>0,'mixed travel does not stop an otherwise ordinary in-range search');
const changedBase={...mixedTravel,trips:[],tripTimezoneState:{baseZone:'UTC',history:[{kind:'manual',key:'manual-west',at:'2026-11-04T00:00:00Z',tz:'Etc/GMT+12'}]}};
eq(new Date(deadlineFor(changedBase,octoberRange,'UTC')).toISOString(),'2026-11-05T12:00:00.000Z','legacy travel also follows a saved manual base-zone change');

// Exactly three local time groups, with the earliest equally suitable start, not a margin at 10:00.
let r=search(person());eq(r.options.map(s=>s.anchorMinute),[540,720,840]);eq(r.options.length,3);
eq([0,719,720,839,840,1439].map(P.band),['morning','morning','midday','midday','afternoon','afternoon']);
r=search(person({days:allDays,ignoreConvenience:true}));eq(r.options.length,3,'evening/night do not create extra groups');
ok(r.allOptions.every(s=>s.anchorMinute%5===0),'start precision stays at five minutes or coarser');

// One good in-range option hides the compromises until Generate more uses allOptions.
const threeWindows=[9,12,14].map(h=>({days:[2],s:String(h).padStart(2,'0')+':00',exact:true,tz:'UTC'}));
r=search(person({availability:threeWindows,busy:[event('Noon',iso(day,12),iso(day,13)),event('Afternoon',iso(day,14),iso(day,15))]}));
eq(r.options.length,1);eq(r.options[0].anchorMinute,540);ok(r.allOptions.length>1);ok(!r.allOptions.some(s=>s.alternativeType.startsWith('extended')),'a good working-hours choice suppresses all later dates');
const morningOnly=person({busy:[event('Rest of working day',iso(day,9,45),iso(day,18))]});
r=search(morningOnly,{duration:45});
eq(r.options.map(slot=>slot.anchorMinute),[540],'the initial list keeps only the clear working-hours choice');
eq(r.allOptions[1].anchorMinute,1080,'Generate more keeps the best clear after-work choice ahead of conflicts');
eq(r.allOptions[1].requiredConflictCount,0);ok(r.allOptions[1].outsideWorkingHours);
eq(r.allOptions.filter(slot=>slot.outsideWorkingHours).length,1,'at most one clear outside-work choice is appended');
ok(!r.allOptions.some(slot=>slot.alternativeType.startsWith('extended')),'an appended outside-work choice never enables later dates');
ok(r.allOptions.slice(2).every(slot=>slot.requiredConflictCount>0),'remaining appended representatives are in-range compromises');
ok(r.allOptions.every((slot,i)=>r.allOptions.slice(0,i).every(other=>slot.start>=other.end||slot.end<=other.start)),'the appended clear choice never overlaps another suggestion');
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

// A clear in-range after-work choice stands alone initially and suppresses later dates.
const officeBusy=person({busy:[event('Office fully occupied',iso(day,9),iso(day,18))]});
r=search(officeBusy);eq(r.options.length,1);eq(r.options[0].alternativeType,'requested');eq(r.options[0].day,day);eq(r.options[0].anchorMinute,1080);
ok(r.options[0].outsideWorkingHours);ok(!r.options[0].requiredConflictCount);eq(r.options.filter(s=>s.day===day&&!s.requiredConflictCount).length,1);
eq(r.allOptions.slice(1).map(s=>P.band(s.anchorMinute)),['morning','midday','afternoon']);
ok(!r.allOptions.some(s=>s.alternativeType.startsWith('extended')),'an in-range clear after-work choice suppresses even clear later working hours');
eq(r.allOptions.slice(0,r.options.length),r.options,'the displayed initial choices are the prefix consumed by Generate more');

// The same initial behavior applies whether later office hours open or not.
const longOffice=person({busy:Array.from({length:20},(_,i)=>{const d=E.addDaysYmd(day,i);return event('Office '+i,iso(d,9),iso(d,18));})});
r=search(longOffice);eq(r.options.length,1);eq(r.options[0].day,day);ok(r.options[0].outsideWorkingHours);ok(!r.allOptions.some(s=>s.alternativeType.startsWith('extended')));

// Longer after-work ranges initially spread up to three dates; every remaining
// clear date representative remains ahead of conflicts in append-three batches.
const officeEachDay=Array.from({length:10},(_,i)=>{const d=E.addDaysYmd(day,i);return event('Office day '+i,iso(d,9),iso(d,18));});
const tenOffice=person({days:allDays,busy:officeEachDay});
r=search(tenOffice,{range:ten,duration:45});
eq(r.options.map(s=>s.day),[day,'2026-11-07','2026-11-12'],'initial dates use first, middle and last eligible dates');
ok(r.options.every(s=>s.anchorMinute===1080&&s.duration===45&&s.outsideWorkingHours&&!s.requiredConflictCount),'each initial date keeps its best full-length clear after-work time');
const tenClear=r.allOptions.filter(s=>s.outsideWorkingHours&&!s.requiredConflictCount),tenBad=r.allOptions.filter(s=>s.requiredConflictCount);
eq(tenClear.length,10);eq(new Set(tenClear.map(s=>s.day)).size,10,'at most one clear after-work option is retained per day');
eq(r.allOptions.slice(0,10),tenClear,'all remaining clear date representatives precede every compromise');
eq(tenBad.length,10,'Generate more can still reach one working-hours compromise per selected date');
eq(r.clearCount,10);eq(r.allOptions.slice(0,3),r.options);
ok(r.allOptions.every(s=>s.day>=ten.from&&s.day<=ten.to&&!s.alternativeType.startsWith('extended')),'append batches never broaden the dates when a clear in-range choice exists');
const batches=[];for(let n=r.options.length;n<r.allOptions.length;n+=3)batches.push(r.allOptions.slice(n,n+3));
ok(batches.every(batch=>batch.length<=3),'Generate more consumes at most three frozen representatives at a time');
eq(batches.flat(),r.allOptions.slice(3),'each retained option remains reachable without recomputing or repeating an option');
ok(r.allOptions.every((s,i)=>r.allOptions.slice(0,i).every(other=>s.start>=other.end||s.end<=other.start)),'clear spread and later compromise batches remain mutually non-overlapping');

// Two eligible dates produce two choices. Three produce three, one per day;
// normal working-hours choices retain their existing group-based initial list.
r=search(tenOffice,{range:{from:day,to:'2026-11-04'},duration:45});eq(r.options.map(s=>s.day),[day,'2026-11-04']);
r=search(tenOffice,{range:{from:day,to:'2026-11-05'},duration:45});eq(r.options.map(s=>s.day),[day,'2026-11-04','2026-11-05']);
r=search(person({busy:officeEachDay.map(ev=>({...ev,start:new Date(Date.parse(ev.start)+45*60000).toISOString()}))}),{range:{from:day,to:'2026-11-05'},duration:45});
eq(r.options.map(s=>[s.day,s.anchorMinute]),[[day,540],['2026-11-04',540],['2026-11-05',540]],'three clear working-hour mornings stay the initial choices');
eq(r.allOptions.filter(s=>s.outsideWorkingHours).map(s=>s.day),[day,'2026-11-04','2026-11-05'],'eligible after-work dates remain available after the normal initial list');
ok(r.allOptions.slice(0,3).every(s=>!s.outsideWorkingHours),'after-work choices never displace normal clear choices');

// Search-date distribution omits nonworking and explicitly protected dates;
// optional conflicts and unknown coverage do not make a required-person choice disappear.
const week={from:day,to:'2026-11-09'},leave={id:'Leave',calendarId:'work',title:'Leave',allDay:true,start:'2026-11-04',end:'2026-11-05',tz:'UTC',override:'leave'};
r=search(person({busy:[...officeEachDay,leave]}),{range:week,duration:45});
eq(r.options.map(s=>s.day),[day,'2026-11-05','2026-11-09'],'distribution uses eligible dates rather than the midpoint of the whole calendar range');
eq(r.allOptions.filter(s=>s.outsideWorkingHours).map(s=>s.day),[day,'2026-11-05','2026-11-09','2026-11-06'],'the remaining eligible Friday stays reachable before conflicts');
ok(!r.allOptions.some(s=>['2026-11-04','2026-11-07','2026-11-08'].includes(s.day)),'leave and nonworking dates never become overlap alternatives for this guest');
const optionalAfterwork=person({id:'optional-afterwork',email:'optional-afterwork@example.test',required:false,busy:[blocked]});
r=search([person({days:allDays,busy:officeEachDay,calendar:'none',coverages:[]}),optionalAfterwork],{range:ten,duration:45});
eq(r.options.map(s=>s.day),[day,'2026-11-07','2026-11-12']);
ok(r.options.every(s=>!s.requiredConflictCount&&s.people[0].confirmed===false&&s.people[1].required===false),'optional overlaps remain disclosed without excluding clear required-person after-work choices');
const protectedEvening={...event('Protected evening',iso('2026-11-04',18),iso('2026-11-04',20)),override:'protected'};
const blockMorning={...event('Protected morning',iso('2026-11-04',7),iso('2026-11-04',9)),override:'protected'};
r=search(person({days:allDays,busy:[...officeEachDay,protectedEvening,blockMorning]}),{range:{from:day,to:'2026-11-05'},duration:45});
eq(r.options.map(s=>s.day),[day,'2026-11-05'],'explicit protection removes the entire date from clear after-work choices when both outside-work windows are blocked');
ok(r.allOptions.every(s=>s.day!=='2026-11-04'||s.start>=instant('2026-11-04',9)&&s.end<=instant('2026-11-04',18)),'hidden compromise choices still respect every explicit block');

// Date diversity cannot move an early shortened meeting ahead of a later
// requested-duration choice. Fill three full choices before using shortening.
const noMorning=officeEachDay.map((ev,i)=>{const d=E.addDaysYmd(day,i);return {...event('Protected morning '+i,iso(d,7),iso(d,9)),override:'protected'};}),earlyShort={...event('Early evening closes',iso(day,18,30),iso(day,20)),override:'protected'},durationPriority=person({days:allDays,busy:[...officeEachDay,...noMorning,earlyShort]});
r=search(durationPriority,{range:{from:day,to:'2026-11-04'},duration:45});
eq(r.options.map(s=>[s.day,s.duration]),[['2026-11-04',45],[day,30]],'a later full-duration date precedes an earlier clear shortened date');
eq(r.allOptions.slice(0,r.options.length),r.options,'duration ordering preserves the initial pool prefix');
r=search(durationPriority,{range:{from:day,to:'2026-11-06'},duration:45});
eq(r.options.map(s=>[s.day,s.duration]),[['2026-11-04',45],['2026-11-05',45],['2026-11-06',45]],'three full-duration dates keep the early shortened date behind Generate more');
eq(r.allOptions[3].day,day);eq(r.allOptions[3].duration,30,'the shortened clear date remains before every overlapping alternative');
r=search(durationPriority,{range:ten,duration:45});
eq(r.options.map(s=>s.day),['2026-11-04','2026-11-08','2026-11-12'],'first/middle/last spreading occurs within the full-duration category');
ok(r.allOptions.slice(0,9).every(s=>s.duration===45&&!s.requiredConflictCount),'all remaining full-length clear dates precede the early shortened date');
eq([r.allOptions[9].day,r.allOptions[9].duration],[day,30]);

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
