async page=>{
  const checks=[],check=(value,message)=>{if(!value)throw Error(message);checks.push(message);};
  page.setDefaultTimeout(15000);
  await page.goto('http://127.0.0.1:8893/?case=ready');
  await page.evaluate(()=>{localStorage.removeItem('slotdesk-v091-fixture:ready');});
  await page.reload();
  await page.evaluate(()=>{const key='slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'),s=JSON.parse(localStorage.getItem(key));s.settings.rescheduleFollowups=[{calendarId:'nina@example.test',eventId:'overlap',protectedTimes:[{start:'2026-10-20T06:20:00Z',end:'2026-10-20T06:30:00Z'}]},{calendarId:'unavailable@example.test',eventId:'unavailable',protectedTimes:[{start:'2026-10-20T06:20:00Z',end:'2026-10-20T06:30:00Z'}]}];localStorage.setItem(key,JSON.stringify(s));});
  await page.reload();if(await page.locator('#connect').isVisible())await page.locator('#connect').click();await page.locator('#home-meetings').waitFor();
  check(await page.locator('#workspace-home #reschedule-followups').count()===0,'Follow-ups are not inside the main menu');
  check(!(await page.locator('#workspace-home').innerText()).includes('Appointments to reschedule'),'Main menu has no follow-up heading or appointment rows');
  const before=Number(await page.locator('#alert-count').textContent());check(before>=2,'Pending follow-ups contribute to the bell count');
  await page.locator('#meeting-alerts').click();await page.locator('#view-reschedule-followups').waitFor();
  check((await page.locator('#alerts-list').innerText()).includes('2 appointments overlap'),'Alerts summarize both pending follow-ups');
  check(!(await page.locator('#alerts-list').innerText()).includes('No alerts need your attention'),'Pending follow-ups do not coexist with an empty-alert message');
  await page.locator('#view-reschedule-followups').click();await page.locator('#meetings-workspace').waitFor();
  check(!(await page.locator('#alerts-dialog').isVisible()),'View appointments closes alerts and opens Existing meetings');
  await page.locator('#reschedule-followups [data-followup="0"]').waitFor();
  check(await page.locator('#meetings-workspace #reschedule-followups').isVisible(),'The full list is located in Existing meetings');
  check(await page.locator('#reschedule-followups [data-followup="1"]').isDisabled(),'Unavailable calendars retain a disabled replacement action');
  await page.waitForFunction(()=>document.querySelector('#meetings-progress').textContent==='');
  await page.locator('#reschedule-followups [data-followup="0"]').click();await page.locator('#reschedule-body h3').filter({hasText:'Meeting with Alex'}).waitFor();
  check(await page.locator('#reschedule-dialog').isVisible(),'Replacement opens the correct appointment for review');
  await page.locator('#reschedule-close').click();
  const count=Number(await page.locator('#alert-count').textContent());await page.locator('#reschedule-followups [data-followup-dismiss="1"]').click();
  check(Number(await page.locator('#alert-count').textContent())===count-1,'Dismiss updates the bell immediately');
  await page.locator('#reschedule-followups [data-followup-dismiss="0"]').click();check(!(await page.locator('#reschedule-followups').isVisible()),'Empty follow-up lists disappear');
  await page.reload();if(await page.locator('#connect').isVisible())await page.locator('#connect').click();await page.locator('#home-meetings').waitFor();await page.locator('#meeting-alerts').click();
  check(await page.locator('#view-reschedule-followups').count()===0,'Dismissed follow-ups stay dismissed after reload');
  await page.locator('[data-close="alerts-dialog"]').click();
  for(const width of [320,514,1280]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Main menu has no overflow at '+width);}
  const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));
  check(!stats.posts&&!stats.patches.length&&!stats.unsafeMethods&&stats.unchanged===9,'Opening and dismissing follow-ups leaves all nine calendar events unchanged');
  await page.screenshot({path:'output/playwright/094-followups-home.png'});
  return {checks:checks.length,messages:checks,unchanged:stats.unchanged,calendarWrites:stats.posts+stats.patches.length};
}
