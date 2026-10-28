async page=>{
 const checks=[],errors=[],check=(v,n)=>{if(!v)throw Error(n);checks.push(n);};page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
 await page.addInitScript(()=>{Date.now=()=>Date.parse('2026-10-28T09:56:00Z');});
 const items=[];for(let day=0;day<21;day++)for(let q=0;q<48;q++){
  const start=Date.parse('2026-10-19T06:00:00Z')+day*86400000+q*900000;
  items.push({id:'busy-'+day+'-'+q,iCalUID:'busy-'+day+'-'+q+'@example.test',summary:'Busy '+day+' / '+q,status:'confirmed',transparency:'opaque',start:{dateTime:new Date(start).toISOString()},end:{dateTime:new Date(start+720000).toISOString()}});
 }
 items.push({id:'leave',iCalUID:'leave@example.test',summary:'Leave',status:'confirmed',transparency:'opaque',start:{date:'2026-10-29'},end:{date:'2026-10-31'}});
 await page.route('**/__google/calendars/**/events?*',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({items,timeZone:'UTC'})}));
 await page.goto('http://127.0.0.1:8893/?case=ready');
 await page.evaluate(()=>{const key='slotdesk-settings-v2:google:'+encodeURIComponent('nina@example.test'),s=JSON.parse(localStorage.getItem(key)),own={...SlotWorkspace.newProfile('nina@example.test','Organizer','Asia/Jerusalem'),tzConfirmed:true,calendarIds:[]},guest={...SlotWorkspace.newProfile('participant@example.test','Nina','Africa/Accra'),tzConfirmed:true,calendarIds:['nina@example.test'],leaveCalendarIds:['nina@example.test']};s.profiles=[own,guest];s.constraints=[];Object.assign(s.settings,{ownProfileId:own.id,onboardingComplete:true,calendarScopeConfirmed:true,workspaceCalendarIds:['nina@example.test'],defaultCalendar:'nina@example.test',defaultCalendarSelected:true,organizingCalendar:'nina@example.test',participantIds:[guest.id],manualParticipantIds:[],autoParticipantIds:[guest.id],removedAutomaticParticipantIds:[],guestProfiles:[],participantRules:{},dateChoice:'this',duration:45,from:'2026-10-28',to:'2026-10-31',anchor:'Asia/Jerusalem',reviewDraft:null});localStorage.setItem(key,JSON.stringify(s));});
 await page.reload();await page.locator('#connect').evaluate(el=>{if(!el.hidden&&!el.disabled)el.click();});await page.locator('#home-new-meeting').click();
 await page.getByRole('button',{name:'Find a time',exact:true}).click();await page.locator('#results .slot-card').first().waitFor();
 check(await page.locator('#results .slot-card').count()===1,'Screenshot case initially shows only the one clear after-work choice');
 check((await page.locator('#results .slot-card h3').textContent()).includes('20:00'),'The clear option is 20:00 Jerusalem / 18:00 Accra');
 check(!(await page.locator('#results').textContent()).includes('meeting overlaps'),'Initial screenshot case contains no overlapping alternative');
 await page.getByRole('button',{name:'Generate more options',exact:true}).click();
 check(await page.locator('#results .slot-card').count()===2,'Generate more reveals the remaining working-hours compromise');
 check((await page.locator('#results .slot-card').nth(1).textContent()).includes('3 meeting overlaps'),'The additional noon option discloses all three overlaps');
 await page.getByRole('button',{name:'Custom dates',exact:true}).click();await page.locator('#range-from').fill('2026-11-02');await page.locator('#range-to').fill('2026-11-06');
 await page.getByRole('button',{name:'Find a time',exact:true}).click();await page.locator('#results .slot-card').first().waitFor();
 const headings=await page.locator('#results .slot-card h3').allTextContents();
 check(headings.length===3,'Five eligible after-work dates initially yield three clear choices');
 check(headings[0].includes('2 Nov')&&headings[1].includes('4 Nov')&&headings[2].includes('6 Nov'),'Initial choices span the first, middle and last eligible dates');
 check(headings.every(s=>s.includes('20:00')),'Each date uses the earliest clear 18:00 Accra start');
 check(!(await page.locator('#results').textContent()).includes('meeting overlaps'),'Only clear choices are shown initially');
 await page.getByRole('button',{name:'Generate more options',exact:true}).click();
 const cards=page.locator('#results .slot-card'),more=await cards.locator('h3').allTextContents();
 check(JSON.stringify(more.slice(0,3))===JSON.stringify(headings),'Generating more preserves existing cards and order');
 check(more.length===6,'Generate more appends three choices');
 const firstFive=await cards.allTextContents();check(firstFive.slice(0,5).every(s=>!s.includes('meeting overlap')),'Remaining clear dates precede all overlapping alternatives');
 check(new Set(more.slice(0,5).map(s=>s.split(', 20:')[0])).size===5,'At most one clear after-work choice per date');
 check(more.every(s=>!s.includes('9 Nov')&&!s.includes('10 Nov')),'Clear in-range choices prevent later-date fallbacks');
 const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));check(stats.posts===0&&stats.patches.length===0&&stats.unchanged===9,'All nine baseline appointments remain unchanged; no calendar writes');
 check(errors.length===0,'No browser runtime errors');
 await page.setViewportSize({width:514,height:900});await page.locator('#results .slot-card').first().screenshot({path:'output/playwright/after-work-0956.png'});
 return {checks,errors,stats:{posts:stats.posts,patches:stats.patches.length,unchanged:stats.unchanged}};
}
