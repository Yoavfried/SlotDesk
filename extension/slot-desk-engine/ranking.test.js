'use strict';
const assert=require('node:assert/strict'),E=require('./slotdesk-engine'),U=require('./workspace-model'),K=require('./scheduling-ranking'),F=require('./configuration-files'),M=require('./meeting-management');
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(v,m)=>{assert.ok(v,m);checks++;},copy=v=>JSON.parse(JSON.stringify(v));
const day='2026-10-27',now='2026-10-19T00:00:00Z',at=(h,m=0)=>E.zonedToInstant(day,h*60+m,'UTC'),iso=(h,m=0)=>new Date(at(h,m)).toISOString();
const person=(id,extra={})=>({...U.newProfile(id+'@example.test',id,'UTC'),tzConfirmed:true,calendar:'detail',busy:[],coverages:[{from:'2026-10-01T00:00:00Z',to:'2026-11-30T00:00:00Z',complete:true}],...extra});
const req=(people,extra={})=>({people,duration:30,range:{from:day,to:day},anchorTz:'UTC',spacingMode:'automatic',perDayMode:'automatic',step:10,want:3,minDuration:30,extendDays:0,now,...extra});
const event=(id,s,e,extra={})=>({id,calendarId:'work',title:'Meeting '+id,start:iso(s),end:iso(e),...extra});
const exact=(people,h,m=0,extra={})=>{const r=E.evaluate(req(people,extra),{exactStart:at(h,m),allowBadHours:extra.allowBadHours});return [...r.open,...r.taken][0];};
const rankPair=(a,b)=>[a,b].sort(K.compare)[0];

// Required guests' working hours before own permitted overlaps, with an unconfirmed guest.
const owner=person('own',{isOwnProfile:true,tz:'Asia/Jerusalem',days:U.schedule('sun-thu'),allowOverlap:true}),la=person('LA',{tz:'America/Los_Angeles',calendar:'none',coverages:[]});
const busyOwner={...owner,busy:[{id:'long',calendarId:'work',title:'Ordinary meeting',start:'2026-10-27T18:00:00+02:00',end:'2026-10-27T20:00:00+02:00'}]};
let result=E.findSlots(req([busyOwner,la],{anchorTz:'Asia/Jerusalem',duration:15,minDuration:15}));
eq(result.options[0].people.map(p=>p.local),['Tue 18:00','Tue 09:00']);ok(result.options[0].requiredConflictCount===1);eq(result.options[0].people[1].confirmed,false);eq(result.options[0].people[0].allowOverlap,true);
ok(result.options.every(s=>s.score.guestMax===0),'do not worsen required guest hours just to fill a different time band');
const noPermission=E.findSlots(req([{...busyOwner,allowOverlap:false},la],{anchorTz:'Asia/Jerusalem',duration:15,minDuration:15}));ok(!noPermission.options[0].requiredConflictCount,'without overlap permission an otherwise feasible clear time remains primary');

// Guests equally well served: clear after-work first, useful different-band overlap retained.
const own=person('own',{isOwnProfile:true,allowOverlap:true,busy:[event('morning',9,12)]}),guest=person('guest');
const within=exact([own,guest],10),after=exact([own,guest],18);
// Use an explicit longer guest window so both choices are equally suitable for that guest.
const longGuest={...guest,days:E.WEEK_MON_FRI('09:00','20:00')};
const clear=exact([own,longGuest],18),clash=exact([own,longGuest],10);eq(rankPair(clash,clear).start,clear.start,'avoid unnecessary own overlap before improving own office hours');
const onlyMorningAndEvening={...longGuest,availability:[{days:[2],s:'09:00',e:'11:00',tz:'UTC'},{days:[2],s:'18:00',e:'20:00',tz:'UTC'}]};
result=E.findSlots(req([own,onlyMorningAndEvening]));ok(!result.options[0].requiredConflictCount);ok(result.options.some(s=>s.requiredConflictCount&&s.score.ownUsual===0),'also retain an optimized useful working-hours overlap');

// Fairness is independent of guest order and optional guests never block.
const a=person('a',{days:E.WEEK_MON_FRI('09:00','12:00')}),b=person('b',{days:E.WEEK_MON_FRI('14:00','18:00')});
const forward=E.findSlots(req([a,b])),reverse=E.findSlots(req([b,a]));eq(forward.options.map(s=>s.start),reverse.options.map(s=>s.start));ok(forward.options.every(s=>s.score.guestMax<=30));
const optional=person('optional',{required:false,busy:[event('optional',7,20)]});result=E.findSlots(req([guest,optional]));ok(result.options.length>0);eq(result.options[0].people[1].available,false);eq(result.options[0].people[1].required,false);

