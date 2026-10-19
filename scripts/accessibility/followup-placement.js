async page=>{
  const checks=[],check=(value,message)=>{if(!value)throw Error(message);checks.push(message);};page.setDefaultTimeout(15000);
  const pattern=/\/__google\/calendars\/nina%40example\.test\/events\?/;
  const handler=async route=>{const response=await route.fetch(),data=await response.json();for(const event of data.items||[])if(event.id==='review'){const id='sd'+'1'.repeat(32);event.iCalUID=id+'@google.com';event.extendedProperties={private:{slotdeskRequest:id}};}await route.fulfill({response,json:data});};
  await page.route(pattern,handler);
  try{
    await page.goto('http://127.0.0.1:8893/?case=ready');await page.evaluate(()=>localStorage.removeItem('slotdesk-v091-fixture:ready'));await page.reload();
    await page.evaluate(()=>{const key='slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'),s=JSON.parse(localStorage.getItem(key));s.settings.rescheduleFollowups=['nina@example.test','unavailable@example.test'].map((calendarId,i)=>({calendarId,eventId:i?'unavailable':'overlap',protectedTimes:[{start:'2026-10-20T06:00:00Z',end:'2026-10-20T06:45:00Z'}]}));localStorage.setItem(key,JSON.stringify(s));});
    await page.reload();if(await page.locator('#connect').isVisible())await page.locator('#connect').click();await page.locator('#home-meetings').waitFor();
    check(await page.locator('#workspace-home #reschedule-followups').count()===0,'Follow-ups remain outside the main menu');
    check(!(await page.locator('#workspace-home').innerText()).includes('Appointments to reschedule'),'Main menu has no appointment follow-up rows');
    check(Number(await page.locator('#alert-count').textContent())>=2,'Bell counts pending old appointments');await page.locator('#meeting-alerts').click();
    check((await page.locator('#alerts-list').innerText()).includes('2 existing appointments overlap with a new appointment that was created in SlotDesk. Would you like to reschedule one of them?'),'Alert uses the requested plural wording');
    check(await page.locator('#reschedule-old-appointment').textContent()==='Reschedule old appointment','Old appointment action uses the requested label');
    check(await page.locator('#reschedule-slotdesk-appointment').textContent()==='Reschedule SlotDesk appointment','SlotDesk appointment action uses the requested label');
    check(!(await page.locator('#alerts-list').innerText()).includes('Guest responses update when calendars'),'Old explanatory footer is removed');
    check((await page.locator('#alerts-list .alert-last-update').textContent()).startsWith('Last update:'),'Footer is labelled Last update');
    await page.locator('#reschedule-old-appointment').click();check((await page.locator('#alerts-list').innerText()).includes('Choose an old appointment'),'Multiple old appointments require an explicit choice');
    check(await page.locator('[data-alert-followup="1"]').isDisabled(),'Unavailable calendars have no actionable rescheduling target');
    await page.locator('[data-alert-followup="0"]').click();await page.locator('#reschedule-body h3').filter({hasText:'Meeting with Alex'}).waitFor();check(await page.locator('#reschedule-dialog').isVisible(),'Old action opens the older appointment');await page.locator('#reschedule-close').click();
    await page.locator('#meeting-alerts').click();await page.locator('#reschedule-slotdesk-appointment').click();await page.locator('#reschedule-body h3').filter({hasText:'Planning review'}).waitFor();check(await page.locator('#reschedule-dialog').isVisible(),'New action resolves a legacy alert to the actual SlotDesk appointment');await page.locator('#reschedule-close').click();
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'))).settings.rescheduleFollowups.every(item=>item.protectedTimes.every(time=>time.origin?.eventId==='review')));check(true,'Verified origin links persist for existing alerts');
    await page.locator('#meeting-alerts').click();check(!(await page.locator('#alerts-list .alert-last-update').textContent()).includes('Not checked yet'),'Last update reflects the successful calendar alert scan');check(await page.locator('#alerts-list > :last-child').getAttribute('class')==='muted alert-last-update','Last update appears at the bottom of alerts');
    for(const width of [320,514,1280]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.querySelector('#alerts-list').scrollWidth<=document.querySelector('#alerts-list').clientWidth),'Alert actions fit at '+width);}
    await page.locator('[data-close="alerts-dialog"]').click();await page.locator('#home-meetings').click();await page.locator('#meetings-workspace').waitFor();check(await page.locator('#meetings-workspace #reschedule-followups').isVisible(),'Follow-up details remain in Existing meetings');
    await page.waitForFunction(()=>document.querySelector('#meetings-progress').textContent==='');const count=Number(await page.locator('#alert-count').textContent());await page.locator('#reschedule-followups [data-followup-dismiss="1"]').click();check(Number(await page.locator('#alert-count').textContent())===count-1,'Dismiss immediately updates the bell');
    await page.locator('#reschedule-followups [data-followup-dismiss="0"]').click();check(!(await page.locator('#reschedule-followups').isVisible()),'Empty follow-up list disappears');
    await page.reload();if(await page.locator('#connect').isVisible())await page.locator('#connect').click();await page.locator('#home-meetings').waitFor();await page.locator('#meeting-alerts').click();check(await page.locator('#reschedule-old-appointment').count()===0,'Dismissal persists after reopening');
    const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));check(!stats.posts&&!stats.patches.length&&!stats.unsafeMethods&&stats.unchanged===9,'Both rescheduling entry points leave all nine events unchanged until confirmation');
    return {checks:checks.length,messages:checks,unchanged:stats.unchanged,calendarWrites:0};
  }finally{await page.unroute(pattern,handler);}
}
