const assert=require('node:assert/strict'),E=require('./slotdesk-engine'),G=require('./google-adapter'),{createReader}=require('./google-reader');
let assertions=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);assertions++;},ok=(v,m)=>{assert.ok(v,m);assertions++;};
const D='2026-10-20',at=(h,m=0)=>E.zonedToInstant(D,h*60+m,'UTC'),iso=(h,m=0)=>new Date(at(h,m)).toISOString();
const profile=(id='a',extra={})=>({id,name:id,tz:'UTC',calendar:'detail',busy:[],days:E.WEEK_MON_FRI(),coverage:{from:'2026-10-01T00:00:00Z',to:'2026-11-10T00:00:00Z',complete:true},...extra});
const request=(people=[profile()],extra={})=>({people,now:'2026-10-19T00:00:00Z',duration:30,anchorTz:'UTC',range:{from:D,to:D},extendDays:0,...extra});
const event=(extra={})=>({id:'event',start:iso(12),end:iso(13),title:'Planning',attendees:2,...extra});
const candidate=(r,h,m=0)=>r.open.find(s=>s.start===at(h,m));

// Four originally reproduced defects, including private-but-readable and truly untitled events.
const c={who:'optional',from:iso(9),to:iso(18),label:'Their block'};
let r=E.evaluate(request([profile(),profile('optional',{required:false})],{constraints:[c]}));
ok(candidate(r,12),'Optional scoped block does not reject required attendees');
ok(candidate(r,12).notes.some(n=>n.includes('Their block')),'Optional constraint has an attendance reason');
r=E.evaluate(request([profile()],{constraints:[c]}));ok(candidate(r,12),'Removing participant removes constraint effect');eq(r.warnings.length,1,'Absent target is surfaced explicitly');
r=E.evaluate(request([profile()],{constraints:[{...c,who:'a'}]}));ok(!candidate(r,12),'Required scoped block is enforced');
eq(E.fitPerson(profile(),at(17,55),at(18,15),0).outside,15,'Partial boundary minutes are exact');
eq(E.fitPerson(profile('x',{days:E.WEEK_MON_FRI('09:07','18:03')}),at(9),at(9,20),0).outside,7,'Arbitrary work boundaries count correctly');
const raw=(extra={})=>({id:'raw',summary:'Review',start:{dateTime:iso(12)},end:{dateTime:iso(13)},...extra});
let normalized=G.fromGoogle({items:[raw({status:'tentative'})]},'a@example.test');eq(normalized.busy[0].status,'tentative','Event tentative without attendees retained');eq(E.classify(normalized.busy[0],profile()).cost,1,'Tentative cost');
normalized=G.fromGoogle({items:[raw({visibility:'private',summary:undefined})]},'a@example.test'); // explicit undefined is still a field; simulate absent summary separately
const hidden=raw({visibility:'private'});delete hidden.summary;
normalized=G.fromGoogle({items:[hidden,raw({id:'visible',visibility:'private'}),raw({id:'untitled',summary:''})]},'a@example.test');
eq(E.classify(normalized.busy[0],profile()).cost,4,'Hidden event treated as ask first');eq(normalized.busy[1].detailsVisible,true,'Readable private event stays detailed');eq(normalized.busy[2].detailsVisible,true,'Untitled is not assumed hidden');

// Positive availability: recurring exact starts off the grid and outside normal hours; full windows.
const available=profile('a',{availability:[{days:[2,3],s:'06:17',exact:true,tz:'UTC'}]});
r=E.evaluate(request([available]));eq(r.open.map(s=>s.start),[at(6,17)],'Exact stated start is added off grid and overrides hour limits');
eq(r.open[0].maxOutside,0,'Requested positive availability is preferred availability');
r=E.evaluate(request([available],{constraints:[{who:'a',from:iso(6),to:iso(7)}]}));eq(r.open.length,0,'Positive availability does not bypass protected constraints');
r=E.evaluate(request([profile('a',{availability:[{days:[2],s:'10:00',e:'11:00',tz:'UTC'}]})]));eq(r.open.length,2,'Whole meeting must fit stated window');
r=E.evaluate(request([profile('a',{availability:[{from:'2026-10-21',to:'2026-10-21',s:'10:00',exact:true}]})]));eq(r.open.length,0,'One-off availability dates enforced');