// Five-minute refinement helps full optional attendance; no smaller unit ever generated.
const availability=[{days:[2],s:'10:00',e:'10:10',tz:'UTC'}];
const one=person('one',{availability}),opt=person('optional',{required:false,busy:[{...event('end',9,10),end:iso(10,5)}]});
result=E.findSlots(req([one,opt],{duration:5,minDuration:5}));eq(result.options[0].start,at(10,5));eq(result.options[0].optionalAttendance,1);
result=E.findSlots(req([one,{...opt,busy:[]}],{duration:5,minDuration:5}));eq(result.options[0].start,at(10),'coarse start wins when both avoid the same conflicts');
result=E.findSlots(req([one,{...opt,busy:[{...event('partial',9,11),end:iso(10,9)}]}],{duration:5,minDuration:5}));ok(result.options.every(s=>s.anchorMinute%10===0),'partially reducing an optional overlap does not justify finer suggestions');
const odd=person('odd',{availability:[{days:[2],s:'10:03',e:'10:08',tz:'UTC'}]});result=E.findSlots(req([odd],{duration:5,minDuration:5}));eq(result.options,[],'03 cannot be suggested even if it is the only exact gap');
eq(exact([odd],10,3,{duration:5,minDuration:5}).start,at(10,3),'deliberate exact-time review is separate from automatic suggestion precision');
const five=person('five',{availability:[{days:[2],s:'10:05',e:'10:10',tz:'UTC'}]});result=E.findSlots(req([five],{duration:5,minDuration:5}));eq(result.options[0].start,at(10,5));
for(const zone of ['UTC','Asia/Kathmandu','Pacific/Chatham','Asia/Jerusalem']){result=E.findSlots(req([person('world',{tz:zone,ignoreWorkingHours:true})],{anchorTz:zone}));ok(result.options.every(s=>E.partsIn(s.start,zone).min%5===0));}

// Real gaps with event seconds are never rounded into a meeting.
const narrow=person('narrow',{availability:[{days:[2],s:'10:00',e:'10:30',tz:'UTC'}],busy:[{...event('seconds',9,10),end:new Date(at(10,4)+30000).toISOString()}]});
result=E.findSlots(req([narrow],{duration:25,minDuration:25}));eq(result.options[0].start,at(10,5));ok(!result.options[0].requiredConflictCount);

// Explicit inconvenience outranks usual working hours; ignore-convenience cannot erase it.
const flightOwn=person('own',{isOwnProfile:true,flights:[{departure:iso(12),arrival:iso(14),label:'Flight'}]}),morningGuest=person('g',{days:E.WEEK_MON_FRI('10:00','18:00')});
const buffer=exact([flightOwn,morningGuest],10),beforeBuffer=exact([flightOwn,morningGuest],9,30);eq(rankPair(buffer,beforeBuffer).start,beforeBuffer.start);
const manual=person('own',{isOwnProfile:true,inconvenience:[{from:iso(10),to:iso(11),label:'School run'}],ignoreConvenience:true});eq(exact([manual,guest],10).score.explicitMax,30);eq(exact([manual,guest],10).score.ownUsual,0);
const radius=person('own',{isOwnProfile:true,allowOverlap:true,radius:{minutes:15,mode:'blocked'},busy:[event('previous',9,10)]});eq(exact([radius,guest],10),undefined,'ordinary overlap permission cannot erase a blocked halo');
const softRadius={...radius,radius:{minutes:15,mode:'inconvenient'}};eq(exact([softRadius,guest],10).people[0].calendarConflictCount,0,'a radius is not an overlapping meeting');eq(exact([softRadius,guest],10).people[0].timing[0].kind,'meeting-radius');

// Outside-hours permission remains independent from work/convenience flags.
for(const ignoreConvenience of [false,true]){const p=person('late',{ignoreWorkingHours:true,ignoreConvenience});eq(exact([p],23),undefined);ok(exact([p],23,0,{allowBadHours:true}).outsideHours);}
const explicitLate=person('late',{availability:[{days:[2],s:'23:00',e:'23:30',tz:'UTC'}]});ok(exact([explicitLate],23));
const sunday='2026-11-01',sundayReq=req([person('weekday')],{range:{from:sunday,to:sunday}});eq(E.findSlots(sundayReq).options.length,0);ok(E.findSlots({...sundayReq,people:[person('weekday',{ignoreWorkingHours:true})]}).options.length>0);

