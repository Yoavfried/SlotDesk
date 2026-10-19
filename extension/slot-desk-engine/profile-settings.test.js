'use strict';
const assert=require('node:assert/strict'),C=require('./profile-configuration'),P=require('./workspace-policy'),U=require('./workspace-model');let checks=0;
const equal=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=value=>{assert.ok(value);checks++;};
const own={...U.newProfile('owner@example.test','Owner','UTC'),id:'own',calendarIds:['work','home'],leaveCalendarIds:['home'],calendarLabels:{work:'Work',home:'Home'}},guest={...U.newProfile('guest@example.test','Guest','UTC'),id:'guest',calendarIds:['work'],leaveCalendarIds:['work']};
const list=[own,guest];
for(const email of ['','bad','x@','bad email@example.test']){const result=C.emailEdit(guest,email,list,own.id);ok(result.restored);equal(result.email,guest.email);ok(result.message.includes(guest.email));}
ok(C.emailEdit(guest,own.email,list,own.id).restored);
ok(C.emailEdit(own,'replacement@example.test',list,own.id).restored);
equal(C.emailEdit(guest,' NEW@EXAMPLE.TEST ',list,own.id),{email:'new@example.test',restored:false});
const state={profiles:JSON.parse(JSON.stringify(list)),settings:{guestProfiles:[{calendarIds:['home'],leaveCalendarIds:['home']}]},constraints:[{label:'Keep rule'}],pendingBooking:{request:{calendarId:'work'}}};
P.removeCalendarAssignments(state,['work']);equal(state.profiles[0].calendarIds,['home']);equal(state.profiles[0].leaveCalendarIds,['home']);equal(state.profiles[0].calendarLabels,{home:'Home'});equal(state.profiles[1].calendarIds,[]);equal(state.profiles[1].leaveCalendarIds,[]);equal(state.constraints,[{label:'Keep rule'}]);equal(state.pendingBooking,{request:{calendarId:'work'}});
P.removeCalendarAssignments(state,['home']);equal(state.profiles[0].calendarIds,[]);equal(state.settings.guestProfiles[0].calendarIds,[]);
const before=JSON.stringify(state);P.removeCalendarAssignments(state,[]);equal(JSON.stringify(state),before);
assert.throws(()=>C.checkProfile({...guest,email:'bad'}),/valid email/);checks++;
console.log(checks+' profile email and calendar-removal checks passed; local configuration only.');
