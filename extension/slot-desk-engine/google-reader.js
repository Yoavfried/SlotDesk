/* Read-only Google REST reader. Credentials and calendar data stay in memory. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./google-adapter.js'));else root.SlotGoogleReader=factory(root.SlotGoogle);})(typeof self!=='undefined'?self:this,function(G){
  'use strict';
  function apiError(status,reasons=[]){
    let message=`Google Calendar read failed (${status}).`;
    if(status===401)message+=' Sign in again with Connect Google.';
    else if(reasons.includes('accessNotConfigured')||reasons.includes('serviceDisabled'))message+=' Enable Google Calendar API in the app’s Google Cloud project.';
    else if(status===403&&!reasons.some(x=>/RateLimit|quota/i.test(x)))message+=' Check the granted read permissions and calendar sharing. A Workspace administrator may need to allow SlotDesk.';
    else if(status===404)message+=' This calendar is no longer accessible. Review its profile mapping.';
    else if(status===429||status===403)message+=' Google’s request limit was reached. Try again shortly.';
    else if(status>=500)message+=' Google is temporarily unavailable. Try again shortly.';
    const error=new Error(message);error.code=status;return error;
  }
  function createReader({getToken,invalidateToken=async()=>{},fetchImpl=globalThis.fetch,now=()=>Date.now(),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),random=Math.random,timeoutMs=20000,maxPages=100}){
    async function request(path,body){
      let refreshed=false,retries=0;
      for(;;){
        const token=await getToken();if(!token)throw new Error('Google sign-in required. Click Connect Google.');
        const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),timeoutMs);
        let response,data;
        try{
          response=await fetchImpl(`https://www.googleapis.com/calendar/v3/${path}`,{method:body?'POST':'GET',redirect:'error',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
          try{data=await response.json();}catch(_){if(response.ok)throw new Error('Google returned unreadable calendar data. Refresh and try again.');data={};}
        }catch(e){
          if(e.name==='AbortError')throw new Error('Google Calendar request timed out. Check your connection and refresh.');
          if(e instanceof TypeError)throw new Error('Google Calendar could not be reached. Check your connection and refresh.');
          throw e;
        }finally{clearTimeout(timeout);}
        if(response.ok){if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Google returned invalid calendar data.');return data;}
        const reasons=(Array.isArray(data.error?.errors)?data.error.errors:[]).map(x=>x.reason);
        if(response.status===401&&!refreshed){refreshed=true;await invalidateToken(token);continue;}
        const transient=response.status===429||response.status>=500||(response.status===403&&reasons.some(x=>/RateLimit|quota/i.test(x)));
        if(transient&&retries<2){await sleep(1000*2**retries+Math.floor(random()*250));retries++;continue;}
        throw apiError(response.status,reasons);
      }
    }
    function pageItems(data,kind){
      if(Array.isArray(data.items))return data.items;
      if(data.items===undefined&&data.kind===kind)return [];
      throw new Error('Google returned an incomplete calendar page. Refresh and try again.');
    }
    function nextPage(data,seen,page,limit=maxPages){
      const token=data.nextPageToken;if(!token)return undefined;
      if(typeof token!=='string'||seen.has(token)||page>=limit)throw new Error('Calendar pagination could not be completed. Narrow the date range and refresh.');
      seen.add(token);return token;
    }
    async function listCalendars(){
      const items=[],seen=new Set();let pageToken,page=0;
      do{const q=new URLSearchParams({maxResults:'250',...(pageToken?{pageToken}:{})}),r=await request(`users/me/calendarList?${q}`);items.push(...pageItems(r,'calendar#calendarList'));pageToken=nextPage(r,seen,++page);}while(pageToken);
      if(items.some(c=>!c||typeof c.id!=='string'))throw new Error('Google returned a calendar without an identifier.');
      return items.filter(c=>!c.deleted);
    }
    // Fetch a shared source once, then apply each participant’s own rules locally.
    async function readSource(calendar,range,{maxPages:pageLimit=maxPages}={}){
      const coverage={from:range.from,to:range.to,complete:false,fetchedAt:new Date(now()).toISOString(),maxAgeMinutes:5},items=[];let timeZone=calendar.timeZone;
      try{
        if(calendar.accessRole==='freeBusyReader'){
          const r=await request('freeBusy',{timeMin:range.from,timeMax:range.to,items:[{id:calendar.id}]}),data=r.calendars?.[calendar.id];
          if(!data||data.errors?.length||!Array.isArray(data.busy))throw new Error('Free/busy calendar unavailable. Check sharing and refresh.');
          if(data.busy.some(b=>!b||!/^\d{4}-.*(?:Z|[+-]\d{2}:\d{2})$/.test(b.start)||!/^\d{4}-.*(?:Z|[+-]\d{2}:\d{2})$/.test(b.end)||!Number.isFinite(Date.parse(b.start))||!Number.isFinite(Date.parse(b.end))||Date.parse(b.end)<=Date.parse(b.start)))throw new Error('Google returned invalid free/busy times.');
          return {calendarId:calendar.id,freeBusy:data.busy,coverage:{...coverage,complete:true},timeZone};
        }
        let pageToken,page=0;const seen=new Set();
        do{const q=new URLSearchParams({timeMin:range.from,timeMax:range.to,singleEvents:'true',orderBy:'startTime',maxResults:'2500',...(pageToken?{pageToken}:{})}),r=await request(`calendars/${encodeURIComponent(calendar.id)}/events?${q}`);items.push(...pageItems(r,'calendar#events'));timeZone=r.timeZone||timeZone;pageToken=nextPage(r,seen,++page,pageLimit);}while(pageToken);
        return {calendarId:calendar.id,items,timeZone,accessRole:calendar.accessRole,coverage:{...coverage,complete:true}};
      }catch(e){return {calendarId:calendar.id,items,timeZone,accessRole:calendar.accessRole,coverage:{...coverage,error:e.message},error:e.message};}
    }
    function normalizeSource(source,profile={}){
      if(source.freeBusy)return {calendar:'busy',busy:source.freeBusy.map(b=>{const identity=`freebusy:${source.calendarId}|${b.start}|${b.end}`;return {id:identity,identity,calendarId:source.calendarId,start:b.start,end:b.end,title:'Busy (free/busy interval)',detailsVisible:false,type:'default',override:profile.eventOverrides?.[identity]};}).filter(b=>b.override!=='ignore'),markers:[],coverage:source.coverage};
      const normalized=G.fromGoogle(source,profile.email||source.calendarId,{...profile,calendarId:source.calendarId,timeZone:source.timeZone});
      const complete=source.coverage.complete&&normalized.complete,error=source.error||(!normalized.complete?normalized.warnings.join('; '):undefined);
      return {...normalized,error,coverage:{...source.coverage,complete,error}};
    }
    async function readCalendar(calendar,range,profile={}){return normalizeSource(await readSource(calendar,range),profile);}
    return {listCalendars,readSource,normalizeSource,readCalendar};
  }
  return {createReader};
});