// Actual source/type and EA protection take precedence over title guesses.
for(const title of ['Doctor','Personal','Flight to somewhere']){
  const e=event('inferred',10,11,{title}),p=person('own',{isOwnProfile:true,allowOverlap:true,busy:[e]});ok(exact([p],10).overrides.some(c=>c.category==='own-inferred'));
  eq(exact([{...p,isOwnProfile:false}],10),undefined);eq(exact([{...p,eventOverrides:{inferred:'protected'}}],10),undefined);
}
const holiday={id:'holiday',calendarId:'work',title:'Holiday',type:'leave',allDay:true,start:day,end:'2026-10-28',tz:'UTC'};
const mixed=exact([person('own',{isOwnProfile:true,allowOverlap:true,busy:[holiday,event('meeting',10,11)]})],10);
eq(mixed.requiredConflictCount,2);eq(mixed.rescheduleCount,1);eq(U.participantFit(mixed.people[0]).label,'1 meeting overlap · Day off');eq(M.collisionTargets(mixed).map(t=>t.eventId),['meeting']);
const warnings=U.proposalWarnings(mixed);ok(warnings.some(w=>w.title.endsWith('Day off')));ok(warnings.some(w=>w.detail.includes('Tue, 27 Oct, 10:00 - 11:00')));ok(!warnings.some(w=>w.detail.includes('2 overlapping meetings')));
eq(exact([person('own',{isOwnProfile:true,allowOverlap:true,busy:[holiday],eventOverrides:{holiday:'leave'}})],10),undefined);
eq(exact([person('own',{isOwnProfile:true,allowOverlap:true,flights:[{departure:iso(10),arrival:iso(11)}]})],10),undefined);

// Requested duration/dates first; later and shorter cards retain their actual change.
const busy=person('busy',{busy:[event('day',7,20)]});result=E.findSlots(req([busy],{extendDays:1,minDuration:15}));eq(result.options[0].alternativeType,'requested');eq(result.options[0].duration,30);eq(result.clearCount,0);
const shortGap=person('gap',{busy:[event('first',7,10),{...event('last',10,20),start:iso(10,20)}]});result=E.findSlots(req([shortGap],{minDuration:15,extendDays:1}));ok(result.options[0].alternativeType==='requested');ok(result.fallback.groups.some(g=>g.id==='shorter'));

// Earliest dates and one representative per time band; explicit Advanced limits win.
result=E.findSlots(req([guest],{range:{from:day,to:'2026-10-29'},want:5}));eq(result.options.slice(0,3).map(s=>s.day),[day,day,day]);eq(new Set(result.options.slice(0,3).map(s=>K.band(s.anchorMinute))).size,3);ok(result.options[3].day>day);
const evenings=person('evening',{availability:[{days:[2,3,4],s:'18:00',e:'20:00',tz:'UTC'}]});result=E.findSlots(req([evenings],{range:{from:day,to:'2026-10-29'}}));eq(result.options.map(s=>s.day),[day,'2026-10-28','2026-10-29']);
result=E.findSlots(req([guest],{range:{from:day,to:'2026-10-29'},perDayMode:'custom',perDay:1}));eq(new Set(result.options.map(s=>s.day)).size,3);
result=E.findSlots(req([guest],{spacingMode:'custom',step:30}));ok(result.options.every(s=>s.anchorMinute%30===0));
result=E.findSlots(req([guest],{spacingMode:'custom',step:15}));ok(result.options.every(s=>s.anchorMinute%15===0));ok(E.findSlots(req([guest],{spacingMode:'custom',step:7})).errors.length>0);
const migrated=U.migrate({profiles:[person('guest')],constraints:[],settings:{step:30,perDay:1}},'guest@example.test');eq(migrated.settings.spacingMode,'automatic');eq(migrated.settings.perDayMode,'automatic');eq(migrated.settings.step,30,'old value retained for a deliberate custom selection');
eq(F.validateSettings({spacingMode:'custom',step:15,perDayMode:'custom',perDay:2}),{step:15,spacingMode:'custom',perDay:2,perDayMode:'custom'});
assert.throws(()=>F.validateSettings({spacingMode:'custom',step:7}),/multiples of 5/);checks++;

// Search and warning construction never mutate profiles or source events.
const input=req([busyOwner,la],{anchorTz:'Asia/Jerusalem',range:{from:day,to:'2026-10-29'},allowBadHours:true}),before=JSON.stringify(input);result=E.findSlots(input);result.options.forEach(s=>U.proposalWarnings(s));eq(JSON.stringify(input),before);ok(result.options.every(s=>s.anchorMinute%5===0));
const shared=event('shared',10,11,{identity:'same'}),sharedSlot=exact([person('a',{busy:[shared]}),person('b',{busy:[{...shared,id:'other-copy'}]})],10);eq(sharedSlot.requiredConflictCount,1);eq(sharedSlot.peopleHit,2);
const redacted=exact([person('hidden',{busy:[event('private',10,11,{detailsVisible:false,title:'Never display this'})]})],10);ok(!U.proposalWarnings(redacted).some(w=>w.detail.includes('Never display this')));
console.log(checks+' ranking and 0.9.4 policy checks passed; synthetic data, no calendar writes.');
