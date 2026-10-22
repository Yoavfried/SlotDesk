async page=>{
  const checks=[],errors=[],check=(value,name)=>{if(!value)throw Error(name);checks.push(name);};
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  let mode='november';const pattern='**/__google/calendars/**/events?*';
  const busy=(id,start,end)=>({id,summary:'Scheduled appointment '+id,start:{dateTime:start,timeZone:'Asia/Jerusalem'},end:{dateTime:end,timeZone:'Asia/Jerusalem'}});
  await page.route(pattern,async route=>{
    if(!decodeURIComponent(new URL(route.request().url()).pathname).includes('nina@example.test'))return route.continue();
    const items=mode==='long'?[busy('occupied','2026-11-03T00:00:00+02:00','2026-12-01T00:00:00+02:00')]:Array.from({length:6},(_,d)=>Array.from({length:48},(_,i)=>{
      const date='2026-11-'+String(3+d).padStart(2,'0'),hour=String(8+Math.floor(i/4)).padStart(2,'0'),minute=String(i%4*15).padStart(2,'0'),end=String(i%4*15+12).padStart(2,'0');
      return busy(d+'-'+i,date+'T'+hour+':'+minute+':00+02:00',date+'T'+hour+':'+end+':00+02:00');
    })).flat();
    await route.fulfill({json:{items,timeZone:'Asia/Jerusalem'}});
  });
  async function prepare(long=false){
    await page.evaluate(long=>{
      const key='slotdesk-settings-v2:google:nina%40example.test',s=JSON.parse(localStorage.getItem(key)),p=s.profiles[0];
      const days=long?Object.fromEntries(Array.from({length:7},(_,d)=>[d,{on:true,s:'09:00',e:'18:00'}])):SlotWorkspace.schedule('sun-thu');
      Object.assign(p,{tz:'Asia/Jerusalem',tzLocation:undefined,days,manualDays:days,workingMode:'manual',templateDays:'sun-thu',ignoreWorkingHours:false,ignoreConvenience:false,allowOverlap:false});
      s.constraints=[];Object.assign(s.settings,{from:'2026-11-03',to:long?'2026-11-12':'2026-11-03',dateChoice:'custom',anchor:'Asia/Jerusalem',anchorLocation:undefined});
      localStorage.setItem(key,JSON.stringify(s));
    },long);
    await page.reload();await page.locator('#home-new-meeting').click();await page.locator('#meeting-title').fill('Scheduling review');await page.locator('#duration').fill('15');
    if(!long){await page.locator('#add-block').click();await page.locator('#block-from').fill('2026-11-03');await page.locator('#block-to').fill('2026-11-03');await page.locator('#block-from-time').fill('06:00');await page.locator('#block-to-time').fill('10:00');await page.locator('#block-form button[type=submit]').click();}
    await page.getByRole('button',{name:'Find a time',exact:true}).click();await page.locator('#results .slot-card').first().waitFor();
  }
  try{
    await page.setViewportSize({width:514,height:900});await prepare();
    let headings=await page.locator('#results .slot-card h3').allTextContents();
    check(headings.length===4,'One clear later choice plus three in-range compromises');
    check(headings[0].includes('Mon, 9 Nov, 09:00 - 09:15'),'Monday starts at 09:00 rather than 10:00');
    check(headings.slice(1).every(h=>h.includes('Tue, 3 Nov')),'Three compromises stay on the requested date');
    check(['10:00','12:00','14:00'].every((t,i)=>headings[i+1].includes(t)),'Only morning, midday and afternoon groups');
    check((await page.locator('#results .slot-card').first().textContent()).includes('Available'),'Featured later option has no known conflict');
    check(await page.locator('#more-options').isHidden(),'No additional later-date choices after the single featured choice');
    const card=page.locator('#results .slot-card').nth(1);
    for(const selector of ['.result-person-name','.result-person-zone','.result-person-time','.result-calendar summary','.proposal-warnings summary']){
      const target=card.locator(selector).first();
      await target.evaluate(el=>window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-200));
      const before=await page.evaluate(()=>scrollY);await target.click();await page.waitForTimeout(100);
      check(Math.abs((await page.evaluate(()=>scrollY))-before)<2,'Clicking '+selector+' does not jump the page');
      if(selector==='.result-calendar summary'){await target.press('Escape');await page.mouse.move(0,0);}
    }
    await page.locator('.search-timezone .timezone-trigger').evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-200));
    const beforeZone=await page.evaluate(()=>scrollY);await page.locator('.search-timezone .timezone-trigger').click();
    const search=page.locator('.search-timezone .timezone-panel input');
    for(let i=0;i<20;i++)await search.press('ArrowDown');
    check(Math.abs((await page.evaluate(()=>scrollY))-beforeZone)<2,'Timezone keyboard choices scroll their list rather than the page');
    check(await page.locator('.search-timezone .timezone-options').evaluate(el=>el.scrollTop>0),'Keyboard timezone results remain visible');
    await search.press('Escape');check(await page.locator('.search-timezone .timezone-trigger').evaluate(el=>el===document.activeElement),'Escape returns focus to timezone button');
    for(const width of [320,514,1280]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+width);}
    await page.setViewportSize({width:514,height:900});await page.locator('#results').screenshot({path:'output/playwright/search-selection-november.png'});

    mode='long';await prepare(true);check(await page.locator('#results .slot-card').count()===3,'Long all-conflict search starts with three dates');
    const first=await page.locator('#results .slot-card').first().elementHandle();
    await page.locator('#results .slot-card .proposal-warnings').first().evaluate(el=>el.open=true);
    const initial=await page.locator('#results .slot-card h3').allTextContents();
    let count=3;
    while(await page.locator('#more-options').isVisible()){
      await page.locator('#more-options').evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-200));
      const previousScroll=await page.evaluate(()=>scrollY);await page.locator('#more-options').click();await page.waitForTimeout(100);
      const next=await page.locator('#results .slot-card').count();
      check(next===Math.min(count+3,10),'Generate more appends the next three dates or the remainder');
      check(Math.abs((await page.evaluate(()=>scrollY))-previousScroll)<2,'Appending options preserves scroll position');count=next;
    }
    check(count===10,'All ten eligible dates become available');
    check(await first.evaluate(el=>el.isConnected),'Existing cards are not recreated');
    check(await page.locator('#results .slot-card .proposal-warnings').first().evaluate(el=>el.open),'Expanded warnings stay expanded');
    headings=await page.locator('#results .slot-card h3').allTextContents();
    check(JSON.stringify(headings.slice(0,3))===JSON.stringify(initial),'Existing options keep their order');
    check(new Set(headings.map(h=>h.split(', 09:')[0])).size===10,'Long ranges have one card per date');
    const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));
    check(stats.posts===0&&stats.patches.length===0&&stats.unsafeMethods===0&&stats.unchanged===9,'No Calendar writes; all nine baseline appointments unchanged');
    check(!errors.length,'No browser runtime errors');return {checks,headings};
  }finally{await page.unroute(pattern);}
}
