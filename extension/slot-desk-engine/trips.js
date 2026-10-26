(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotTrips=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const MIN=60000,copy=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
  const instant=v=>typeof v==='string'&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v));
  const zone=v=>{try{return typeof v==='string'&&!!v&&!!new Intl.DateTimeFormat('en',{timeZone:v});}catch(_){return false;}};
  const end=trip=>Date.parse(trip.flights.at(-1).arrival),start=trip=>Date.parse(trip.flights[0].departure);
  const live=p=>(p.trips||[]).filter(t=>!t.legacy&&t.flights?.length);
  function validate(trip){
    if(!trip||typeof trip!=='object'||typeof trip.id!=='string'||!trip.id||typeof trip.name!=='string'||trip.name.length>300||!Array.isArray(trip.flights)||!trip.flights.length||trip.flights.length>100)throw new Error('Add at least one flight to this trip.');
    if(!zone(trip.originZone)||typeof trip.originLocation!=='string')throw new Error('Choose the trip’s departure location and timezone.');
    const ids=new Set();let previous=null;
    for(const f of trip.flights){
      if(!f||typeof f.id!=='string'||!f.id||ids.has(f.id))throw new Error('Each flight must have its own identity.');ids.add(f.id);
      if(!instant(f.departure)||!instant(f.arrival)||Date.parse(f.arrival)<=Date.parse(f.departure)||!zone(f.departureZone)||!zone(f.arrivalZone))throw new Error('Check departure and arrival dates, times and timezones.');
      if(previous&&Date.parse(f.departure)<Date.parse(previous.arrival))throw new Error('The next flight must depart after the previous flight arrives.');
      if(f.returnFlight&&f!==trip.flights.at(-1))throw new Error('Flight back must be the last flight.');
      for(const k of ['label','departureLocation','arrivalLocation'])if(f[k]!==undefined&&(typeof f[k]!=='string'||f[k].length>1000))throw new Error('Check the flight location and name.');
      for(const k of ['connection','returnFlight','estimated'])if(f[k]!==undefined&&typeof f[k]!=='boolean')throw new Error('Check the flight options.');
      if(f.link&&(!f.link.calendarId||!f.link.eventId||typeof f.link.calendarId!=='string'||typeof f.link.eventId!=='string'||typeof f.link.signature!=='string'))throw new Error('The linked calendar flight is invalid.');
      previous=f;
    }
    return trip;
  }
  function validateProfile(p){
    if(p.tripSchemaVersion!==undefined&&![0,1].includes(p.tripSchemaVersion))throw new Error('Unsupported trip settings version.');
    if(p.trips!==undefined&&(!Array.isArray(p.trips)||p.trips.length>2000))throw new Error('Invalid saved trips.');
    const ids=new Set();for(const t of p.trips||[]){validate(t);if(ids.has(t.id))throw new Error('Two trips have the same identity.');ids.add(t.id);}
    const ordered=live(p).slice().sort((a,b)=>start(a)-start(b));if(ordered.some((t,i)=>i&&start(t)<end(ordered[i-1])))throw new Error('These trips overlap. Combine their flights or correct the dates.');
    if(p.tripTimezoneState){const s=p.tripTimezoneState;if(!zone(s.baseZone)||!Array.isArray(s.history)||s.history.length>10000)throw new Error('Invalid trip timezone history.');for(const h of s.history)if(!instant(h.at)||!zone(h.tz)||!['manual','arrival'].includes(h.kind)||typeof h.key!=='string')throw new Error('Invalid trip timezone change.');}
    if(p.flightTerms!==undefined&&(typeof p.flightTerms!=='string'||p.flightTerms.length>2000))throw new Error('Flight keywords are too long.');
    if(p.flightDismissals!==undefined&&(!Array.isArray(p.flightDismissals)||p.flightDismissals.length>2000||p.flightDismissals.some(x=>typeof x!=='string')))throw new Error('Invalid flight alert settings.');
    return p;
  }
  function migrate(p){
    if(p.tripSchemaVersion===1)return p;
    p.trips=p.trips||[];p.flightTerms=p.flightTerms??'flight, flights, ✈';p.flightDismissals=p.flightDismissals||[];
    for(const [i,f]of(p.flights||[]).entries()){
      const id='legacy-flight:'+String(f.id||i);if(p.trips.some(t=>t.id===id))continue;
      p.trips.push({id,name:f.label||'Imported flight',originZone:f.departureZone||p.tz,originLocation:f.departureLocation||'',legacy:true,flights:[{...copy(f),id:f.id||id,departureZone:f.departureZone||p.tz,arrivalZone:f.arrivalZone||p.tz,legacyIndex:i}]});
    }
    p.tripSchemaVersion=1;return p;
  }
  function origin(p){return copy(p.tripTimezoneState||{baseZone:p.tz,baseLocation:p.tzLocation||null,history:[]});}
  function arrivalChange(t){const f=t.flights.at(-1);return f.returnFlight?null:{kind:'arrival',key:JSON.stringify([t.id,f.arrival,f.arrivalZone]),at:f.arrival,tz:f.arrivalZone,location:f.arrivalZoneLocation||null};}
  function history(p){const s=origin(p),entries=[...s.history,...live(p).map(arrivalChange).filter(Boolean)];return {...s,history:[...new Map(entries.map(h=>[h.key,h])).values()].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)||(a.kind==='manual'?1:0)-(b.kind==='manual'?1:0))};}
  function baseAt(p,t){const s=history(p);let result={tz:s.baseZone,location:s.baseLocation};for(const h of s.history)if(Date.parse(h.at)<=t)result={tz:h.tz,location:h.location||null};return result;}
  function active(p,t){return live(p).find(trip=>start(trip)<=t&&t<end(trip))||null;}
  function effective(p,t){
    const trip=active(p,t);if(!trip)return {...baseAt(p,t),trip:null};
    let result={tz:trip.originZone,location:trip.originZoneLocation||null};for(const f of trip.flights)if(Date.parse(f.arrival)<=t)result={tz:f.arrivalZone,location:f.arrivalZoneLocation||null};return {...result,trip};
  }
  function manual(p,tz,location,now=Date.now()){
    const s=origin(p),at=new Date(now).toISOString();s.history.push({kind:'manual',key:'manual:'+at+':'+tz,at,tz,location:copy(location)||null});return s;
  }
  function reconcile(p,now=Date.now()){
    if(!live(p).length&&!p.tripTimezoneState)return false;
    const before=JSON.stringify([p.tz,p.tzLocation,p.tripTimezoneState]);const s=origin(p);
    for(const t of live(p)){const h=arrivalChange(t);if(h&&Date.parse(h.at)<=now&&!s.history.some(x=>x.key===h.key))s.history.push(h);}
    p.tripTimezoneState=s;const value=baseAt(p,now);p.tz=value.tz;if(value.location)p.tzLocation=copy(value.location);else delete p.tzLocation;
    return before!==JSON.stringify([p.tz,p.tzLocation,p.tripTimezoneState]);
  }
  function flights(p){
    const trips=p.trips||[],legacy=trips.filter(t=>t.legacy).flatMap(t=>t.flights.map(f=>f.id));
    return [...(p.flights||[]).filter((f,i)=>!trips.some(t=>t.id==='legacy-flight:'+String(f.id||i))&&!legacy.includes(f.id)),...trips.flatMap(t=>(t.flights||[]).map(f=>({...f,tripId:t.id})))];
  }
  function blocks(p){
    const result=flights(p).map(f=>({...f,start:f.departure,end:f.arrival}));
    for(const t of live(p))for(let i=1;i<t.flights.length;i++)if(t.flights[i].connection){const a=t.flights[i-1],b=t.flights[i];for(const [suffix,from,to]of[['arrival',Date.parse(a.arrival),Math.min(Date.parse(a.arrival)+30*MIN,Date.parse(b.departure))],['departure',Math.max(Date.parse(a.arrival),Date.parse(b.departure)-30*MIN),Date.parse(b.departure)]])if(to>from)result.push({id:b.id+':connection:'+suffix,start:new Date(from).toISOString(),end:new Date(to).toISOString(),label:'Connection at '+(a.arrivalLocation||'airport'),arrivalLocation:a.arrivalLocation,tripId:t.id});}
    return result;
  }
  function buffers(p){
    const result=[];for(const t of p.trips||[]){if(t.legacy)continue;const first=t.flights[0],last=t.flights.at(-1);if(first&&last)result.push({from:Date.parse(first.departure)-120*MIN,to:Date.parse(first.departure),label:'Before flight departure'},{from:Date.parse(last.arrival),to:Date.parse(last.arrival)+120*MIN,label:'After flight arrival'});}
    for(const f of flights(p).filter(f=>!f.tripId||(p.trips||[]).find(t=>t.id===f.tripId)?.legacy))for(const t of [Date.parse(f.departure),Date.parse(f.arrival)])result.push({from:t-120*MIN,to:t+120*MIN,label:'Flight buffer'});return result;
  }
  function boundary(p,t,fallback){const next=live(p).flatMap(trip=>[start(trip),end(trip),...trip.flights.map(f=>Date.parse(f.arrival))]).filter(x=>x>t);return Math.min(fallback,...next);}
  function eventKey(event,calendarId){return JSON.stringify([calendarId,event.id]);}
  function signature(event){return JSON.stringify([event.status||'confirmed',event.start?.dateTime||event.start?.date||'',event.end?.dateTime||event.end?.date||'',event.location||'',event.summary||'']);}
  function linked(p,event,sameTimes=false){return (p.trips||[]).some(t=>t.flights.some(f=>f.link&&(f.link.calendarId===event.calendarId&&f.link.eventId===event.id||f.link.iCalUID&&f.link.iCalUID===event.iCalUID&&Number.isFinite(Date.parse(f.link.originalStart))&&Date.parse(f.link.originalStart)===Date.parse(event.originalStart))&&(!sameTimes||Date.parse(f.departure)===Date.parse(event.start)&&Date.parse(f.arrival)===Date.parse(event.end))));}
  function hints(event,p,lookup){
    if(!instant(event.start?.dateTime)||!instant(event.end?.dateTime)||Date.parse(event.end.dateTime)<=Date.parse(event.start.dateTime)||event.status==='cancelled'||event.transparency==='transparent'||event.start?.date||!event.start?.dateTime||!event.end?.dateTime)return null;
    const text=[event.summary,event.location,event.description].filter(Boolean).join(' ').slice(0,40000),terms=String(p.flightTerms??'flight, flights, ✈').split(',').map(x=>x.trim()).filter(Boolean),match=terms.some(term=>term==='✈'?text.includes(term):new RegExp('(^|[^\\p{L}\\p{N}])'+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^\\p{L}\\p{N}])','iu').test(text)),route=lookup?.route(text);
    if(!match&&!route)return null;
    return {departure:event.start.dateTime,arrival:event.end.dateTime,departureZone:route?.from.tz||event.start.timeZone||'',arrivalZone:route?.to.tz||'',departureLocation:route?.from.label||'',arrivalLocation:route?.to.label||'',from:route?.from||null,to:route?.to||null,clear:!!(route&&instant(event.start.dateTime)&&instant(event.end.dateTime)&&Date.parse(event.end.dateTime)>Date.parse(event.start.dateTime)),label:event.summary||'Flight'};
  }
  function observe(p,records,lookup,now=Date.now()){
    const alerts=[],links=new Map();for(const t of p.trips||[])for(const f of t.flights||[])if(f.link)links.set(eventKey({id:f.link.eventId},f.link.calendarId),{trip:t,flight:f});
    const complete=source=>source.coverage?.complete!==false&&!source.stale&&!source.failure;
    for(const [key,saved]of links){
      const d=Date.parse(saved.flight.departure),record=records.slice().reverse().find(r=>r.cal?.id===saved.flight.link.calendarId&&(!complete(r.source)||(r.source.items||[]).some(e=>e.id===saved.flight.link.eventId)||Date.parse(r.source.coverage?.from)<=d&&d<Date.parse(r.source.coverage?.to)));
      if(record){const {source,cal}=record,event=(source.items||[]).find(e=>e.id===saved.flight.link.eventId),covered=complete(source)&&Date.parse(source.coverage?.from)<=d&&d<Date.parse(source.coverage?.to);
        const status=!complete(source)?'access':event?.status==='cancelled'?'cancelled':!event&&covered?'missing':event&&signature(event)!==saved.flight.link.signature?'changed':null;
        if(status)alerts.push({id:'review:'+key,kind:'review',status,profileId:p.id,tripId:saved.trip.id,flightId:saved.flight.id,title:saved.flight.label||saved.trip.name||'Flight',event:event||null,cal,hint:event?hints(event,p,lookup):null});
      }
    }
    if(p.eventDetectionEnabled===false)return alerts;
    const seen=new Set();
    for(const {source,cal}of records.slice().reverse()){
      if(!(p.calendarIds||[]).includes(cal?.id)||!complete(source))continue;
      for(const event of source.items||[]){const key=eventKey(event,cal.id),s=signature(event),shared=event.iCalUID?event.iCalUID+'|'+Date.parse(event.originalStartTime?.dateTime||event.start?.dateTime):key;if(seen.has(shared))continue;seen.add(shared);if(links.has(key)||linked(p,{...event,calendarId:cal.id,originalStart:event.originalStartTime?.dateTime||event.start?.dateTime})||(p.flightDismissals||[]).includes(key+'|'+s)||Date.parse(event.end?.dateTime)<=now)continue;const hint=hints(event,p,lookup);if(hint)alerts.push({id:'possible:'+key,kind:'possible',profileId:p.id,title:event.summary||'Possible flight',event,cal,hint,dismissKey:key+'|'+s});}
    }
    return alerts;
  }
  return {MIN,validate,validateProfile,migrate,active,effective,manual,reconcile,flights,blocks,buffers,boundary,linked,hints,observe,signature,eventKey,copy,zone};
});
