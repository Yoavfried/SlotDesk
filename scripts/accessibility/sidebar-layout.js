async page=>{
  const checks=[],scans=[],errors=[],measurements=[],check=(value,name)=>{if(!value)throw Error(name);checks.push(name);};
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
  await page.goto('http://127.0.0.1:8893/?case=ready');
  if(await page.locator('#connect').isVisible())await page.locator('#connect').click();
  const widths=[220,254,280,318,320,360,390,490,514,760,1280];
  let fontSize;
  for(const width of widths){
    await page.setViewportSize({width,height:900});
    const layout=await page.evaluate(()=>{
      const rect=selector=>document.querySelector(selector).getBoundingClientRect().toJSON(),scroller=document.getElementById('workspace-scroll');
      return {viewport:innerWidth,header:rect('header.bar'),brand:rect('.brand-wordmark'),actions:rect('.header-actions'),scroll:rect('#workspace-scroll'),font:getComputedStyle(document.querySelector('.brand-wordmark')).fontSize,overflow:scroller.scrollWidth>scroller.clientWidth,rootScroll:document.scrollingElement.scrollHeight>innerHeight+1,cards:[...document.querySelectorAll('.workspace-choice')].map(el=>({box:el.getBoundingClientRect().toJSON(),children:[...el.querySelectorAll('.menu-icon,strong,small,.action-arrow')].map(c=>c.getBoundingClientRect().toJSON())}))};
    });measurements.push(layout);fontSize??=layout.font;
    check(Math.abs(layout.header.right-width)<1,'Lime header reaches the viewport edge at '+width);
    check(layout.brand.bottom<=layout.actions.top+1||layout.brand.right<=layout.actions.left,'Logo and actions do not overlap at '+width);
    check(layout.font===fontSize,'Wordmark size remains fixed at '+width);
    check(!layout.overflow&&!layout.rootScroll,'Workspace has no horizontal/root scrolling at '+width);
    check(layout.scroll.top>=layout.header.bottom-1,'Workspace scrollbar starts below the header at '+width);
    check(layout.cards.every(c=>c.children.every(r=>r.left>=c.box.left&&r.right<=c.box.right+1)),'Home-card content stays inside its card at '+width);
    const before=layout.header;
    await page.locator('#workspace-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);
    check(await page.locator('header.bar').evaluate((el,before)=>Math.abs(el.getBoundingClientRect().top-before.top)<1,before),'Header stays in place while content scrolls at '+width);
    await page.locator('#workspace-scroll').evaluate(el=>el.scrollTop=0);
  }
  await page.setViewportSize({width:254,height:650});
  const initial=await page.locator('#settings-button').boundingBox();
  await page.locator('#home-new-meeting').click();
  const next=await page.locator('#settings-button').boundingBox();
  check(initial.x===next.x&&initial.y===next.y,'Header actions stay fixed between home and a scrolling page');
  await page.locator('#workspace-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);
  await page.locator('#meeting-workspace .back-home').click();
  check(await page.locator('#workspace-scroll').evaluate(el=>el.scrollTop)===0,'Navigation resets the workspace scroll position');
  await page.locator('#settings-button').click();
  if(await page.locator('#theme').getAttribute('aria-checked')!=='true')await page.locator('#theme').click();
  await page.locator('[data-close=settings-dialog]').click();
  await page.locator('#workspace-scroll').evaluate(el=>el.scrollTop=0);
  await page.waitForFunction(()=>!document.getAnimations().some(a=>a.playState==='running'));
  await page.screenshot({path:'output/playwright/sidebar-254-dark.png'});
  await page.setViewportSize({width:490,height:975});
  await page.screenshot({path:'output/playwright/sidebar-490-dark.png'});
  for(const width of [254,490]){
    await page.setViewportSize({width,height:975});
    if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({url:'http://127.0.0.1:8893/__axe.js'});
    const scan=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));
    scans.push({width,violations:scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),incomplete:scan.incomplete.map(v=>({id:v.id,count:v.nodes.length}))});
    check(!scan.violations.length,'No automated home accessibility violations at '+width);
  }
  const stats=await page.evaluate(()=>fetch('/__stats').then(r=>r.json()));
  check(stats.posts===0&&stats.patches.length===0&&stats.unsafeMethods===0&&stats.unchanged===9,'No calendar writes; nine baseline appointments unchanged');
  check(!errors.length,'No browser runtime errors');
  return {checks,scans,measurements,errors};
}
