(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotWorkspacePolicy=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const ids=settings=>Array.isArray(settings?.workspaceCalendarIds)?[...new Set(settings.workspaceCalendarIds.filter(id=>typeof id==='string'&&id))]:[];
  const signature=context=>JSON.stringify([context.account,context.settings?.calendarScopeConfirmed===true,context.generation||0,ids(context.settings).sort()]);
  const included=(settings,id)=>settings?.calendarScopeConfirmed===true&&ids(settings).includes(id);
  const calendars=(settings,list)=>list.filter(calendar=>included(settings,calendar.id));
  function suggestions(state,list,account){
    const available=new Set(list.map(calendar=>calendar.id));
    return [...new Set([account,state.settings.defaultCalendar,state.settings.organizingCalendar,state.pendingBooking?.request?.calendarId,state.pendingReschedule?.calendarId,...state.profiles.flatMap(p=>p.calendarIds||[]),...(state.settings.meetingsCalendars||[])].filter(id=>available.has(id)))];
  }
  function recoveryAllowed(context,id,eventId,method,body){
    const booking=context.pendingBooking;
    if(booking?.account===context.account&&booking.request?.calendarId===id){
      const target=booking.request.eventId;
      if(method==='GET'&&eventId===target)return true;
      if(method==='POST'&&!eventId){try{return JSON.parse(body).id===target;}catch(_){return false;}}
    }
    const change=context.pendingReschedule;
    return change?.account===context.account&&change.calendarId===id&&change.eventId===eventId&&['GET','PATCH'].includes(method);
  }
  function assertAccess(context,id,eventId='',method='GET',body){
    if(included(context.settings,id)||recoveryAllowed(context,id,eventId,method,body))return;
    throw new Error(context.settings?.calendarScopeConfirmed?'This calendar is not selected for SlotDesk. Choose it in Settings → Calendars to use it.':'Choose the calendars SlotDesk can use before loading meetings.');
  }
  function scopedFetch(fetchImpl,context){
    return async function(input,options={}){
      const url=new URL(typeof input==='string'?input:input.url),match=url.pathname.match(/^\/calendar\/v3\/calendars\/([^/]+)\/events(?:\/([^/]+))?$/),freeBusy=url.pathname==='/calendar/v3/freeBusy',method=(options.method||'GET').toUpperCase(),before=context(),stamp=signature(before);
      if(match)assertAccess(before,decodeURIComponent(match[1]),match[2]?decodeURIComponent(match[2]):'',method,options.body);
      if(freeBusy){let body;try{body=JSON.parse(options.body);}catch(_){throw new Error('Invalid availability request.');}if(!Array.isArray(body.items)||!body.items.length)throw new Error('Choose availability calendars.');for(const item of body.items)if(!included(before.settings,item.id))throw new Error('An availability calendar is outside the selected SlotDesk calendars.');}
      const response=await fetchImpl(input,options);
      if((match||freeBusy)&&signature(context())!==stamp&&(method==='GET'||freeBusy))throw new Error('Calendar selection changed while loading. Refresh using the selected calendars.');
      return response;
    };
  }
  function removeCalendarAssignments(state,removed){
    const ids=new Set(removed);if(!ids.size)return;
    for(const person of [...state.profiles,...(state.settings.guestProfiles||[])]){person.calendarIds=(person.calendarIds||[]).filter(id=>!ids.has(id));person.leaveCalendarIds=(person.leaveCalendarIds||[]).filter(id=>person.calendarIds.includes(id));if(person.calendarLabels)for(const id of ids)delete person.calendarLabels[id];}
  }
  function scopeChange(state,selected,defaultId,list){
    const chosen=[...new Set(selected)],available=new Map(list.map(cal=>[cal.id,cal]));
    if(!chosen.length||chosen.some(id=>!available.has(id)))throw new Error('Choose at least one available calendar.');
    const writable=id=>['owner','writer','writerWithoutPrivateAccess'].includes(available.get(id)?.accessRole);
    if(!chosen.includes(defaultId)||!writable(defaultId))defaultId='';
    const pending=state.pendingBooking?.request?.calendarId||state.pendingReschedule?.calendarId;
    if(pending&&!chosen.includes(pending))throw new Error('Keep the calendar of the unfinished change selected until that change is resolved.');
    return {workspaceCalendarIds:chosen,calendarScopeConfirmed:true,scopeRevision:(state.settings.scopeRevision||0)+1,defaultCalendar:defaultId,defaultCalendarSelected:!!defaultId};
  }
  return {ids,included,calendars,signature,suggestions,assertAccess,scopedFetch,scopeChange,removeCalendarAssignments};
});