// Optional attendance breaks equal comfort ties, never outranks required comfort.
r=E.evaluate(request([profile(),profile('optional',{required:false,availability:[{days:[2],s:'14:00',exact:true}]})]));eq(r.open[0].start,at(14),'Optional attendance breaks comfortable ties');
r=E.evaluate(request([profile(),profile('optional',{required:false,availability:[{days:[2],s:'07:00',exact:true}]})]));ok(r.open[0].maxOutside===0,'Required comfort outranks optional attendance');
const a=profile('a',{availability:[{days:[2],s:'09:00',exact:true},{days:[2],s:'10:00',exact:true}],inconvenience:[{from:iso(9),to:iso(9,20)},{from:iso(10),to:iso(10,15)}]});
const b=profile('b',{availability:a.availability,inconvenience:[{from:iso(10),to:iso(10,15)}]});
r=E.evaluate(request([a,b]));eq(r.open[0].start,at(10),'Worst required individual precedes total inconvenience');eq(r.open[0].sumOutside,30,'Fairer slot may have greater total inconvenience');

// Zero defaults, configurable radii and minimum notice.
eq(E.DEFAULTS.radius,0,'Zero default radius');eq(E.DEFAULTS.notice,0,'Zero default notice');
r=E.evaluate(request([profile('a',{busy:[event()]})]));ok(candidate(r,13),'Adjacent meeting allowed by default');
r=E.evaluate(request([profile('a',{busy:[event()],radius:{minutes:15,mode:'blocked'}})]));ok(!candidate(r,13),'Blocked radius enforced');
r=E.evaluate(request([profile('a',{busy:[event()],radius:{minutes:15,mode:'inconvenient'}})]));eq(candidate(r,13).maxOutside,15,'Soft radius inconveniences without rejecting');
eq(E.fitPerson(profile('a',{notice:24}),at(9),at(9,30),at(8)).band,'no','Configured notice enforced');
eq(E.fitPerson(profile(),at(9),at(9,30),at(8)).band,'ok','No default notice');

// Opt-in bad hours does not relax weekdays or protected events.
r=E.findSlots(request());eq(r.lastResort,null,'Bad hours require explicit opt-in');
r=E.findSlots(request(undefined,{allowBadHours:true}));ok(r.lastResort.open.length>0,'Enabled last resort shows additional hours');ok(r.open.every(s=>s.people.every(p=>p.band!=='bad')),'Normal proposals stay separate');
r=E.evaluate(request([profile('a',{busy:[event({start:iso(3),end:iso(4),title:'Flight'})]})]),{allowBadHours:true});ok(![...r.open,...r.taken].some(s=>s.start===at(3)),'Bad-hour opt-in does not bypass protected event');
r=E.evaluate(request([profile()],{range:{from:'2026-10-24',to:'2026-10-24'}}),{allowBadHours:true});eq(r.open.length,0,'Bad-hour opt-in does not bypass working days');

// Travel, advanced flight windows and merged inconvenience minutes.
const trip=profile('a',{travel:[{from:D,to:D,tz:'Asia/Tokyo'}]});eq(E.tzFor(trip,at(12)).tz,'Asia/Tokyo','Whole-day travel zone');eq(E.tzFor(trip,at(0)-1).tz,'UTC','Inclusive home-date travel boundary');
const flying=profile('a',{flights:[{departure:iso(16),arrival:iso(17)}]});eq(E.fitPerson(flying,at(14,30),at(15),0).outside,30,'Flight endpoint radius is soft inconvenience');eq(E.fitPerson(flying,at(17,45),at(18,15),0).outside,30,'Overlapping flight and hour inconvenience count once');eq(E.classify(E.conflictsFor(flying,at(16),at(16,30))[0],flying).cost,Infinity,'Flight interval itself stays protected');
ok(Number.isNaN(E.zonedToInstant('2026-03-08',150,'America/New_York')),'Missing DST wall time rejected');eq(new Date(E.zonedToInstant('2026-11-01',90,'America/New_York')).toISOString(),'2026-11-01T05:30:00.000Z','Repeated DST time chooses earlier occurrence');

// Date-only leave uses source timezone and bounded per-person exclusions.
const leave={id:'leave',start:D,end:'2026-10-23',allDay:true,tz:'Asia/Tokyo',type:'leave',title:'Holiday'};
const tokyo=profile('a',{tz:'Asia/Tokyo',busy:[leave]});const morning=E.zonedToInstant(D,480,'Asia/Tokyo');
eq(E.conflictsFor(tokyo,morning,morning+30*60000).length,1,'No UTC morning leak in all-day leave');
const exempt={...tokyo,holidayExclusions:[{from:'2026-10-21',to:'2026-10-21'}]};const middle=E.zonedToInstant('2026-10-21',480,'Asia/Tokyo');eq(E.conflictsFor(exempt,middle,middle+30*60000).length,0,'Single date removed from multi-day leave');eq(E.conflictsFor(exempt,morning,morning+30*60000).length,1,'Other leave dates stay protected');
exempt.busy.push({id:'busy',start:new Date(middle).toISOString(),end:new Date(middle+60000*60).toISOString(),title:'Doctor'});eq(E.conflictsFor(exempt,middle,middle+30*60000).length,1,'Holiday exception does not ignore other events');
normalized=G.fromGoogle({timeZone:'Asia/Tokyo',items:[{id:'h',summary:'Holiday',start:{date:D},end:{date:'2026-10-21'}},{id:'n',summary:'In Tokyo',start:{date:D},end:{date:'2026-10-21'}}]},'a@example.test');eq(normalized.busy.length,1,'Identified holiday blocks');eq(normalized.markers.length,1,'Ambiguous location remains a reviewable note');

