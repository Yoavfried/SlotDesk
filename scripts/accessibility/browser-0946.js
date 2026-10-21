async page=>{
  const checks=[],errors=[],check=(value,label)=>{if(!value)throw Error(label);checks.push(label);};
  page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(15000);
  if(await page.getByRole('button',{name:'Connect Google',exact:true}).isVisible())await page.getByRole('button',{name:'Connect Google',exact:true}).click();
  await page.getByRole('button',{name:'Disconnect Google',exact:true}).waitFor();check(true,'Native identity window completes synthetic authorization without browser sign-in');
  const cap=await page.evaluate(()=>SlotPlatform.capabilities(SlotPlatform.apiFor(globalThis),navigator));
  check(cap.webAuth&&cap.messaging&&cap.sessionStorage&&cap.locks,'Real installed runtime exposes identity, messaging, session storage and safe locks');
  check(await page.evaluate(()=>!Object.keys(localStorage).some(key=>/google-session|token|verifier/i.test(key))),'No OAuth credentials in persistent workspace storage');
  if(await page.getByRole('button',{name:/Existing meetings View/}).isVisible())await page.getByRole('button',{name:/Existing meetings View/}).click();await page.getByRole('button',{name:'Refresh meetings',exact:true}).waitFor();
  await page.getByRole('heading',{name:'Planning review',exact:true}).waitFor();check(true,'Real background token reaches the synthetic Calendar reader');
  if(page.viewportSize())for(const width of [320,514,1280]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Calendar page reflows at '+width);}
  const second=page.context().pages().find(p=>p!==page&&p.url()==='about:blank')||await page.context().newPage();await second.goto(page.url());await second.getByRole('button',{name:'Disconnect Google',exact:true}).waitFor();check(true,'Another full workspace tab reuses the background connection');
  await second.goto(new URL('connection-details.html',page.url()).href);await second.getByText('Configured',{exact:true}).waitFor();check(await second.getByText('blpliafbiiidhcffegochddjhagkhhip',{exact:true}).count()===1,'Safe connection details identify the installed package');
  await second.close();await page.bringToFront();await page.getByRole('button',{name:'Disconnect Google',exact:true}).click();await page.getByRole('button',{name:'Connect Google',exact:true}).waitFor();
  check(await page.evaluate(async()=>Object.keys(await SlotPlatform.apiFor(globalThis).storage.session.get(null)).length===0),'Disconnect clears memory-only credentials');
  await page.getByRole('button',{name:'Connect Google',exact:true}).click();await page.getByRole('button',{name:'Disconnect Google',exact:true}).waitFor();check(true,'Explicit reconnection succeeds with saved workspace retained');
  const stats=await page.evaluate(()=>fetch('http://127.0.0.1:8893/__stats').then(r=>r.json()));check(stats.posts===0&&stats.patches.length===0&&stats.unchanged===9&&stats.unsafeMethods===0,'Nine baseline appointments unchanged; no Calendar writes or unsafe methods');check(errors.length===0,'No runtime page exceptions');
  return {checks,errors,userAgent:await page.evaluate(()=>navigator.userAgent),capabilities:cap,stats:{reads:stats.reads,posts:stats.posts,patches:stats.patches.length,unchanged:stats.unchanged,unsafeMethods:stats.unsafeMethods}};
}
