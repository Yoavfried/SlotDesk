async page=>{
  page.setDefaultTimeout(12000);
  const checks=[],scans=[],errors=[],reads=[];let holdRead=null;
  const check=(value,message)=>{if(!value)throw Error(message);checks.push(message);};
  page.on('pageerror',error=>errors.push(error.message));
  const event=(id,summary,departure,arrival,extra={})=>({id,iCalUID:id+'@example.test',status:'confirmed',summary,start:{dateTime:departure,timeZone:'Asia/Jerusalem'},end:{dateTime:arrival},organizer:{email:'nina@example.test'},...extra});
  const exact=event('exact-flight','Flight TLV → LHR','2027-02-01T08:00:00Z','2027-02-01T13:00:00Z');
  const ordinary=event('ordinary-route','Booking TLV → LHR','2027-02-10T08:00:00Z','2027-02-10T13:20:00Z');
  const missing=event('ordinary-unresolved','Reserved time','2027-02-11T08:00:00Z','2027-02-11T13:35:00Z');
  const draftEvent=event('draft-route','Booking LHR → JFK','2027-02-12T15:00:00Z','2027-02-12T22:00:00Z',{start:{dateTime:'2027-02-12T15:00:00Z',timeZone:'Europe/London'}});
  const fractional=event('fractional-flight','Booking TLV → LHR · exact seconds','2027-02-13T08:00:30Z','2027-02-13T13:00:45Z');
  const allDay={id:'all-day-reservation',iCalUID:'all-day-reservation@example.test',status:'confirmed',summary:'Ticket reservation',start:{date:'2027-02-14'},end:{date:'2027-02-15'}};
  const shared={...exact,id:'shared-exact',summary:'Shared copy TLV → LHR',organizer:{email:'team@example.test'}};
  const pattern='**/__google/calendars/**/events?**';
  await page.route(pattern,async route=>{
    const response=await route.fetch(),data=await response.json(),url=new URL(route.request().url());
    reads.push(url.toString());
    const calendar=decodeURIComponent(url.pathname).includes('nina@example.test')?'own':decodeURIComponent(url.pathname).includes('team@example.test')?'team':null;
    for(const item of calendar==='own'?[exact,ordinary,missing,draftEvent,fractional,allDay]:calendar==='team'?[shared]:[]){const from=Date.parse(item.start.dateTime||item.start.date),to=Date.parse(item.end.dateTime||item.end.date);if(from<Date.parse(url.searchParams.get('timeMax'))&&to>Date.parse(url.searchParams.get('timeMin')))data.items.push(item);}
    if(holdRead&&calendar==='own'){const gate=holdRead;holdRead=null;gate.started();await gate.wait;}
    await route.fulfill({response,json:data});
  });
  const storageKey='slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test');
  const own=()=>page.evaluate(key=>{const state=JSON.parse(localStorage.getItem(key));return state.profiles.find(profile=>profile.id===state.settings.ownProfileId);},storageKey);
  const leg=index=>page.locator('[data-leg-fields="'+index+'"]');
  const city=async(index,side,query,name)=>{const input=page.locator('[data-place="'+side+'"][data-index="'+index+'"]');await input.fill(query);await input.locator('..').locator('[data-place-results="'+side+'"] button').filter({hasText:name}).first().click();};
  const departure=async(index,date,time)=>{await leg(index).locator('[data-field=departureDate]').fill(date);await leg(index).locator('[data-field=departureTime]').fill(time);await leg(index).locator('[data-field=departureTime]').blur();};
  const save=async()=>{await page.locator('#trip-save').click();await page.locator('#trip-editor').waitFor({state:'hidden'});};
  const picker=async(index,date)=>{await page.locator('[data-calendar-flight="'+index+'"]').click();await page.locator('#trip-calendar-picker').waitFor({state:'visible'});await page.locator('#trip-calendar-from').fill(date);await page.locator('#trip-calendar-to').fill(date);await page.locator('[data-trip-calendar="nina@example.test"]').check();await page.locator('[data-trip-calendar="team@example.test"]').uncheck();await page.locator('#trip-calendar-load').click();await page.locator('.trip-calendar-entry').first().waitFor();};
  const row=summary=>page.locator('.trip-calendar-entry').filter({hasText:summary});
  const scan=async name=>{if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({url:'http://127.0.0.1:8893/__axe.js'});const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));scans.push({name,violations:result.violations.map(item=>({id:item.id,nodes:item.nodes.map(node=>node.target)}))});};

  await page.goto('http://127.0.0.1:8893/?case=ready');await page.evaluate(()=>localStorage.removeItem('slotdesk-v091-fixture:ready'));await page.reload();
  await page.locator('#connect').evaluate(element=>{if(!element.hidden&&!element.disabled)element.click();});await page.locator('#home-profiles').waitFor();
  await page.locator('#home-profiles').click();await page.locator('[data-profile-travel]').first().click();await page.locator('#trip-add').click();
  await page.waitForLoadState('networkidle');const before=reads.length;
  await page.locator('#trip-name').fill('Exact calendar match');await city(0,'departure','Tel Aviv','Tel Aviv');await city(0,'arrival','London','London, United Kingdom');await departure(0,'2027-02-01','10:00');
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  check(reads.length===before,'Editing departure cities, date and time makes no calendar reads');
  check(await page.locator('#trip-editor [data-field=arrivalDate],#trip-editor [data-field=arrivalTime],#trip-editor select[data-field$=Zone]').count()===0,'Calendar matching introduces no required arrival or timezone inputs');
  let started,release;const pending=new Promise(resolve=>started=resolve),wait=new Promise(resolve=>release=resolve);holdRead={started,wait};
  await page.locator('#trip-save').click();await pending;
  check(await page.locator('#trip-form').evaluate(element=>element.inert)&&await page.locator('#trip-save').isDisabled()&&await page.locator('#trip-discard').isDisabled(),'Save freezes the trip form while its final calendar check is pending');
  release();await page.locator('#trip-editor').waitFor({state:'hidden'});const first=(await own()).trips.find(trip=>trip.name==='Exact calendar match').flights[0];
  check(reads.length>before,'Save checks the profile calendars for matching flights');
  check(first.link?.eventId===exact.id&&first.arrival==='2027-02-01T13:00:00.000Z'&&first.estimated===false,'An exact calendar match saves its recorded arrival and event link');

  await page.locator('#trip-add').click();await page.locator('#trip-name').fill('No calendar match');await city(0,'arrival','Paris','Paris');await departure(0,'2027-03-01','10:00');await save();
  const unmatched=(await own()).trips.find(trip=>trip.name==='No calendar match').flights[0];
  check(unmatched.estimated===true&&!unmatched.link&&Date.parse(unmatched.arrival)>Date.parse(unmatched.departure),'No matching calendar event saves a calculated arrival');

  await page.locator('#trip-add').click();await page.locator('#trip-name').fill('Manual appointment');await city(0,'arrival','Paris','Paris');await departure(0,'2027-04-01','11:00');
  const draft={name:await page.locator('#trip-name').inputValue(),to:await page.locator('[data-place=arrival][data-index="0"]').inputValue(),date:await leg(0).locator('[data-field=departureDate]').inputValue()};
  let pickerStarted,pickerRelease;const pickerPending=new Promise(resolve=>pickerStarted=resolve),pickerWait=new Promise(resolve=>pickerRelease=resolve);holdRead={started:pickerStarted,wait:pickerWait};
  const loadingPicker=picker(0,'2027-02-10');await pickerPending;
  check(await page.locator('#trip-calendar-from').isDisabled()&&await page.locator('#trip-calendar-to').isDisabled()&&await page.locator('[data-trip-calendar="nina@example.test"]').isDisabled()&&!await page.locator('#trip-calendar-return').isDisabled(),'Calendar filters stay fixed while loading and Back remains available');
  pickerRelease();await loadingPicker;
  check(await row(ordinary.summary).count()===1,'The calendar picker lists ordinary appointments with special-event detection off');
  await page.locator('#trip-calendar-from').fill('2027-02-11');await page.locator('#trip-calendar-to').fill('2027-02-11');
  check(await page.locator('.trip-calendar-entry').count()===0,'Changing calendar date filters clears the previous appointments before another read');
  await page.locator('#trip-calendar-return').click();
  check(await page.locator('#trip-name').inputValue()===draft.name&&await page.locator('[data-place=arrival][data-index="0"]').inputValue()===draft.to&&await leg(0).locator('[data-field=departureDate]').inputValue()===draft.date,'Back to trip preserves the unfinished form');
  check((await own()).trips.length===2,'Opening and leaving the calendar picker saves nothing');
  await picker(0,'2027-02-10');await row(ordinary.summary).locator('[data-calendar-pick]').click();
  check(await leg(0).locator('[data-field=departureDate]').inputValue()==='2027-02-10'&&await leg(0).locator('[data-field=departureTime]').inputValue()==='10:00','Selecting an appointment prefills its departure date and time');
  check((await page.locator('[data-place=arrival][data-index="0"]').inputValue()).includes('London'),'A recognizable calendar route prefills its destination city');
  check((await own()).trips.length===2,'Selecting an appointment still requires Save');
  const editable=await leg(0).locator('[data-field=departureDate]').isEditable()&&await leg(0).locator('[data-field=departureTime]').isEditable();
  await departure(0,'2027-02-09','11:15');
  check(editable&&await leg(0).locator('[data-field=departureDate]').inputValue()==='2027-02-09'&&await leg(0).locator('[data-field=departureTime]').inputValue()==='11:15','A selected calendar appointment leaves departure date and time editable without resetting new values');
  await departure(0,'2027-02-10','10:00');
  await save();const imported=(await own()).trips.find(trip=>trip.name==='Manual appointment').flights[0];
  check(imported.link?.eventId===ordinary.id&&imported.arrival==='2027-02-10T13:20:00.000Z'&&!imported.estimated,'Manual selection keeps the ordinary appointment’s recorded arrival');

  await page.locator('#trip-add').click();await picker(0,'2027-02-10');
  check(await row(ordinary.summary).locator('[data-calendar-pick]').isDisabled(),'An appointment already saved as a flight cannot be imported twice');
  await page.locator('#trip-calendar-from').fill('2027-02-01');await page.locator('#trip-calendar-to').fill('2027-02-01');await page.locator('[data-trip-calendar="team@example.test"]').check();await page.locator('[data-trip-calendar="nina@example.test"]').uncheck();await page.locator('#trip-calendar-load').click();await row(shared.summary).waitFor();
  check(await row(shared.summary).locator('[data-calendar-pick]').isDisabled(),'A shared-calendar copy of a saved flight is also blocked as a duplicate');
  await page.setViewportSize({width:280,height:740});
  check(await page.locator('#trip-editor').evaluate(element=>element.scrollWidth<=element.clientWidth),'The narrow calendar picker has no horizontal overflow');await scan('trip-calendar-picker-narrow');
  const pickerHeight=await page.locator('#trip-editor').evaluate(element=>element.getBoundingClientRect().height);await page.locator('#trip-calendar-return').click();
  check(Math.abs(pickerHeight-await page.locator('#trip-editor').evaluate(element=>element.getBoundingClientRect().height))<1,'The calendar picker and trip form use the same fixed popup size');
  await page.locator('#trip-discard').click();await page.setViewportSize({width:514,height:900});

  await page.locator('#trip-add').click();await page.locator('#trip-name').fill('Missing calendar cities');await picker(0,'2027-02-11');await row(missing.summary).locator('[data-calendar-pick]').click();
  check(await page.locator('[data-place=arrival][data-index="0"]').inputValue()==='','An appointment without a recognizable route leaves the destination for the user to select');
  check((await own()).trips.length===3,'An appointment with missing city details is not silently saved');
  await city(0,'arrival','Paris','Paris');await save();const completed=(await own()).trips.find(trip=>trip.name==='Missing calendar cities').flights[0];
  check(completed.link?.eventId===missing.id&&completed.arrival==='2027-02-11T13:35:00.000Z'&&!completed.estimated,'Supplying a missing city preserves the selected calendar event and its recorded arrival');

  await page.locator('#trip-add').click();await page.locator('#trip-name').fill('Recorded flight seconds');await picker(0,'2027-02-13');await row(fractional.summary).locator('[data-calendar-pick]').click();await save();
  const precise=(await own()).trips.find(trip=>trip.name==='Recorded flight seconds').flights[0];
  check(precise.departure==='2027-02-13T08:00:30.000Z'&&precise.arrival==='2027-02-13T13:00:45.000Z'&&precise.link?.eventId===fractional.id&&!precise.estimated,'Selecting a timed appointment preserves its exact recorded seconds through Save');

  await page.locator('#trip-add').click();await page.locator('#trip-name').fill('All-day reservation');await picker(0,'2027-02-14');await row(allDay.summary).locator('[data-calendar-pick]').click();
  check(await leg(0).locator('[data-field=departureDate]').inputValue()==='2027-02-14'&&await leg(0).locator('[data-field=departureTime]').inputValue()==='','An all-day appointment prefills only its date and requires a departure time');
  await city(0,'arrival','Berlin','Berlin');await leg(0).locator('[data-field=departureTime]').fill('10:00');await leg(0).locator('[data-field=departureTime]').blur();await save();
  const dated=(await own()).trips.find(trip=>trip.name==='All-day reservation').flights[0];
  check(dated.estimated===true&&Date.parse(dated.arrival)>Date.parse(dated.departure),'An all-day appointment uses a route estimate instead of inventing recorded flight times');

  await page.locator('#trip-add').click();await picker(0,'2027-02-12');await row(draftEvent.summary).locator('[data-calendar-pick]').click();await page.locator('#trip-next').click();await picker(1,'2027-02-12');
  check(await row(draftEvent.summary).locator('[data-calendar-pick]').isDisabled(),'One unsaved trip cannot use the same calendar event for two flights');
  await page.locator('#trip-calendar-return').click();await page.locator('#trip-discard').click();

  await page.locator('#trip-add').click();await page.locator('#trip-name').fill('Connection origin check');await city(0,'arrival','New York','New York');await page.locator('[data-connection="0"]').check();await city(0,'arrival','Paris','Paris');
  check(await page.evaluate(()=>{const before=(a,b)=>!!(a&&b&&(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING));return before(document.querySelector('[data-calendar-flight="0"]'),document.querySelector('[data-place=departure][data-index="0"]'))&&before(document.querySelector('[data-calendar-flight="1"]'),document.querySelector('[data-place=arrival][data-index="0"]'))&&before(document.querySelector('[data-calendar-flight="1"]'),document.querySelector('[data-leg-fields="1"]'));}),'Each calendar import button appears above its flight’s city and departure fields');
  const via=await page.locator('[data-place=arrival][data-index="0"]').inputValue(),destination=await page.locator('[data-place=arrival][data-index="1"]').inputValue();
  await picker(1,'2027-02-12');await row(draftEvent.summary).locator('[data-calendar-pick]').click();
  check(await page.locator('#trip-calendar-picker').isVisible()&&(await page.locator('#trip-calendar-feedback').textContent()).includes('Change the connection city'),'Selecting a connecting flight from a different city is rejected inside the picker');
  await page.locator('#trip-calendar-return').click();
  check(await page.locator('[data-place=arrival][data-index="0"]').inputValue()===via&&await page.locator('[data-place=arrival][data-index="1"]').inputValue()===destination&&await leg(1).locator('[data-field=departureTime]').inputValue()==='','A rejected connecting flight leaves the chosen connection, destination and departure details unchanged');
  await page.locator('[data-place=arrival][data-index="0"]').fill('');await picker(1,'2027-02-12');await row(draftEvent.summary).locator('[data-calendar-pick]').click();
  check(!await page.locator('#trip-calendar-picker').isVisible()&&(await page.locator('[data-place=arrival][data-index="0"]').inputValue()).includes('London')&&(await page.locator('[data-place=arrival][data-index="1"]').inputValue()).includes('New York'),'A connecting flight may prefill an unset connection city without changing the final destination');
  check((await own()).trips.length===6,'Reviewing connected calendar flights never saves the trip implicitly');
  await page.locator('#trip-discard').click();await page.locator('#trips-close').click();
  const stats=await page.evaluate(()=>fetch('/__stats').then(response=>response.json()));check(stats.posts===0&&stats.patches.length===0&&stats.unsafeMethods===0&&stats.unchanged===9,'Calendar flight selection makes no calendar writes and preserves all 9 baseline events');
  check(errors.length===0,'No browser runtime errors');await page.unroute(pattern);if(scans.some(result=>result.violations.length))throw Error(JSON.stringify(scans));
  return {checks,scans,errors,calendarReads:reads.length,stats:{posts:stats.posts,patches:stats.patches,unchanged:stats.unchanged}};
}