// Full EA control, shared identities and only newly introduced clashes.
eq(E.classify(event({title:'Flight'}),profile('a',{eventOverrides:{event:'movable'}})).cost,3,'EA can override a default protected category');eq(E.classify(event({title:'Flight'}),profile('a',{eventRules:{protect:'(?!)',soft:'(?!)'}})).cost,3,'EA can replace all title rules');
eq(E.classify(event({title:'TLV > JFK'}),profile()).cost,Infinity,'Airport routes in starter rules');
eq(E.classify(event({title:'Tentative customer meeting',status:'tentative',external:true}),profile()).cost,6,'External attendees retain high cost unless EA explicitly overrides classification');
const shared=event({identity:'uid|instance',recurring:true});r=E.evaluate(request([profile('a',{busy:[shared]}),profile('b',{busy:[{...shared,id:'copy'}]})]));const taken=r.taken.find(s=>s.start===at(12));eq(taken.cost,2,'Shared meeting counts once');eq(taken.overrides.length,1,'One override warning per shared meeting');eq(taken.peopleHit,2,'Affected participants tracked separately');ok(taken.notes.some(n=>n.startsWith('Warning:')),'New conflict warning explicit');
r=E.evaluate(request([profile('a',{busy:[event(),event({id:'old-overlap',start:iso(12,15),end:iso(13,15)})]})]));ok(candidate(r,14),'Pre-existing overlap does not penalize unrelated new slots');
const text=E.proposalText(taken);ok(text.includes('2026-10-20 12:00')&&text.includes('UTC'),'Copied proposals retain dates and zones');ok(text.includes('New conflict')&&text.includes('replacement'),'Copied overrides retain warning and rescheduling action');

// Coverage and validation never turn missing data into confirmed freedom.
r=E.evaluate(request([profile('a',{calendar:'none'})]));eq(r.open[0].confirmed,false,'Unavailable calendar unconfirmed');
r=E.evaluate(request([profile('a',{coverage:{from:iso(9),to:iso(10),complete:true}})]));eq(candidate(r,12).confirmed,false,'Uncovered range unconfirmed');
r=E.evaluate(request([profile('a',{coverage:{from:iso(0),to:'2026-10-21T00:00:00Z',complete:true,fetchedAt:'2026-10-18T00:00:00Z'}})]));eq(r.open[0].confirmed,false,'Stale calendar unconfirmed');
eq(E.evaluate(request()).open[0].confirmed,true,'Complete coverage confirmed');ok(E.findSlots(request(undefined,{duration:0})).errors.length,'Invalid duration surfaces validation');ok(E.findSlots(request(undefined,{step:0})).errors.length,'Invalid grid cannot loop');ok(E.findSlots(request([profile('a',{tz:'Eastern'})])).errors.length,'Ambiguous timezone rejected');ok(E.findSlots(request([profile('a',{travel:[{from:D,to:'2026-10-22',tz:'UTC'},{from:'2026-10-21',to:'2026-10-23',tz:'UTC'}]})])).errors.length,'Overlapping travel is explicit error');
const full=profile('a',{busy:[event({start:iso(7),end:iso(20),title:'Hold: planning'})]});r=E.findSlots(request([full],{extendDays:2,duration:45}));eq(r.fallback.groups.map(g=>g.id),['extended','occupied'],'Only alternatives with useful results are shown');

