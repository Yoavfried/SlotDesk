async page=>{
  const checks=[],scans=[],errors=[],check=(value,name)=>{if(!value)throw Error(name);checks.push(name);};
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
  const primaryName='SlotDesk disposable acceptance test with a deliberately long calendar name',teamName='Team calendar with a deliberately long name for narrow panels';
  await page.route('**/__google/**',async route=>{
    const response=await route.fetch(),data=await response.json(),url=decodeURIComponent(route.request().url());
    if(url.includes('users/me/calendarList'))for(const cal of data.items||[]){if(cal.primary)cal.summary=primaryName;if(cal.id==='team@example.test')cal.summary=teamName;}
    if(url.includes('/calendars/nina@example.test/events')&&Array.isArray(data.items))data.items.push(
      {id:'synthetic-doctor',summary:'Doctor appointment',start:{dateTime:'2026-10-20T13:00:00+03:00'},end:{dateTime:'2026-10-20T13:30:00+03:00'}},
      {id:'synthetic-day',summary:'Unclassified all-day appointment',start:{date:'2026-10-22'},end:{date:'2026-10-23'}}
    );
    await route.fulfill({response,json:data});
  });
  if(page.url().includes('127.0.0.1:8893'))await page.evaluate(()=>localStorage.removeItem('slotdesk-v091-fixture:ready'));
  await page.goto('http://127.0.0.1:8893/?case=ready');if(await page.locator('#connect').isVisible())await page.locator('#connect').click();
  await page.setViewportSize({width:514,height:900});
  await page.locator('#home-profiles').click();await page.locator('[data-profile-choice]').first().click();
  await page.locator('#profile-advanced > summary').click();await page.locator('#profile-manage-meetings > summary').click();
  await page.locator('#event-list [data-profile-treatment]').first().waitFor();
  check(await page.locator('#profile-meetings-calendars input:checked').count()===1,'All initially linked calendars are selected');
  await page.locator('#profile-manage-meetings .meeting-calendar-picker > summary').click();await page.locator('#profile-calendars-clear').click();
  await page.locator('#availability-calendars > summary').click();await page.locator('#add-mapping').click();await page.locator('#mapping-calendar').selectOption('team@example.test');
  await page.waitForFunction(()=>document.querySelectorAll('#profile-meetings-calendars input:checked').length===2);
  check(await page.locator('#profile-meetings-selected').textContent()==='2 selected','Linking a calendar immediately selects all linked calendars');
  await page.waitForFunction(()=>document.querySelector('#event-list').textContent.includes('Team session'));
  check(true,'Newly linked calendar meetings load in the same profile session');
  const beforeReads=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()).then(s=>s.reads));
  await page.locator('[data-profile-calendar="team@example.test"]').uncheck();
  check(!await page.locator('#event-list').textContent().then(t=>t.includes('Team session')),'Calendar filtering hides its meetings');
  await page.locator('[data-profile-calendar="team@example.test"]').check();
  check(await page.evaluate(()=>fetch('/__stats').then(r=>r.json()).then(s=>s.reads))===beforeReads,'Calendar filter changes reuse loaded data');
  await page.locator('[data-profile-calendar="team@example.test"]').uncheck();await page.locator('#load-profile-events').click();
  await page.waitForTimeout(250);check(await page.locator('#profile-meetings-calendars input:checked').count()===1,'Refresh preserves a deliberate calendar filter');
  await page.locator('#profile-manage-meetings > summary').click();await page.locator('#profile-manage-meetings > summary').click();
  await page.waitForFunction(()=>document.querySelectorAll('#profile-meetings-calendars input:checked').length===2);check(await page.locator('#profile-meetings-calendars input:checked').count()===2,'Reopening Manage meetings starts with all linked calendars');
  const entry=name=>page.locator('#event-list .meeting-entry').filter({has:page.getByRole('heading',{name,exact:true})});
  const doctor=entry('Doctor appointment').locator('[data-profile-treatment]'),day=entry('Unclassified all-day appointment').locator('[data-profile-treatment]');
  check(await page.locator('#event-list button[data-profile-treatment]').count()===0,'Treatment actions are selects, not four buttons');
  check(await doctor.locator('option').count()===4,'Ordinary meetings offer four mutually exclusive treatments');
  await page.locator('#profile-detection > summary').click();await page.locator('#p-detection').uncheck();
  await page.waitForFunction(()=>[...document.querySelectorAll('#event-list .meeting-entry')].find(e=>e.querySelector('h3')?.textContent==='Doctor appointment')?.querySelector('[data-profile-treatment] option:checked')?.textContent==='Default');
  await page.locator('#p-detection').check();
  await page.waitForFunction(()=>[...document.querySelectorAll('#event-list .meeting-entry')].find(e=>e.querySelector('h3')?.textContent==='Doctor appointment')?.querySelector('[data-profile-treatment] option:checked')?.textContent==='Default — protected');
  check(await doctor.inputValue()==='auto','Detected protection stays automatic, not a saved Protect override');
  await doctor.selectOption('ignore');await page.waitForTimeout(150);await page.locator('#p-detection').uncheck();
  check(await doctor.inputValue()==='ignore','Manual Ignore remains selected when detection changes');
  await doctor.selectOption('auto');await page.waitForTimeout(150);
  check(await doctor.locator('option:checked').textContent()==='Default','Default restores current detection behavior');
  await page.locator('[data-map-leave="0"]').check();
  await page.waitForFunction(()=>[...document.querySelectorAll('#event-list .meeting-entry')].find(e=>e.querySelector('h3')?.textContent==='Unclassified all-day appointment')?.querySelector('[data-profile-treatment] option:checked')?.textContent==='Default — leave');
  check(await day.inputValue()==='auto','Calendar all-day rule updates the selected automatic state');
  await day.selectOption('protected');await page.waitForTimeout(150);await page.locator('[data-map-leave="0"]').uncheck();
  check(await day.inputValue()==='protected','Explicit Protect remains selected when calendar leave rules change');
  await day.selectOption('auto');await page.waitForTimeout(150);
  check(await day.locator('option:checked').textContent()==='Default — all-day note','Default restores an unclassified all-day entry');
  async function rows(selector,label){
    const result=await page.locator(selector+' .calendar-picker-option').evaluateAll(els=>els.map(el=>{const input=el.querySelector('input'),name=el.querySelector('.calendar-option-name')||el.querySelector('span'),a=input.getBoundingClientRect(),b=name.getBoundingClientRect();return {row:a.right<=b.left&&a.top<b.bottom&&b.top<a.bottom,truncated:name.scrollWidth>name.clientWidth,title:name.title,full:name.textContent,overflow:el.scrollWidth>el.clientWidth};}));
    check(result.length>0&&result.every(r=>r.row&&!r.overflow),label+': checkbox and name stay in a row');
    check(result.every(r=>r.title===r.full),label+': full calendar names are available on hover');
  }
  for(const width of [280,320,514,1280]){await page.setViewportSize({width,height:900});await page.locator('#profile-manage-meetings .meeting-calendar-picker').evaluate(el=>el.open=true);await rows('#profile-meetings-calendars','Profile calendar list at '+width);check(!await page.locator('#editor').evaluate(el=>el.scrollWidth>el.clientWidth),'Profile controls fit at '+width);}
  await page.setViewportSize({width:390,height:900});await page.locator('#profile-manage-meetings').scrollIntoViewIfNeeded();await page.screenshot({path:'output/playwright/profile-meeting-controls.png'});
  const captions=await page.locator('#event-list .meeting-entry-time small').evaluateAll(els=>els.map(e=>({title:e.title,text:e.textContent,overflow:getComputedStyle(e).textOverflow,truncated:e.scrollWidth>e.clientWidth})));check(captions.every(c=>c.title===c.text&&c.overflow==='ellipsis'),'Meeting card calendar captions offer full hover text');check(captions.some(c=>c.truncated),'Long meeting card calendar captions stay on one line');
  if(!await page.evaluate(()=>window.axe))await page.addScriptTag({url:'http://127.0.0.1:8893/__axe.js'});
  const scan=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));scans.push({name:'profile meeting dropdowns',violations:scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});
  await page.locator('[data-remove-mapping="1"]').click();await page.waitForFunction(()=>document.querySelectorAll('#profile-meetings-calendars input').length===1);check(await page.locator('#profile-meetings-calendars input:checked').count()===1,'Unlinking a calendar removes it and selects the remaining linked calendar');
  await page.locator('[data-close=editor]').click();await page.locator('#profiles-workspace .back-home').click();await page.locator('#home-meetings').click();await page.locator('#meetings-workspace .meeting-calendar-picker').evaluate(el=>el.open=true);
  for(const width of [280,514,1280]){await page.setViewportSize({width,height:900});await rows('#meetings-calendars','Existing meetings calendar list at '+width);}
  await page.locator('#meetings-workspace .back-home').click();await page.locator('#settings-button').click();await page.locator('#edit-calendar-scope').click();
  await rows('#scope-calendars','Workspace calendar list');await page.locator('#scope-discard').click();await page.locator('[data-close=settings-dialog]').click();
  await page.locator('#home-new-meeting').click();await page.locator('#organizing-calendar').hover();check(await page.locator('#organizing-calendar').getAttribute('title')===await page.locator('#organizing-calendar option:checked').textContent(),'Closed calendar dropdown reveals its full selected name on hover');
  check(errors.length===0,'No application errors');const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));check(stats.posts===0&&stats.patches.length===0&&stats.altered.length===0&&stats.unchanged===9,'All original appointments remain unchanged; no calendar writes');
  await page.unroute('**/__google/**');if(scans.some(s=>s.violations.length))throw Error(JSON.stringify(scans));return {assertions:checks.length,checks,scans,unchangedAppointments:stats.unchanged,calendarWrites:stats.posts+stats.patches.length};
}
