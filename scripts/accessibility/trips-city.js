async page=>{
  page.setDefaultTimeout(12000);
  const checks=[],scans=[],errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const check=(value,message)=>{if(!value)throw Error(message);checks.push(message);};
  const key='slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test');
  const own=()=>page.evaluate(storageKey=>{const state=JSON.parse(localStorage.getItem(storageKey));return state.profiles.find(profile=>profile.id===state.settings.ownProfileId);},key);
  const leg=index=>page.locator('[data-leg-fields="'+index+'"]');
  const city=async(index,side,query,name)=>{
    const input=page.locator('[data-place="'+side+'"][data-index="'+index+'"]');
    await input.fill(query);
    const list=input.locator('..').locator('[data-place-results="'+side+'"]');
    await list.locator('button').filter({hasText:name}).first().click();
  };
  const departure=async(index,date,time)=>{
    await leg(index).locator('[data-field=departureDate]').fill(date);
    await leg(index).locator('[data-field=departureTime]').fill(time);
    await leg(index).locator('[data-field=departureTime]').blur();
    await page.waitForFunction(()=>![...document.querySelectorAll('[data-match-note]')].some(el=>/Looking|Checking/.test(el.textContent)));
  };
  const save=async()=>{
    await page.locator('#trip-save').click();
    await page.locator('#trip-editor').waitFor({state:'hidden'});
  };
  const noArrivalInputs=async()=>check(await page.locator('#trip-editor input[data-field^="arrival"],#trip-editor select[data-field$="Zone"]').count()===0,'Flights never require arrival inputs or timezone selectors');
  const scan=async name=>{
    if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({url:'http://127.0.0.1:8893/__axe.js'});
    const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));
    scans.push({name,violations:result.violations.map(item=>({id:item.id,nodes:item.nodes.map(node=>node.target)}))});
  };

  await page.goto('http://127.0.0.1:8893/?case=ready');
  await page.evaluate(()=>localStorage.removeItem('slotdesk-v091-fixture:ready'));
  await page.reload();
  await page.locator('#connect').evaluate(element=>{if(!element.hidden&&!element.disabled)element.click();});
  await page.locator('#home-profiles').waitFor();
  await page.evaluate(storageKey=>{
    const state=JSON.parse(localStorage.getItem(storageKey)),profile=state.profiles.find(person=>person.id===state.settings.ownProfileId);
    profile.tz='America/Los_Angeles';
    profile.tzLocation=SlotTimezoneSearch.search([{value:profile.tz,label:profile.tz}],'San Francisco')[0].location;
    delete profile.tripTimezoneState;
    localStorage.setItem(storageKey,JSON.stringify(state));
  },key);
  await page.reload();
  await page.locator('#connect').evaluate(element=>{if(!element.hidden&&!element.disabled)element.click();});
  await page.locator('#home-profiles').click();
  await page.locator('[data-profile-travel]').first().click();
  await page.locator('#trip-add').click();
  check((await page.locator('[data-place=departure][data-index="0"]').inputValue()).includes('San Francisco'),'Origin prefills the selected profile city instead of another city sharing its timezone');
  check(await leg(0).locator('[data-field=departureDate]').isVisible()&&await leg(0).locator('[data-field=departureTime]').isVisible(),'Departure city, destination city, date and time appear immediately');
  await noArrivalInputs();
  await page.keyboard.press('Escape');
  check(await page.locator('#trip-editor').isVisible(),'Only Save or Discard exits the trip form');
  await page.locator('#trip-name').fill('San Francisco to New York');
  await departure(0,'2027-01-10','12:00');
  await page.locator('[data-place=arrival][data-index="0"]').fill('Unrecognized destination');
  await page.locator('#trip-save').click();
  check(await page.locator('#trip-editor').isVisible()&&(await own()).trips.length===0,'An unselected destination cannot create an incomplete trip');
  await city(0,'arrival','New York','New York');
  await departure(0,'2027-01-10','12:00');
  check((await page.locator('[data-arrival-note="0"]').textContent()).includes('Estimated arrival'),'Selecting a route and departure calculates a read-only arrival');
  await scan('city-flight-light');
  await save();
  let saved=(await own()).trips[0];
  check(saved.flights.length===1&&saved.flights[0].from.city==='San Francisco'&&saved.flights[0].to.city==='New York','A direct city route saves with both geographic endpoints');
  check(saved.flights[0].estimated&&Date.parse(saved.flights[0].arrival)>Date.parse(saved.flights[0].departure),'Calculated arrival is saved as an exact instant without manual entry');
  check(saved.flights[0].arrivalZone==='America/New_York'&&saved.flights[0].departureZone==='America/Los_Angeles','Selected cities supply the flight timezones');
  const previous=JSON.stringify(saved);
  await page.locator('[data-trip-edit]').click();
  await save();
  check(JSON.stringify((await own()).trips[0])===previous,'Opening and saving a complete trip preserves its exact flight details');
  await page.locator('[data-trip-edit]').click();
  await page.locator('#trip-name').fill('Discard this edit');
  await page.locator('#trip-discard').click();
  check(JSON.stringify((await own()).trips[0])===previous,'Discard leaves the saved trip unchanged');

  const fold=await page.evaluate(async()=>{
    const index=await SlotFlightLookup.load(),from=index.cities('San Francisco').find(city=>city.city==='San Francisco'),to=index.cities('New York').find(city=>city.city==='New York');
    const arrival='2026-11-01T06:30:00.000Z',minutes=index.estimate(from,to).minutes,departure=new Date(Date.parse(arrival)-minutes*60000).toISOString(),parts=SlotEngine.partsIn(Date.parse(departure),from.tz);
    return {arrival,departure,date:parts.ymd,time:String(parts.hh).padStart(2,'0')+':'+String(parts.mm).padStart(2,'0')};
  });
  await page.locator('#trip-add').click();
  await page.locator('#trip-name').fill('Arrival during clock change');
  await city(0,'arrival','New York','New York');
  await departure(0,fold.date,fold.time);
  await save();
  const clockChange=(await own()).trips.find(trip=>trip.name==='Arrival during clock change').flights[0];
  check(clockChange.arrival===fold.arrival&&clockChange.departure===fold.departure,'A calculated arrival in a repeated DST hour saves its exact occurrence without asking for an arrival choice');

  await page.locator('#trip-add').click();
  await page.locator('#trip-name').fill('Crossing the date line');
  await city(0,'departure','Auckland','Auckland');
  await city(0,'arrival','Honolulu','Honolulu');
  await departure(0,'2027-06-10','00:10');
  await save();
  const dateLine=(await own()).trips.find(trip=>trip.name==='Crossing the date line').flights[0];
  const localDates=await page.evaluate(flight=>({departure:SlotEngine.partsIn(Date.parse(flight.departure),flight.departureZone).ymd,arrival:SlotEngine.partsIn(Date.parse(flight.arrival),flight.arrivalZone).ymd}),dateLine);
  check(localDates.arrival<localDates.departure&&Date.parse(dateLine.arrival)>Date.parse(dateLine.departure),'Date-line travel can arrive on an earlier local date while preserving increasing flight instants');

  await page.locator('#trip-add').click();
  await page.locator('#trip-name').fill('London connection and return');
  await city(0,'arrival','Tel Aviv','Tel Aviv');
  await page.locator('[data-connection="0"]').check();
  await city(0,'arrival','London','London, United Kingdom');
  await departure(0,'2027-02-10','12:00');
  await departure(1,'2027-02-11','12:00');
  await noArrivalInputs();
  check((await page.locator('[data-place=arrival][data-index="1"]').inputValue()).includes('Tel Aviv'),'Adding a connection retains the original final destination');
  await page.locator('#trip-back').click();
  check((await page.locator('[data-place=arrival][data-index="2"]').inputValue()).includes('San Francisco'),'Flight back automatically uses the original departure city');
  await departure(2,'2027-02-15','10:00');
  check(!await page.locator('#trip-open-ended').isVisible(),'A return flight removes the open-ended timezone warning');
  await save();
  saved=(await own()).trips.find(trip=>trip.name==='London connection and return');
  check(saved.flights.length===3&&saved.flights[0].to.city==='London'&&saved.flights[1].from.city==='London'&&saved.flights[1].to.city==='Tel Aviv','Connection saves as origin to connection city to final destination');
  check(saved.flights[1].connection===true&&saved.flights[2].returnFlight===true,'Connection and return semantics survive saving');
  check(saved.flights.every((flight,index)=>!index||Date.parse(flight.departure)>=Date.parse(saved.flights[index-1].arrival)),'Calculated legs remain in chronological order');

  await page.setViewportSize({width:280,height:740});
  await page.locator('[data-trip-edit]').last().click();
  check(await page.locator('#trip-editor').evaluate(element=>element.scrollWidth<=element.clientWidth),'The narrow trip dialog has no horizontal overflow');
  const initialHeight=await page.locator('#trip-editor').evaluate(element=>element.getBoundingClientRect().height);
  await page.locator('[data-place=departure][data-index="0"]').fill('San');
  check(await page.locator('[data-place-results]:visible').count()>0,'City search opens its suggestions');
  check(Math.abs(initialHeight-await page.locator('#trip-editor').evaluate(element=>element.getBoundingClientRect().height))<1,'City suggestions overlay the form without resizing the dialog');
  await page.locator('#trip-name').click();
  check(await page.locator('[data-place-results]:visible').count()===0,'City suggestions close when focus leaves the search');
  await scan('city-flight-narrow');
  await page.locator('#trip-discard').click();
  await page.locator('#trips-close').click();
  const stats=await page.evaluate(()=>fetch('/__stats').then(response=>response.json()));
  check(stats.posts===0&&stats.patches.length===0&&stats.unsafeMethods===0&&stats.unchanged===9,'Trip actions leave all 9 calendar events unchanged and make no calendar writes');
  check(errors.length===0,'No browser runtime errors');
  if(scans.some(result=>result.violations.length))throw Error(JSON.stringify(scans));
  return {checks,scans,errors,stats:{posts:stats.posts,patches:stats.patches,unchanged:stats.unchanged}};
}
