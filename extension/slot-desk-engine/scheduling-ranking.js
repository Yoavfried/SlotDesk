(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotRanking=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const sum=values=>values.reduce((n,v)=>n+v,0),max=values=>Math.max(0,...values);
  function metrics(slot,profiles){
    const required=slot.people.filter(p=>p.required),own=required.filter(p=>profiles.find(x=>x.id===p.id)?.isOwnProfile),guests=required.filter(p=>!profiles.find(x=>x.id===p.id)?.isOwnProfile);
    const explicit=required.map(p=>p.explicitInconvenientMinutes||0),usual=guests.map(p=>p.usualInconvenientMinutes||0),distance=guests.map(p=>p.distance||0);
    slot.score={explicitMax:max(explicit),explicitTotal:sum(explicit),guestMax:max(usual),guestTotal:sum(usual),guestDistance:max(distance),guestDistanceTotal:sum(distance),ownUsual:sum(own.map(p=>p.usualInconvenientMinutes||0)),ownDistance:sum(own.map(p=>p.distance||0))};
    return slot;
  }
  function vector(slot,optional=true){const s=slot.score||{};return [slot.permissionTier||0,s.explicitMax||0,s.explicitTotal||0,s.guestMax||0,s.guestTotal||0,s.guestDistance||0,s.guestDistanceTotal||0,slot.requiredConflictCount?1:0,slot.rescheduleCount||0,slot.cost||0,slot.peopleHit||0,s.ownUsual||0,s.ownDistance||0,...(optional?[-(slot.optionalAttendance||0)]:[])];}
  function compareValues(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const difference=(a[i]||0)-(b[i]||0);if(difference)return difference;}return 0;}
  const quality=(a,b,optional=true)=>compareValues(vector(a,optional),vector(b,optional));
  const roundness=slot=>slot.anchorMinute%60===0?0:slot.anchorMinute%30===0?1:slot.anchorMinute%10===0?2:3;
  function compare(a,b){return quality(a,b)||roundness(a)-roundness(b)||Math.min(b.margin||0,60)-Math.min(a.margin||0,60)||a.start-b.start;}
  function band(minute){return minute>=360&&minute<720?'morning':minute<840&&minute>=720?'midday':minute>=840&&minute<1080?'afternoon':minute>=1080&&minute<1320?'evening':'night';}
  function precision(slots,automatic=true){
    if(!automatic)return slots;
    const byStart=new Map(slots.map(s=>[s.start,s]));
    return slots.filter(slot=>{
      if(slot.anchorMinute%10===0)return true;
      const neighbors=[byStart.get(slot.start-5*60000),byStart.get(slot.start+5*60000)].filter(s=>s&&s.day===slot.day&&s.anchorMinute%10===0);
      if(!slot.requiredConflictCount&&!neighbors.some(s=>!s.requiredConflictCount))return true;
      return neighbors.length>0&&neighbors.every(s=>quality(slot,s,false)<=0)&&slot.optionalAttendance>Math.max(...neighbors.map(s=>s.optionalAttendance));
    });
  }
  function category(slot){return [slot.outsideHours?1:0,slot.alternativeRank||0];}
  function select(slots,want=3,perDay=Infinity,{complement=false,profiles=[]}={}){
    const unique=[...new Map(slots.map(s=>[s.start+'|'+s.end+'|'+(s.alternativeRank||0),s])).values()];
    unique.sort((a,b)=>compareValues(category(a),category(b))||quality(a,b)||a.day.localeCompare(b.day)||compare(a,b));
    const out=[];
    const best=new Map();for(const slot of unique){const key=category(slot).join('|');if(!best.has(key))best.set(key,slot);}
    const group=s=>s.day+'|'+(s.alternativeRank||0)+'|'+band(s.anchorMinute);
    function fits(s,current=out){return current.every(x=>x.start!==s.start||x.end!==s.end)&&!current.some(x=>x.day===s.day&&(x.alternativeRank||0)===(s.alternativeRank||0)&&(x.start<s.end&&s.start<x.end))&&!current.some(x=>group(x)===group(s))&&current.filter(x=>x.day===s.day).length<perDay;}
    for(const slot of unique){if(out.length===want)break;if(quality(slot,best.get(category(slot).join('|')))!==0||!fits(slot))continue;out.push(slot);}
    if(complement&&want>1){
      const first=out[0],own=profiles.find(p=>p.isOwnProfile&&p.required!==false&&p.allowOverlap);
      if(first&&!first.requiredConflictCount&&first.score?.ownUsual>0&&own){
        const alternatives=unique.filter(s=>s.requiredConflictCount&&s.overrides?.every(c=>c.participants.every(id=>id===own.id))&&s.score.ownUsual<first.score.ownUsual&&compareValues(category(s),category(first))===0&&['explicitMax','explicitTotal','guestMax','guestTotal','guestDistance','guestDistanceTotal'].every(k=>s.score[k]<=first.score[k]));
        alternatives.sort((a,b)=>a.score.ownUsual-b.score.ownUsual||compare(a,b));
        const kept=out.length>=want?out.slice(0,-1):out,other=alternatives.find(s=>fits(s,kept));
        if(other&&!out.includes(other)){out.splice(0,out.length,...kept);out.splice(1,0,other);}
      }
    }
    return out;
  }
  return {metrics,quality,compare,select,precision,band,roundness};
});
