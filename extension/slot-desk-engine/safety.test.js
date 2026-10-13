/* Synthetic calendars and mocked transport only. No real account or invitations. */
const assert=require('node:assert/strict'),crypto=require('node:crypto'),{performance}=require('node:perf_hooks');
const E=require('./slotdesk-engine.js'),G=require('./google-adapter.js'),U=require('./workspace-model.js'),W=require('./google-writer.js'),R=require('./google-reader.js'),{createStore}=require('./workspace-store.js');
let checks=0;const ok=value=>{assert.ok(value);checks++;},eq=(a,b)=>{assert.deepEqual(a,b);checks++;},throws=(fn,re)=>{assert.throws(fn,re);checks++;},rejects=async(fn,re)=>{await assert.rejects(fn,re);checks++;};
const response=(data,status=200)=>({ok:status>=200&&status<300,status,json:async()=>data});
const uuid=()=> '9e806ac4-85b5-4bfc-a45b-4611967b951d';
const draft={title:'Safety test',calendarId:'executive@example.test',start:'2026-10-20T09:00:00Z',end:'2026-10-20T09:45:00Z',timezone:'UTC',attendees:[{email:'guest@example.test',name:'Guest',required:true}],description:'Synthetic only',location:'',meet:true};
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
(async()=>{
  const profiles=Array.from({length:50},(_,i)=>({...U.newProfile('person'+i+'@example.test','Person '+String(i).padStart(2,'0'),'UTC'),tzConfirmed:true})),state={profiles,settings:{ownProfileId:profiles[0].id}};
  U.migrate(state,profiles[0].email);eq(U.selectedProfiles(state).length,0);eq(state.profiles.length,50);
  U.addParticipant(state,profiles[0].id);U.addParticipant(state,profiles[49].id);U.addParticipant(state,profiles[49].id);eq(U.selectedProfiles(state).map(p=>p.id),[profiles[0].id,profiles[49].id]);
  eq(U.matchProfiles(profiles,'PERSON 49').map(p=>p.id),[profiles[49].id]);eq(U.matchProfiles(profiles,'person49@example.test').length,1);eq(U.matchProfiles(profiles,'49',state.settings.participantIds).length,0);
  U.removeParticipant(state,profiles[0].id);eq(U.selectedProfiles(state).length,1);ok(!U.addParticipant(state,'missing'));
  state.settings.participantIds=['missing',profiles[49].id,profiles[49].id];U.migrate(state,profiles[0].email);eq(state.settings.participantIds,[profiles[49].id]);

  const raw={id:'shared',summary:'Board meeting',start:{dateTime:draft.start},end:{dateTime:draft.end},attendees:[{email:'assistant@example.test',self:true,responseStatus:'declined'},{email:'executive@example.test',responseStatus:'accepted'}]};
  eq(G.fromGoogle({items:[raw]},'executive@example.test').busy.length,1);eq(G.fromGoogle({items:[raw]},'assistant@example.test').busy.length,0);
  eq(G.fromGoogle({items:[{...raw,attendees:[{self:true,responseStatus:'declined'}]}]},'executive@example.test').busy.length,1);
  eq(G.fromGoogle({items:[{...raw,attendees:[{email:'EXECUTIVE@example.test',responseStatus:'declined'},{email:'assistant@example.test',self:true,responseStatus:'accepted'}]}]},'executive@example.test').busy.length,0);

  const booking=W.prepare(draft,uuid);eq(W.validateBooking(booking),booking);
  let requests=0,tokenRequests=0;
  const guarded=W.createWriter({getToken:async()=>{tokenRequests++;return 'synthetic-token';},fetchImpl:async()=>{requests++;return response(booking.event);}});
  for(const patch of [{status:'cancelled'},{recurrence:['RRULE:FREQ=DAILY']},{recurringEventId:'an-existing-series'},{organizer:{email:'someone@example.test'}}])await rejects(()=>guarded.create({...booking,event:{...booking.event,...patch}}),/unsupported event fields/);
  await rejects(()=>guarded.create({...booking,eventId:'existing-meeting'}),/invalid identifiers/);
  await rejects(()=>guarded.check({...booking,event:{...booking.event,extendedProperties:{private:{slotdeskRequest:'different'}}}}),/invalid identifiers/);
  await rejects(()=>guarded.create({...booking,event:{...booking.event,start:{date:'2026-10-20'}}}),/unsupported time fields/);
  eq(requests,0);eq(tokenRequests,0);

  const existing=new Map(Array.from({length:2000},(_,i)=>['existing-'+i,{id:'existing-'+i,summary:'Existing '+i,start:{dateTime:draft.start},end:{dateTime:draft.end},description:'Keep untouched '+i}])),before=hash([...existing]);
  const created=new Map(),calls=[];let loseResponse=true;
  const writer=W.createWriter({getToken:async()=>'synthetic-token',fetchImpl:async(url,options)=>{
    calls.push({url,method:options.method});ok(['GET','POST'].includes(options.method));eq(new URL(url).origin,'https://www.googleapis.com');eq(options.redirect,'error');eq(options.credentials,'omit');eq(options.cache,'no-store');
    if(options.method==='POST'){ok(/\/events\?sendUpdates=all&conferenceDataVersion=1$/.test(url));const event=JSON.parse(options.body);ok(!existing.has(event.id));created.set(event.id,event);if(loseResponse){loseResponse=false;throw new TypeError('Synthetic response loss');}return response(event);}
    const id=decodeURIComponent(new URL(url).pathname.split('/').at(-1));return created.has(id)?response(created.get(id)):response({},404);
  }});
  const results=await Promise.all([writer.create(booking),writer.create(booking)]);eq(results[0].id,booking.eventId);eq(results[1].id,booking.eventId);eq(created.size,1);eq(calls.filter(c=>c.method==='POST').length,1);eq(hash([...existing]),before);
  await writer.create(booking);eq(calls.filter(c=>c.method==='POST').length,1);
  const collision=W.createWriter({getToken:async()=>'synthetic-token',fetchImpl:async(_,o)=>o.method==='POST'?response({},409):response({...booking.event,extendedProperties:{}})});
  await rejects(()=>collision.create(booking),/identifier already exists/);eq(hash([...existing]),before);
  let releaseToken;const tokenReady=new Promise(resolve=>releaseToken=resolve),mutable=W.prepare(draft,uuid);
  const snapshot=W.createWriter({getToken:()=>tokenReady,fetchImpl:async(_,o)=>response(JSON.parse(o.body))});const sending=snapshot.create(mutable);mutable.event.summary='Unexpected changed title';releaseToken('synthetic-token');eq((await sending).summary,draft.title);

  const memory=new Map(),store=createStore({getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)}),initial={profiles:[{...profiles[0],busy:[{summary:'FETCHED PRIVATE DATA'}],token:'TOKEN MUST NOT PERSIST'}],constraints:[],settings:{participantIds:[]}};
  store.save('account@example.test',initial);const a=store.load('account@example.test',{settings:{}}),b=store.load('account@example.test',{settings:{}});a.pendingBooking={account:'account@example.test',request:booking};store.save('account@example.test',a);
  throws(()=>store.save('account@example.test',b),/Another SlotDesk window/);eq(store.load('account@example.test',{settings:{}}).pendingBooking.request.eventId,booking.eventId);ok(![...memory.values()].join().includes('FETCHED PRIVATE DATA'));ok(![...memory.values()].join().includes('TOKEN MUST NOT PERSIST'));
  eq(store.load('other@example.test',{settings:{}}).pendingBooking,undefined);
  let active=false,finishLock;const held=new Promise(resolve=>finishLock=resolve),locks={request:async(name,options,task)=>{eq(name,'slotdesk-send:account@example.test');eq(options.ifAvailable,true);if(active)return task(null);active=true;try{return await task({name});}finally{active=false;}}};
  const first=W.withSendLock(locks,'account@example.test',()=>held);await rejects(()=>W.withSendLock(locks,'account@example.test',()=>{throw Error('Should not run');}),/Another SlotDesk window is sending/);finishLock('sent');eq(await first,'sent');await rejects(()=>W.withSendLock(null,'account@example.test',()=>{}),/could not protect/);

  const items=Array.from({length:6000},(_,i)=>({id:'dense-'+i,summary:'Busy '+i,start:{dateTime:new Date(Date.parse('2026-10-19T07:00:00Z')+(i%336)*30*60000).toISOString()},end:{dateTime:new Date(Date.parse('2026-10-19T07:00:00Z')+(i%336)*30*60000+15*60000).toISOString()}}));
  const reader=R.createReader({getToken:async()=>'synthetic-token',fetchImpl:async(url,options)=>{eq(options.method,'GET');eq(options.redirect,'error');const page=+(new URL(url).searchParams.get('pageToken')||0);return response({items:items.slice(page*2000,(page+1)*2000),...(page<2?{nextPageToken:String(page+1)}:{})});}});
  const loaded=await reader.readSource({id:'dense@example.test',timeZone:'UTC',accessRole:'owner'},{from:'2026-10-19T00:00:00Z',to:'2026-10-27T00:00:00Z'});eq(loaded.items.length,6000);eq(loaded.coverage.complete,true);eq(hash(items),hash(loaded.items));
  const people=profiles.slice(0,6).map((p,i)=>({...p,calendar:'detail',busy:items.slice(i*1000,(i+1)*1000).map(event=>({id:event.id,identity:event.id,start:event.start.dateTime,end:event.end.dateTime,title:event.summary,override:'protected'})),coverages:[loaded.coverage]})),input={people,duration:45,range:{from:'2026-10-19',to:'2026-10-25'},anchorTz:'UTC',now:Date.parse('2026-10-18T00:00:00Z'),step:30,want:3,perDay:1,minDuration:45,extendDays:0},snapshotHash=hash(input),started=performance.now();
  const result=E.findSlots(input),elapsed=Math.round(performance.now()-started);eq(result.errors,[]);eq(hash(input),snapshotHash);ok(elapsed<30000);eq(hash([...existing]),before);
  console.log(checks+' safety and scale checks passed; 50 saved profiles, 6,000 paginated events, 2,000 unchanged meetings; dense search '+elapsed+'ms. Mocked transport only.');
})().catch(error=>{console.error(error);process.exitCode=1;});
