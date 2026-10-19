async page=>{
  page.setDefaultTimeout(10000);const checks=[],scans=[];const check=(v,n)=>{if(!v)throw Error(n);checks.push(n);};
  const store=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'))));
  const wait=fn=>page.waitForFunction(fn);
  try{
    await page.evaluate(()=>localStorage.removeItem('slotdesk-v091-fixture:ready'));await page.goto('http://127.0.0.1:8893/?case=ready');if(await page.locator('#connect').isVisible())await page.locator('#connect').click();await page.locator('#home-new-meeting').waitFor({state:'visible'});
    await page.setViewportSize({width:390,height:900});await page.evaluate(()=>document.fonts.ready);
    check(await page.evaluate(()=>document.fonts.check('400 24px "DM Sans"')),'Bundled DM Sans loads');
    const pos=()=>page.locator('#settings-button').evaluate(el=>el.getBoundingClientRect().x),home=await pos();
    check(await page.locator('#home-meetings .menu-icon svg').count()===1&&await page.locator('#home-profiles .menu-icon svg').count()===1,'Main menu uses calendar and people icons');
    check(await page.locator('#home-profiles').textContent().then(t=>t.includes('add flights')),'Menu describes flights');
    check(await page.locator('#home-meetings').textContent().then(t=>t.includes('reschedule')),'Menu describes rescheduling');
    await page.locator('#home-new-meeting').click();check(Math.abs(await pos()-home)<1,'Header does not shift on long page');
    check(await page.locator('#meeting-workspace .back-home .action-arrow').count()===1,'Back action uses drawn arrow');
    check(await page.locator('#meeting-workspace h1').evaluate(el=>getComputedStyle(el).fontWeight)==='400','Page headline uses regular weight');
    await page.locator('#meeting-workspace .back-home').click();await page.locator('#home-profiles').click();check(Math.abs(await pos()-home)<1,'Header remains fixed on Manage profiles');
    await page.locator('[data-profile-choice]').first().click();check(await page.locator('#editor-title').textContent()==='Edit your profile','Own editor uses a sentence-case heading');
    check(await page.locator('#p-email').isDisabled(),'Own email is disabled');check(!await page.locator('#profile-context').isVisible(),'Generic autosave explanation is removed');
    const chevron=await page.locator('#p-zone').evaluate(el=>{const trigger=el._zonePicker.trigger,icon=trigger.querySelector('svg'),box=trigger.getBoundingClientRect();return {right:box.right-icon.getBoundingClientRect().right,present:!!icon};});check(chevron.present&&chevron.right<20,'Timezone chevron sits at the right edge');
    check(!await page.locator('#availability-calendars').evaluate(el=>el.open),'Availability calendars starts collapsed');
    await page.locator('#availability-calendars > summary').click();
    check(await page.locator('#mapping-list [data-map-calendar]').count()===0,'Selected calendars are not permanent dropdowns');
    check(await page.locator('#mapping-list [data-map-leave]').isVisible(),'Leave checkbox is directly visible');
    check(await page.locator('#profile-advanced > summary').textContent()==='More settings','More settings is a separate expandable');
    await page.locator('#p-no-calendar').check();check(!await page.locator('#mapping-controls').isVisible(),'No-access choice hides every mapping control');
    check(await page.locator('#mapping-coverage').textContent()==='Calendar availability will remain unconfirmed. You can still invite this profile.','No-access explanation matches requested wording');
    await wait(()=>JSON.parse(localStorage.getItem('slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'))).profiles[0].calendarIds.length===0);
    await page.locator('#p-no-calendar').uncheck();check(await page.locator('#add-mapping').textContent()==='Add calendar','Unchecked choice shows Add calendar');
    await page.locator('[data-close=editor]').click();await page.locator('[data-profile-choice]').first().click();await page.locator('#availability-calendars > summary').click();
    check(await page.locator('#p-no-calendar').isChecked(),'Leaving without selecting a calendar returns to no-access');
    await page.locator('#p-no-calendar').uncheck();await page.locator('#add-mapping').click();
    const options=await page.locator('#mapping-calendar option').evaluateAll(list=>list.map(el=>el.value).filter(Boolean));check(options.includes('nina@example.test')&&options.includes('team@example.test')&&!options.includes('guest@example.test'),'Picker only lists selected workspace calendars');
    await page.locator('#mapping-calendar').selectOption('nina@example.test');await wait(()=>JSON.parse(localStorage.getItem('slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'))).profiles[0].calendarIds.includes('nina@example.test'));
    check(!await page.locator('#mapping-picker').isVisible(),'Choosing a calendar commits it and removes the dropdown');
    check(await page.locator('#add-mapping').textContent()==='Add another calendar','Further calendar button uses requested wording');
    await page.locator('#add-mapping').click();await page.locator('#mapping-calendar').selectOption('team@example.test');await wait(()=>JSON.parse(localStorage.getItem('slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'))).profiles[0].calendarIds.length===2);
    await page.locator('[data-close=editor]').click();await page.locator('#profile-search').fill('person2@example.test');await page.locator('[data-profile-choice]').click();
    await page.locator('#p-email').fill('invalid');await page.locator('#p-name').click();check(await page.locator('#p-email').inputValue()==='person2@example.test','Invalid saved email reverts on leaving the field');
    await wait(()=>JSON.parse(localStorage.getItem('slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'))).settings.profileAlerts?.length>0);
    await page.locator('[data-close=editor]').click();await page.locator('#meeting-alerts').click();check((await page.locator('#alerts-list').textContent()).includes('Restored person2@example.test'),'Email restoration is recorded in the bell');await page.locator('[data-close=alerts-dialog]').click();
    await page.locator('#create-profile').click();await page.locator('#p-email').fill('not-email');await page.locator('#profile-continue').click();check(await page.locator('#editor').evaluate(el=>el.open),'Invalid new email cannot finish creation');check(!(await store()).profiles.some(p=>p.email==='not-email'),'Invalid new profile is never persisted');
    await page.locator('#p-email').fill('new.profile@example.test');await page.locator('#p-name').fill('New profile');await page.locator('#profile-continue').click();check(await page.locator('#editor').evaluate(el=>el.open),'New profile also requires a confirmed timezone');if(!await page.locator('#editor .timezone-panel:not([hidden]) input').isVisible())await page.locator('#p-zone').evaluate(el=>el._zonePicker.trigger.click());await page.locator('#editor .timezone-panel:not([hidden]) input').fill('UTC');await page.locator('#editor').getByRole('option',{name:'UTC — Coordinated Universal Time',exact:true}).click();await page.locator('#profile-continue').click();await page.locator('#editor').waitFor({state:'hidden'});check((await store()).profiles.some(p=>p.email==='new.profile@example.test'),'Valid new profile is explicitly created');
    await page.locator('#settings-button').click();await page.locator('#edit-calendar-scope').click();await page.locator('.scope-calendar-row').filter({hasText:'Team calendar for scheduling'}).locator('input[type=checkbox]').uncheck();await page.locator('#scope-save').click();await page.locator('#settings-dialog').waitFor({state:'visible'});await page.locator('[data-close=settings-dialog]').click();
    let data=await store();check(data.profiles[0].calendarIds.includes('nina@example.test')&&!data.profiles.some(p=>p.calendarIds.includes('team@example.test')),'Deselecting a calendar removes its mappings and keeps other calendars');
    await page.locator('#settings-button').click();await page.locator('#edit-calendar-scope').click();await page.locator('.scope-calendar-row').filter({has:page.locator('[data-scope-calendar="nina@example.test"]')}).locator('input[type=checkbox]').uncheck();await page.locator('.scope-calendar-row').filter({hasText:'Team calendar for scheduling'}).locator('input[type=checkbox]').check();await page.locator('#scope-save').click();await page.locator('#settings-dialog').waitFor({state:'visible'});await page.locator('[data-close=settings-dialog]').click();
    data=await store();check(data.profiles[0].calendarIds.length===0,'Removing the last linked calendar clears the profile mapping');
    await page.locator('#profile-search').fill('nina@example.test');await page.locator('[data-profile-choice]').click();await page.locator('#availability-calendars > summary').click();check(await page.locator('#p-no-calendar').isChecked(),'Removing the last linked calendar checks no-access');await page.locator('[data-close=editor]').click();
    for(const width of [320,390,600,1280]){await page.setViewportSize({width,height:900});check(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'No horizontal overflow at '+width);}
    const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));check(stats.posts===0&&stats.patches.length===0&&stats.altered.length===0,'All existing synthetic appointments remain unchanged');
    await page.screenshot({path:'output/playwright/0935-profiles.png'});return {checks,scans};
  }catch(error){throw Error(JSON.stringify({error:error.message,checks,scans}));}
}
