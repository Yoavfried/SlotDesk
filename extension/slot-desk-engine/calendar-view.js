(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./slotdesk-engine.js'));else root.SlotCalendarView=factory(root.SlotEngine);})(typeof self!=='undefined'?self:this,function(E){
  'use strict';
  function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;}
  function bounds(from,to,zone){
    if(!validDate(from)||!validDate(to)||to<from)throw new Error('Choose valid increasing dates.');
    const start=E.startOfDay(from,zone),end=E.startOfDay(E.addDaysYmd(to,1),zone);
    if(!Number.isFinite(start)||!Number.isFinite(end))throw new Error('Choose a valid timezone.');
    // Padding captures all-day entries in calendars with a different timezone. Filter below uses date semantics.
    return {from,to,zone,start,end,fetch:{from:new Date(start-2*86400000).toISOString(),to:new Date(end+2*86400000).toISOString()}};
  }
  function slotdeskEvent(event){const marker=event.extendedProperties?.private?.slotdeskRequest;return /^sd[a-f0-9]{32}$/.test(marker||'')&&(event.id===marker||event.iCalUID===marker+'@google.com');}
  function response(value){return ({accepted:'Yes',tentative:'Maybe',declined:'No',needsAction:'No reply'})[value]||'Unknown response';}
  function interval(event,zone){
    if(event.start?.date&&event.end?.date){
      if(!validDate(event.start.date)||!validDate(event.end.date)||event.end.date<=event.start.date)return null;
      return {allDay:true,from:event.start.date,to:E.addDaysYmd(event.end.date,-1),start:E.startOfDay(event.start.date,zone),end:E.startOfDay(event.end.date,zone)};
    }
    const s=event.start?.dateTime,e=event.end?.dateTime;
    if(typeof s!=='string'||typeof e!=='string'||!validDate(s.slice(0,10))||!validDate(e.slice(0,10))||!/(?:Z|[+-]\d\d:\d\d)$/i.test(s)||!/(?:Z|[+-]\d\d:\d\d)$/i.test(e))return null;
    const start=Date.parse(s),end=Date.parse(e);return Number.isFinite(start)&&Number.isFinite(end)&&end>start?{allDay:false,start,end}:null;
  }
  function entries(source,range){
    const rows=[],seen=new Set();let invalid=0;
    for(const event of source.items||[]){
      if(!event||typeof event!=='object'){invalid++;continue;}
      if(event.status==='cancelled')continue;
      const time=interval(event,range.zone);if(!time){invalid++;continue;}
      const included=time.allDay?time.from<=range.to&&time.to>=range.from:time.start<range.end&&time.end>range.start;
      if(!included)continue;
      const key=event.id||JSON.stringify([event.summary,time.start,time.end]);if(seen.has(key))continue;seen.add(key);
      rows.push({event,...time,slotdesk:slotdeskEvent(event)});
    }
    rows.sort((a,b)=>a.start-b.start||a.end-b.end||String(a.event.summary||'').localeCompare(String(b.event.summary||'')));
    return {rows,invalid,complete:!!source.coverage?.complete&&!invalid};
  }
  function week(date,zone){if(!validDate(date))throw new Error('Choose a valid date.');const wd=E.partsIn(E.startOfDay(date,zone)+12*3600000,zone).wd,from=E.addDaysYmd(date,-(zone==='Asia/Jerusalem'?wd:(wd+6)%7));return {from,to:E.addDaysYmd(from,6),zone};}
  function phase(row,now=Date.now()){return row.end<=now?'Past':row.start<=now?'In progress':'';}
  return {week,phase,validDate,bounds,slotdeskEvent,response,interval,entries};
});
