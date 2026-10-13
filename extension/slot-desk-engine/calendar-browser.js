(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./calendar-view.js'));else root.SlotCalendarBrowser=factory(root.SlotCalendarView);})(typeof self!=='undefined'?self:this,function(V){
  'use strict';
  // Raw provider entries stay in this window's memory. The key deliberately omits
  // selected calendars and display timezone: both are local views of one date range.
  const key=(account,from,to)=>JSON.stringify([account,from,to]);
  function createCache({concurrency=3}={}){
    let current=null,generation=0;
    function clear(){generation++;current=null;}
    function snapshot(account,from,to){return current?.key===key(account,from,to)?current:null;}
    function load({account,from,to,calendars,reader,refresh=false,onUpdate=()=>{}}){
      if(!account||!reader)throw new Error('Connect Google Calendar to continue.');
      const range=V.bounds(from,to,'UTC'),cacheKey=key(account,from,to);
      if(!refresh&&current?.key===cacheKey)return current.promise||Promise.resolve(current);
      const token=++generation,target={key:cacheKey,account,from,to,calendars:[...new Map(calendars.map(c=>[c.id,c])).values()],sources:new Map(),done:false,loading:true};current=target;
      let next=0;
      const active=()=>current===target&&generation===token;
      const worker=async()=>{while(active()){
        const cal=target.calendars[next++];if(!cal)return;
        let source;try{source=await reader.readSource(cal,range.fetch,{maxPages:Infinity});}catch(error){source={calendarId:cal.id,items:[],coverage:{complete:false,error:error.message},error:error.message};}
        if(!active())return;
        target.sources.set(cal.id,{cal,source});onUpdate(target);
      }};
      target.promise=Promise.all(Array.from({length:Math.min(Math.max(1,concurrency),target.calendars.length)},worker)).then(()=>{if(active()){target.done=true;target.loading=false;onUpdate(target);}return target;}).finally(()=>{target.promise=null;});
      return target.promise;
    }
    function upsert(calendarId,event){const entry=current?.sources.get(calendarId);if(!entry||!event?.id||!Array.isArray(entry.source.items))return;entry.source={...entry.source,items:[...entry.source.items.filter(e=>e.id!==event.id),event]};}
    function applyTimes(calendarId,eventId,after){const entry=current?.sources.get(calendarId),event=entry?.source.items?.find(e=>e.id===eventId);if(event)upsert(calendarId,{...event,...after});}
    return {clear,snapshot,load,upsert,applyTimes};
  }
  function view(cache,selected,zone,calendars=cache.calendars){
    const range=V.bounds(cache.from,cache.to,zone),rows=[],issues=[],pending=[];
    const names=new Map(calendars.map(cal=>[cal.id,cal]));
    for(const id of new Set(selected)){
      const entry=cache.sources.get(id),cal=entry?.cal||names.get(id)||{id};
      if(!entry){if(cache.calendars.some(c=>c.id===id)&&!cache.done)pending.push(cal);else issues.push({cal,error:names.has(id)?'This calendar is not loaded for the cached dates. Select Refresh meetings to load it.':'This calendar is no longer accessible. Check sharing or remove it from the selection.'});continue;}
      const source=entry.source;
      if(Array.isArray(source.freeBusy)){
        for(const b of source.freeBusy){const time={start:Date.parse(b.start),end:Date.parse(b.end)};if(time.start<range.end&&time.end>range.start)rows.push({...time,cal,busyOnly:true,event:{summary:'Busy'},slotdesk:false});}
        issues.push({cal,busyOnly:true,error:'Your access shows busy times only. Meeting details and guest responses are unavailable.'});
        if(!source.coverage?.complete)issues.push({cal,error:source.error||source.coverage?.error||'Calendar data is incomplete.'});
      }else{
        const parsed=V.entries(source,range);rows.push(...parsed.rows.map(row=>({...row,cal})));
        if(!parsed.complete)issues.push({cal,error:source.error||source.coverage?.error||(parsed.invalid?parsed.invalid+' entries have unreadable dates.':'Calendar data is incomplete.')});
      }
    }
    rows.sort((a,b)=>a.start-b.start||a.end-b.end||String(a.event.summary||'').localeCompare(String(b.event.summary||''))||String(a.cal.id).localeCompare(String(b.cal.id)));
    return {rows,issues,pending,range,complete:!pending.length&&!issues.some(i=>!i.busyOnly)};
  }
  return {createCache,view,key};
});
