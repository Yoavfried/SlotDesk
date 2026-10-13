/* Creates only explicitly reviewed new events. It never updates or moves existing events. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotGoogleWriter=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const email=value=>String(value||'').trim().toLowerCase();
  function prepare(draft,uuid=()=>globalThis.crypto.randomUUID()){
    if(typeof draft.title!=='string'||typeof draft.calendarId!=='string'||typeof draft.start!=='string'||typeof draft.end!=='string'||typeof draft.timezone!=='string'||draft.description!==undefined&&typeof draft.description!=='string'||draft.location!==undefined&&typeof draft.location!=='string')throw new Error('Choose valid text, calendar and time fields for this invitation.');
    if(!draft.title?.trim())throw new Error('Enter a meeting title.');
    if(!draft.calendarId)throw new Error('Choose a calendar for this meeting.');
    if(!Number.isFinite(Date.parse(draft.start))||!Number.isFinite(Date.parse(draft.end))||Date.parse(draft.end)<=Date.parse(draft.start))throw new Error('Choose a valid start and end time.');
    try{if(!draft.timezone)throw new Error();new Intl.DateTimeFormat('en',{timeZone:draft.timezone});}catch(_){throw new Error('Choose a valid meeting timezone.');}
    if(!Array.isArray(draft.attendees)||!draft.attendees.length)throw new Error('Keep at least one participant in the invitation list.');
    const seen=new Set(),attendees=draft.attendees.map(a=>{const key=email(a.email);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)||seen.has(key))throw new Error('Each participant needs a different valid email address.');seen.add(key);return {email:key,displayName:a.name||key,optional:a.required===false,responseStatus:'needsAction'};});
    const eventId='sd'+uuid().replace(/-/g,'').toLowerCase();if(!/^[a-v0-9]{5,1024}$/.test(eventId))throw new Error('Could not create a meeting identifier.');
    const event={id:eventId,summary:draft.title.trim(),start:{dateTime:new Date(draft.start).toISOString(),timeZone:draft.timezone},end:{dateTime:new Date(draft.end).toISOString(),timeZone:draft.timezone},attendees,description:draft.description||'',location:draft.location||'',extendedProperties:{private:{slotdeskRequest:eventId}}};
    if(draft.meet)event.conferenceData={createRequest:{requestId:uuid(),conferenceSolutionKey:{type:'hangoutsMeet'}}};
    return {calendarId:draft.calendarId,eventId,event};
  }
  function validateBooking(booking){
    const event=booking?.event,id=booking?.eventId;
    if(typeof booking?.calendarId!=='string'||!booking.calendarId||!/^sd[a-f0-9]{32}$/.test(id||'')||event?.id!==id||event.extendedProperties?.private?.slotdeskRequest!==id)throw new Error('This saved invitation has invalid identifiers. Check its calendar before trying another send.');
    const allowed=['id','summary','start','end','attendees','description','location','extendedProperties','conferenceData'];
    if(Object.keys(event).some(key=>!allowed.includes(key)))throw new Error('This invitation contains unsupported event fields. Existing meetings cannot be changed by this build.');
    if(Object.keys(event.start||{}).some(key=>!['dateTime','timeZone'].includes(key))||Object.keys(event.end||{}).some(key=>!['dateTime','timeZone'].includes(key)))throw new Error('This invitation contains unsupported time fields.');
    if(event.start?.timeZone!==event.end?.timeZone)throw new Error('Choose one timezone for this invitation.');
    const conference=event.conferenceData?.createRequest;
    if(event.conferenceData&&(!conference||Object.keys(event.conferenceData).some(key=>key!=='createRequest')||conference.conferenceSolutionKey?.type!=='hangoutsMeet'||typeof conference.requestId!=='string'||!conference.requestId))throw new Error('This invitation contains an invalid video request.');
    let calls=0;
    // Rebuild only the create payload we support, while retaining the original retry ID.
    return prepare({title:event.summary,calendarId:booking.calendarId,start:event.start?.dateTime,end:event.end?.dateTime,timezone:event.start?.timeZone,attendees:event.attendees?.map(a=>({email:a.email,name:a.displayName,required:!a.optional})),description:event.description,location:event.location,meet:!!conference},()=>++calls===1?id.slice(2):conference.requestId);
  }
  async function withSendLock(locks,account,task){
    if(!locks?.request||!account)throw new Error('This browser could not protect the send across workspace windows. Copy the meeting details and create it manually.');
    return locks.request('slotdesk-send:'+account,{mode:'exclusive',ifAvailable:true},lock=>{if(!lock)throw new Error('Another SlotDesk window is sending a calendar change. Wait until it finishes, then try again.');return task();});
  }
  function createWriter({getToken,invalidateToken=async()=>{},fetchImpl=globalThis.fetch,timeoutMs=20000}){
    const inFlight=new Map(),created=new Map();
    async function request(path,method='GET',body){
      // This build supports readback and insertion only; never route update/delete methods.
      if(method!=='GET'&&method!=='POST'||method==='POST'&&!/^calendars\/[^/]+\/events\?sendUpdates=all&conferenceDataVersion=1$/.test(path))throw new Error('Unsupported calendar operation.');
      let refreshed=false;
      for(;;){const token=await getToken(),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);let response,data;
        try{response=await fetchImpl('https://www.googleapis.com/calendar/v3/'+path,{method,redirect:'error',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});try{data=await response.json();}catch(_){data=null;}}
        catch(_){const error=new Error('The send result could not be confirmed. Keep this draft and retry to check the same meeting; do not create a second copy.');error.uncertain=true;throw error;}finally{clearTimeout(timer);}
        if(response.ok){if(!data?.id){const error=new Error('Google returned an incomplete send result. Retry to check this meeting.');error.uncertain=true;throw error;}return data;}
        if(response.status===401&&!refreshed){refreshed=true;await invalidateToken(token);continue;}
        const error=new Error(response.status===403?'Google could not create this meeting. Check event-writing permission, the selected calendar’s sharing, and Google Meet support.':response.status===404?'This calendar or meeting is unavailable. Check the selected calendar.':response.status===409?'This meeting identifier already exists.':response.status===429?'Google’s request limit was reached. Keep the draft and retry shortly.':response.status===401?'Reconnect Google and allow calendar event access before sending.':'Google could not confirm the meeting. Retry to check the same meeting.');error.code=response.status;error.uncertain=response.status>=500;error.writeRejected=method==='POST'&&response.status<500&&response.status!==409;throw error;
      }
    }
    const path=booking=>`calendars/${encodeURIComponent(booking.calendarId)}/events/${encodeURIComponent(booking.eventId)}`;
    function verify(event,booking){if(event.id!==booking.eventId||event.extendedProperties?.private?.slotdeskRequest!==booking.eventId)throw new Error('A different event already uses this identifier. Check Google Calendar before creating another meeting.');return event;}
    async function check(booking){booking=validateBooking(booking);try{return verify(await request(path(booking)),booking);}catch(e){if(e.code===404)return null;throw e;}}
    async function create(booking){
      booking=validateBooking(booking);
      const key=booking.calendarId+'|'+booking.eventId;if(created.has(key))return created.get(key);if(inFlight.has(key))return inFlight.get(key);
      const task=(async()=>{try{const event=verify(await request(`calendars/${encodeURIComponent(booking.calendarId)}/events?sendUpdates=all&conferenceDataVersion=1`,'POST',booking.event),booking);created.set(key,event);return event;}catch(error){if(error.uncertain||error.code===409){try{const found=await check(booking);if(found){created.set(key,found);return found;}}catch(_){}error.uncertain=true;}throw error;}})();
      inFlight.set(key,task);try{return await task;}finally{inFlight.delete(key);}
    }
    return {create,check};
  }
  return {prepare,validateBooking,withSendLock,createWriter};
});