// REST and MCP shapes, enum/status handling, shared recurring-instance identity.
normalized=G.fromGoogle({events:[raw({eventType:'FOCUS_TIME'}),raw({id:'ooo',eventType:'OUT_OF_OFFICE'})]},'a@example.test');eq(normalized.busy.map(e=>e.type),['focus','leave'],'MCP enum compatibility');
normalized=G.fromGoogle({items:[raw({eventType:'focusTime'}),raw({id:'ooo',eventType:'outOfOffice'}),raw({id:'cancel',status:'cancelled'}),raw({id:'decline',attendees:[{email:'a@example.test',self:true,responseStatus:'declined'}]})]},'a@example.test');eq(normalized.busy.map(e=>e.type),['focus','leave'],'REST enums and excluded invitations');
const recurring=raw({iCalUID:'shared@uid',recurringEventId:'series',originalStartTime:{dateTime:'2026-10-20T15:00:00+03:00'}}),copy=raw({id:'copy',iCalUID:'shared@uid',recurringEventId:'series',originalStartTime:{dateTime:iso(12)}});
eq(G.fromGoogle({items:[recurring]},'a').busy[0].identity,G.fromGoogle({items:[copy]},'b').busy[0].identity,'Identity normalizes equivalent offsets');
ok(!G.fromGoogle({items:[raw({start:{dateTime:'2026-10-20T12:00:00'},end:{dateTime:'2026-10-20T13:00:00'}})]},'a').complete,'Unresolved local datetime prevents confirmed coverage');
eq(G.profileFromCalendar({id:'cal',summary:'Exec',timeZone:'UTC'}).tzConfirmed,false,'Auto profile timezone requires confirmation');eq(G.timezoneSuggestions('US Eastern')[0].tz,'America/New_York','Deterministic region clue');eq(G.timezoneSuggestions('someone@example.com').length,0,'No timezone inference from email domain');
ok(E.findSlots(request(undefined,{people:{}})).errors.length,'Malformed participant list gives validation instead of crashing');
eq(E.partsIn(E.startOfDay('2026-03-29','Asia/Beirut'),'Asia/Beirut').ymd,'2026-03-29','Midnight DST gap resolves to first real local minute');
normalized=G.fromGoogle({timeZone:'UTC',items:[{id:'fyi',summary:'FYI',transparency:'transparent',start:{date:D},end:{date:'2026-10-21'}}]},'a',{eventOverrides:{fyi:'protected'}});eq(normalized.busy.length,1,'EA can protect a normally free all-day marker');
normalized=G.fromGoogle({timeZone:'UTC',items:[{id:'location',eventType:'workingLocation',summary:'In New York',start:{date:D},end:{date:'2026-10-21'}}]},'a');eq(normalized.clues[0].date,D,'Working location retains a dated confirmable clue');eq(normalized.busy.length,0,'A clue never silently becomes blocking travel');

(async()=>{
  const response=(data,status=200)=>({ok:status===200,status,json:async()=>data}),calls=[];
  const reader=createReader({getToken:async()=>'synthetic-test-token',fetchImpl:async(url,options)=>{calls.push({url,options});if(url.includes('calendarList'))return response(url.includes('pageToken=next')?{items:[{id:'b'}]}:{items:[{id:'a'}],nextPageToken:'next'});return response(url.includes('pageToken=next')?{timeZone:'UTC',items:[raw({id:'second'})]}:{timeZone:'UTC',items:[raw()],nextPageToken:'next'});}});
  eq((await reader.listCalendars()).length,2,'Calendar list pagination');const read=await reader.readCalendar({id:'a@example.test',timeZone:'UTC',accessRole:'reader'},{from:iso(0),to:'2026-10-21T00:00:00Z'});eq(read.busy.length,2,'Event pagination');eq(read.coverage.complete,true,'Coverage complete only after all pages');ok(calls.every(c=>c.options.method==='GET'),'Event reader only GETs');ok(calls.some(c=>c.url.includes('singleEvents=true')),'Recurring instances expanded');
  const failed=createReader({getToken:async()=>'synthetic-test-token',fetchImpl:async(url)=>response(url.includes('pageToken=next')?{}:{timeZone:'UTC',items:[raw()],nextPageToken:'next'},url.includes('pageToken=next')?503:200)});
  const partial=await failed.readCalendar({id:'a',timeZone:'UTC'},{from:iso(0),to:'2026-10-21T00:00:00Z'});eq(partial.coverage.complete,false,'Failed page prevents confirmed coverage');eq(partial.busy.length,1,'Already read busy events preserved');eq(partial.failure.kind,'temporary','Typed read error surfaced');
  const free=createReader({getToken:async()=>'synthetic-test-token',fetchImpl:async(url,o)=>{eq(url.endsWith('/freeBusy'),true,'Free/busy uses read endpoint');eq(o.method,'POST','Free/busy query uses POST');return response({calendars:{a:{busy:[{start:iso(12),end:iso(13)}]}}});}});
  const fb=await free.readCalendar({id:'a',accessRole:'freeBusyReader'},{from:iso(0),to:'2026-10-21T00:00:00Z'});eq(fb.calendar,'busy','Free/busy reader supported');eq(fb.busy[0].detailsVisible,false,'Free/busy details remain hidden');
  console.log(`${assertions} regression checks passed`);
})().catch(e=>{console.error(e);process.exitCode=1;});
