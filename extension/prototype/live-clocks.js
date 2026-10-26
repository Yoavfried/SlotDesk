(function(root){
  'use strict';
  root.SlotLiveClocks={create({people,clock,zone,format,onTick=()=>{},now=()=>Date.now(),document:doc=root.document,setTimer=root.setTimeout.bind(root),clearTimer=root.clearTimeout.bind(root)}){
    let timer=null,stopped=false;
    function update(){const instant=now(),list=people();for(const node of doc.querySelectorAll('[data-person-now]')){const p=list.find(p=>p.id===node.dataset.personNow);if(!p?.tzConfirmed)continue;try{const local=zone(p,instant),label=format(p,local)+' · '+clock(instant,local.tz)+' now';if(node.textContent!==label)node.textContent=label;node.title=label;}catch(_){node.textContent='Local time unavailable';}}}
    function tick(){clearTimer(timer);if(stopped)return;if(!doc.hidden){onTick();update();}timer=setTimer(tick,60000-now()%60000+20);}
    function wake(){if(!doc.hidden)tick();}
    doc.addEventListener('visibilitychange',wake);root.addEventListener?.('focus',wake);root.addEventListener?.('pageshow',wake);tick();
    return {update,stop(){stopped=true;clearTimer(timer);doc.removeEventListener('visibilitychange',wake);root.removeEventListener?.('focus',wake);root.removeEventListener?.('pageshow',wake);}};
  }};
})(typeof self!=='undefined'?self:this);
