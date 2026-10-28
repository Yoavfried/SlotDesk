const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const U=require('./workspace-model'),E=require('./slotdesk-engine'),W=require('./google-writer');
const source=fs.readFileSync(path.join(__dirname,'../prototype/app.js'),'utf8');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++;},eq=(value,expected,message)=>{assert.deepEqual(value,expected,message);checks++;};
// Run the actual controller functions against a small form boundary. Calendar
// reads are replaced; the invitation payload, profiles and evaluator are real.
function install(context,names){vm.createContext(context);for(const name of names){const match=source.match(new RegExp('^  (?:async )?function '+name+'\\([^\\n]*','m'));assert.ok(match,'Controller function exists: '+name);vm.runInContext(match[0],context);}return context;}
class FixedDate extends Date{static now(){return Date.parse('2026-10-28T08:00:00Z');}}
(async()=>{
  for(const optional of [false,true]){
    const own={...U.newProfile('owner@example.test','Organizer','UTC'),tzConfirmed:true},guest={...U.newProfile('guest@example.test','Guest','Africa/Accra'),tzConfirmed:true,required:!optional};
    const state={profiles:[own],constraints:[],settings:{ownProfileId:own.id,guestProfiles:[guest],participantIds:[own.id,guest.id],draftId:'pending-draft',anchor:'UTC',duration:45,from:'2026-11-10',to:'2026-11-10',calendarScopeConfirmed:true}};
    const request=W.prepare({title:'Guest invitation',calendarId:own.email,start:'2026-11-10T09:00:00Z',end:'2026-11-10T09:45:00Z',timezone:'UTC',attendees:[own,guest],meet:false},()=> '11111111-1111-1111-1111-111111111111');
    state.pendingBooking={account:own.email,request};const original=JSON.stringify(request),nodes={};let populated,readParticipants;
    const context=install({state,account:own.email,U,E,SlotGoogleWriter:W,Date:FixedDate,bookingRequest:null,reviewDraftId:null,reviewSlot:null,reviewFingerprint:'',reviewDirty:false,calendars:[{id:own.email,accessRole:'owner'}],
      $:id=>nodes[id]??=({open:false,showModal(){this.open=true;}}),populateBooking:data=>{populated=data;},renderReviewWarnings:()=>{},status:message=>{throw Error(message);},
      scopedCalendars:()=>[{id:own.email,accessRole:'owner'}],loadCalendars:async(settings,people)=>{readParticipants=people;},peopleWithData:people=>people.map(p=>({...p,calendar:'none',busy:[]})),
      baseRequest:()=>({automaticAlternatives:true,duration:45,range:{from:'2026-11-10',to:'2026-11-10'},constraints:[],people:U.selectedProfiles(state)})
    },['participantEmail','pendingSlot','openPendingBooking','checkBookingDraft']);
    context.openPendingBooking(true);
    const restored=populated.attendees.find(p=>p.email===guest.email);
    eq(restored.id,guest.id,'Pending review preserves an email-only guest identity');
    eq(restored.required,!optional,'Pending review preserves required or optional attendance');
    const slot=await context.checkBookingDraft(populated);
    eq(readParticipants.find(p=>p.id===guest.id).tz,'Africa/Accra','Availability check uses the confirmed guest timezone');
    ok(slot.people.some(p=>p.id===guest.id&&p.tz==='Africa/Accra'),'Email-only guest passes the real availability evaluator');
    eq(context.bookingRequest.eventId,request.eventId,'Recovery preserves the original invitation identifier');
    eq(JSON.stringify(state.pendingBooking.request),original,'Availability checking cannot change the reserved invitation');
    eq(state.profiles.length,1,'Recovery never requires creating a saved guest profile');
  }
  const field={valueAsNumber:30,validity:{valid:true}},state={settings:{duration:45}};let saves=0,invalidations=0;
  const duration=install({state,$:()=>field,save:()=>saves++,invalidate:()=>invalidations++},['updateDuration']);
  duration.updateDuration();eq(state.settings.duration,30,'A duration edit updates the saved meeting settings');eq(saves,1,'A valid duration edit is persisted');eq(invalidations,1,'A duration edit clears stale meeting options immediately');
  field.valueAsNumber=NaN;field.validity.valid=false;duration.updateDuration();eq(state.settings.duration,30,'An incomplete duration retains the last valid saved value');eq(saves,1,'An invalid duration cannot corrupt saved settings');eq(invalidations,2,'Incomplete duration input still disables stale suggestions');
  field.valueAsNumber=60;field.validity.valid=true;duration.updateDuration();eq(state.settings.duration,60,'A later valid duration can be saved normally');
  const fingerprint=install({E},['fingerprint']).fingerprint,clone=value=>JSON.parse(JSON.stringify(value));
  const owner={...U.newProfile('owner@example.test','Organizer','UTC'),tzConfirmed:true,isOwnProfile:true,calendar:'detail',busy:[],coverages:[{from:'2026-11-10T00:00:00Z',to:'2026-11-11T00:00:00Z',complete:true}]};
  const event={id:'same-appointment',identity:'owner|same-appointment',calendarId:owner.email,title:'Existing meeting',start:'2026-11-10T10:00:00Z',end:'2026-11-10T11:00:00Z',type:'default',detailsVisible:true};
  const req={automaticAlternatives:true,range:{from:'2026-11-10',to:'2026-11-10'},duration:30,anchorTz:'UTC',now:FixedDate.now(),people:[owner]};
  const evaluate=()=>{const result=E.evaluate(req,{exactStart:Date.parse('2026-11-10T10:30:00Z')});return clone(result.open[0]||result.taken[0]);};
  owner.busy=[clone(event)];const original=evaluate();owner.busy[0].end='2026-11-10T10:45:00Z';
  ok(fingerprint(original)!==fingerprint(evaluate()),'A changed overlap interval requires renewed review before sending');
  owner.busy=[];const optionalGuest={...clone(owner),id:'optional',name:'Optional guest',email:'optional@example.test',required:false,isOwnProfile:false,busy:[clone(event)]};req.people=[owner,optionalGuest];
  const optionalBefore=evaluate();optionalGuest.busy[0].title='Different commitment';
  ok(fingerprint(optionalBefore)!==fingerprint(evaluate()),'A changed optional guest conflict is not hidden by unchanged unavailable status');
  optionalGuest.busy.push({...clone(event),id:'second',identity:'owner|second'});
  ok(fingerprint(optionalBefore)!==fingerprint(evaluate()),'A changed optional conflict count requires renewed review');
  const stable=evaluate(),metadataOnly=clone(stable);metadataOnly.fetchedAt='later';metadataOnly.etag='new etag';metadataOnly.people.forEach(p=>{p.coverages=[{fetchedAt:'later'}];for(const c of p.conflicts||[]){c.fetchedAt='later';c.etag='new etag';}});metadataOnly.overrides?.forEach(c=>{c.event.etag='new etag';c.event.fetchedAt='later';});
  eq(fingerprint(stable),fingerprint(metadataOnly),'Fetch timestamps and provider etags do not cause repeated confirmation');
  const reordered=clone(stable);reordered.people.reverse();reordered.people.forEach(p=>p.conflicts.reverse());reordered.notes.reverse();
  eq(fingerprint(stable),fingerprint(reordered),'Equivalent source ordering does not cause repeated confirmation');
  const reasonBefore=clone(stable);reasonBefore.people[0].timing=[{kind:'flight-buffer',label:'Near a flight',from:'2026-11-10T10:30:00Z',to:'2026-11-10T10:45:00Z',minutes:15}];
  const reasonAfter=clone(reasonBefore);reasonAfter.people[0].timing[0].kind='manual-inconvenience';reasonAfter.people[0].timing[0].label='Marked time';
  ok(fingerprint(reasonBefore)!==fingerprint(reasonAfter),'Changed factual warning reasons require renewed review even with equal minutes');
  console.log(`${checks} New meeting controller checks passed (no calendar requests or writes)`);
})().catch(error=>{console.error(error);process.exitCode=1;});
