/* Read-only Google REST reader. Credentials and calendar data stay in memory. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./google-adapter.js'),require('./recovery.js'));else root.SlotGoogleReader=factory(root.SlotGoogle,root.SlotRecovery);})(typeof self!=='undefined'?self:this,function(G,R){
  'use strict';
  function createReader({getToken,invalidateToken=async()=>{},fetchImpl=globalThis.fetch,now=()=>Date.now(),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),random=Math.random,timeoutMs=20000,maxPages=100}){
    let cooldown=0;
    async function pause(ms,signal){if(!signal)return sleep(ms);if(signal.aborted)throw R.network(null,{cancelled:true});let cancel;try{await Promise.race([sleep(ms),new Promise((_,reject)=>{cancel=()=>reject(R.network(null,{cancelled:true}));signal.addEventListener('abort',cancel,{once:true});})]);}finally{signal.removeEventListener('abort',cancel);}}
    async function request(path,body,signal){
      let refreshed=false,retries=0;
      for(;;){
        if(signal?.aborted)throw R.network(null,{cancelled:true});
        if(cooldown>now())throw R.issue('rate','Google is temporarily limiting requests. Try again after the current pause.',{retryAt:cooldown});
        const token=await getToken();if(signal?.aborted)throw R.network(null,{cancelled:true});if(!token)throw R.auth(null,false);
        const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),timeoutMs);
        const cancel=()=>controller.abort();signal?.addEventListener('abort',cancel,{once:true});
        let response,data;
        try{
          response=await fetchImpl(`https://www.googleapis.com/calendar/v3/${path}`,{method:body?'POST':'GET',redirect:'error',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
          try{data=await response.json();}catch(_){if(response.ok)throw new Error('Google returned unreadable calendar data. Refresh and try again.');data={};}
        }catch(e){
          if(e.name==='AbortError'||e instanceof TypeError)throw R.network(e,{cancelled:signal?.aborted,offline:typeof navigator!=='undefined'&&navigator.onLine===false});
          throw e;
        }finally{clearTimeout(timeout);signal?.removeEventListener('abort',cancel);}
        if(response.ok){if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Google returned invalid calendar data.');return data;}
        const reasons=(Array.isArray(data.error?.errors)?data.error.errors:[]).map(x=>x.reason);
        if(response.status===401&&!refreshed){refreshed=true;await invalidateToken(token);continue;}
        const error=R.provider(response.status,reasons,{retryAfter:response.headers?.get?.('retry-after'),now:now()});
        if(error.kind==='rate')cooldown=Math.max(cooldown,error.retryAt||now()+1000*2**retries);
        const wait=Math.max(1000*2**retries+Math.floor(random()*250),(error.retryAt||0)-now());
        if(error.retryable&&retries<2&&wait<=10000){await pause(wait,signal);if(error.kind==='rate')cooldown=0;retries++;continue;}
        throw error;
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
    async function listCalendars({signal}={}){
      const items=[],seen=new Set();let pageToken,page=0;
      do{const q=new URLSearchParams({maxResults:'250',...(pageToken?{pageToken}:{})}),r=await request(`users/me/calendarList?${q}`,null,signal);items.push(...pageItems(r,'calendar#calendarList'));pageToken=nextPage(r,seen,++page);}while(pageToken);
      if(items.some(c=>!c||typeof c.id!=='string'))throw new Error('Google returned a calendar without an identifier.');
      return items.filter(c=>!c.deleted);
    }
    async function suggestOwnName(email,selectedCalendars,{signal}={}){
      const key=String(email||'').trim().toLowerCase();if(!key)return '';
      const list=selectedCalendars.filter(c=>c.accessRole!=='freeBusyReader').sort((a,b)=>Number(b.id===email)-Number(a.id===email)).slice(0,3);
      for(const calendar of list){
        if(signal?.aborted)return '';
        try{
          const q=new URLSearchParams({timeMin:new Date(now()-30*86400000).toISOString(),timeMax:new Date(now()+30*86400000).toISOString(),singleEvents:'true',orderBy:'startTime',maxResults:'100',fields:'kind,items(status,organizer(email,displayName),attendees(email,displayName))'});
          const data=await request(`calendars/${encodeURIComponent(calendar.id)}/events?${q}`,null,signal),names=new Map();
          for(const event of pageItems(data,'calendar#events')){
            if(event.status==='cancelled')continue;
            for(const person of [event.organizer,...(Array.isArray(event.attendees)?event.attendees:[])]){
              const name=typeof person?.displayName==='string'?person.displayName.trim():'';
              if(String(person?.email||'').trim().toLowerCase()!==key||!name||name.includes('@')||name.length>200||/[\u0000-\u001f\u007f]/.test(name))continue;
              names.set(name,(names.get(name)||0)+1);
            }
          }
          if(names.size)return [...names].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0][0];
        }catch{/* Optional name hints never block setup or establish calendar coverage. */}
      }
      return '';
    }
    // Fetch a shared source once, then apply each participant’s own rules locally.
    async function readSource(calendar,range,{maxPages:pageLimit=maxPages,signal}={}){
      const coverage={from:range.from,to:range.to,complete:false,fetchedAt:new Date(now()).toISOString(),maxAgeMinutes:5},items=[];let timeZone=calendar.timeZone;
      try{
        if(calendar.accessRole==='freeBusyReader'){
          const r=await request('freeBusy',{timeMin:range.from,timeMax:range.to,items:[{id:calendar.id}]},signal),data=r.calendars?.[calendar.id];
          if(!data||data.errors?.length||!Array.isArray(data.busy))throw new Error('Free/busy calendar unavailable. Check sharing and refresh.');
          if(data.busy.some(b=>!b||!/^\d{4}-.*(?:Z|[+-]\d{2}:\d{2})$/.test(b.start)||!/^\d{4}-.*(?:Z|[+-]\d{2}:\d{2})$/.test(b.end)||!Number.isFinite(Date.parse(b.start))||!Number.isFinite(Date.parse(b.end))||Date.parse(b.end)<=Date.parse(b.start)))throw new Error('Google returned invalid free/busy times.');
          return {calendarId:calendar.id,freeBusy:data.busy,coverage:{...coverage,complete:true},timeZone};
        }
        let pageToken,page=0;const seen=new Set();
        do{const q=new URLSearchParams({timeMin:range.from,timeMax:range.to,singleEvents:'true',orderBy:'startTime',maxResults:'2500',...(pageToken?{pageToken}:{})}),r=await request(`calendars/${encodeURIComponent(calendar.id)}/events?${q}`,null,signal);items.push(...pageItems(r,'calendar#events'));timeZone=r.timeZone||timeZone;pageToken=nextPage(r,seen,++page,pageLimit);}while(pageToken);
        return {calendarId:calendar.id,items,timeZone,accessRole:calendar.accessRole,coverage:{...coverage,complete:true}};
      }catch(e){return {calendarId:calendar.id,items,timeZone,accessRole:calendar.accessRole,coverage:{...coverage,error:e.message},error:e.message,failure:R.metadata(e)};}
    }
    function normalizeSource(source,profile={}){
      if(source.freeBusy)return {calendar:'busy',busy:source.freeBusy.map(b=>{const identity=`freebusy:${source.calendarId}|${b.start}|${b.end}`;return {id:identity,identity,calendarId:source.calendarId,start:b.start,end:b.end,title:'Busy (free/busy interval)',detailsVisible:false,type:'default',override:profile.eventOverrides?.[identity]};}).filter(b=>b.override!=='ignore'),markers:[],coverage:source.coverage};
      const normalized=G.fromGoogle(source,profile.email||source.calendarId,{...profile,calendarId:source.calendarId,timeZone:source.timeZone});
      const complete=source.coverage.complete&&normalized.complete,error=source.error||(!normalized.complete?normalized.warnings.join('; '):undefined);
      return {...normalized,error,failure:source.failure,coverage:{...source.coverage,complete,error}};
    }
    async function readCalendar(calendar,range,profile={}){return normalizeSource(await readSource(calendar,range),profile);}
    return {listCalendars,suggestOwnName,readSource,normalizeSource,readCalendar};
  }
  return {createReader};
});
