async page=>{
  const checks=[],errors=[],check=(v,label)=>{if(!v)throw Error(label);checks.push(label);};page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'))));
  await page.evaluate(()=>localStorage.clear());await page.reload();const baselineReads=(await page.evaluate(()=>fetch('/__stats').then(r=>r.json()))).reads;
  await page.getByRole('button',{name:'Connect Google',exact:true}).click();await page.locator('#calendar-scope-dialog').waitFor();
  check(await page.locator('#editor').isVisible()===false,'Workspace calendars precede own profile');check((await page.locator('#scope-step').textContent()).startsWith('01'),'Calendar step is numbered first');
  check(await page.locator('#scope-close').isHidden()&&await page.locator('#scope-discard').isHidden(),'Initial calendar confirmation cannot be dismissed');
  check(await page.evaluate(()=>document.querySelector('#scope-calendars').compareDocumentPosition(document.querySelector('.scope-explanation'))&Node.DOCUMENT_POSITION_FOLLOWING),'Calendar explanation is below the list');
  check((await page.evaluate(()=>fetch('/__stats').then(r=>r.json()))).reads===baselineReads,'No event reads before workspace selection');
  await page.locator('#scope-save').click();await page.locator('#editor').waitFor();await page.waitForFunction(()=>document.querySelector('#p-name').value==='Nina Example');
  check(true,'Own name comes from an exact-email organizer clue');check((await page.locator('#own-setup .eyebrow').textContent()).includes('02 / 03'),'Profile is step two');
  check((await saved()).settings.calendarScopeConfirmed===true,'Saved calendars persist before completion');
  await page.locator('#p-name').fill('My chosen name');await page.locator('#profile-continue').click();await page.locator('#suggestions-setup').waitFor();
  const partial=await saved();check(partial.settings.onboardingComplete===false&&partial.profiles.some(p=>p.name==='My chosen name'),'Confirmed profile retained while onboarding remains incomplete');
  await page.reload();await page.locator('#calendar-scope-dialog').waitFor();check(await page.locator('#scope-close').isHidden(),'Reload restarts required step one even with saved selection');
  check(await page.locator('[data-scope-calendar="nina@example.test"]').isChecked(),'Saved calendar choice prefills restarted step');
  await page.locator('#scope-save').click();await page.locator('#editor').waitFor();check(await page.locator('#p-name').inputValue()==='My chosen name','Restart preserves entered own-profile name');
  await page.locator('#profile-continue').click();await page.locator('#suggestions-setup').waitFor();await page.locator('#skip-profiles').click();await page.locator('#workspace-home').waitFor();
  check((await saved()).settings.onboardingComplete===true,'Final optional-people action completes all three steps');
  await page.reload();await page.locator('#workspace-home').waitFor();check(await page.locator('#calendar-scope-dialog').isHidden()&&await page.locator('#editor').isHidden(),'Completed users do not repeat onboarding');
  for(const width of [320,514,1280]){await page.setViewportSize({width,height:900});await page.locator('#settings-button').click();await page.locator('#edit-calendar-scope').click();check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Calendar picker reflows at '+width);check(await page.locator('#scope-discard').isVisible(),'Settings keeps Discard at '+width);await page.locator('#scope-discard').click();await page.locator('#settings-dialog [data-close="settings-dialog"]').click();}
  await page.evaluate(()=>localStorage.clear());await page.reload();await page.getByRole('button',{name:'Connect Google',exact:true}).click();await page.locator('#calendar-scope-dialog').waitFor();
  await page.route('**/__google/**',async route=>{if(new URL(route.request().url()).searchParams.get('fields')?.includes('displayName'))await new Promise(resolve=>setTimeout(resolve,1500));await route.continue();});
  await page.locator('#scope-save').click();await page.locator('#editor').waitFor();await page.locator('#p-name').fill('Entered while loading');await page.waitForTimeout(2000);
  check(await page.locator('#p-name').inputValue()==='Entered while loading','A late automatic name never replaces typing');
  await page.reload();await page.locator('#calendar-scope-dialog').waitFor();check(true,'Interrupting step two also restarts at calendars');
  const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));check(stats.posts===0&&stats.patches.length===0&&stats.unchanged===9&&stats.unsafeMethods===0,'Onboarding leaves all nine appointments unchanged');check(errors.length===0,'No runtime page errors');
  return {checks,errors,stats:{reads:stats.reads,posts:stats.posts,patches:stats.patches.length,unchanged:stats.unchanged,unsafeMethods:stats.unsafeMethods}};
}
