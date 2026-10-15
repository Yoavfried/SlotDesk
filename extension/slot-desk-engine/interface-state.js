(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotInterfaceState=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value)),windowMs=30*60*1000;
  function page(items,number=1,size=5){const pages=Math.max(1,Math.ceil(items.length/size)),current=Math.max(1,Math.min(pages,Number(number)||1));return {items:items.slice((current-1)*size,current*size),current,pages,total:items.length};}
  function suggestionCache(storage,now=()=>Date.now()){
    const memory=new Map(),key=account=>'slotdesk-suggestions:'+account;
    function read(account,scope,touch=false){let entry;try{entry=JSON.parse(storage.getItem(key(account))||'null')||memory.get(account);}catch(_){entry=memory.get(account);}if(!entry)return null;if(entry.scope!==scope||entry.expiresAt<=now()||!Array.isArray(entry.people)){clear(account);return null;}if(touch){entry.expiresAt=now()+windowMs;put(account,entry);}return clone(entry.people);}
    function put(account,entry){memory.set(account,clone(entry));try{storage.setItem(key(account),JSON.stringify(entry));}catch(_){}}
    function write(account,scope,people){put(account,{scope,expiresAt:now()+windowMs,people:people.map(p=>({email:p.email,name:p.name||'',count:p.count||0,recent:p.recent||0}))});}
    function clear(account){memory.delete(account);try{storage.removeItem(key(account));}catch(_){}}
    return {read,write,clear};
  }
  const delays=[5000,15000,30000,60000,120000,300000];
  // This scheduler can only call a readback callback. Sending remains an explicit user action.
  function monitor(env){let timer=null,running=false,epoch=0,attempt=0,lastKey='';const schedule=env.schedule||setTimeout,cancel=env.cancel||clearTimeout;
    function stop(){epoch++;if(timer!==null)cancel(timer);timer=null;attempt=0;lastKey='';}
    function arm(delay){if(timer!==null)cancel(timer);timer=schedule(tick,delay);}
    function wake(immediate=false){const item=env.current();if(!item){stop();return;}if(item.key!==lastKey){epoch++;attempt=0;lastKey=item.key;if(timer!==null)cancel(timer);timer=null;}if(running)return;if(!env.online()){if(timer!==null)cancel(timer);timer=null;return;}if(timer!==null&&!immediate)return;arm(immediate?0:delays[Math.min(attempt,delays.length-1)]);}
    async function tick(){timer=null;const item=env.current();if(!item){stop();return;}if(!env.online())return;if(env.busy()){arm(delays[0]);return;}const token=epoch;running=true;let result;try{result=await env.verify(item);}catch(error){result={retryAt:error.retryAt||0};}finally{running=false;}if(token!==epoch){wake();return;}if(!env.current()||env.current().key!==item.key){wake();return;}attempt++;if(result?.done)return;const delay=Math.max(result?.delay||delays[Math.min(attempt,delays.length-1)],(result?.retryAt||0)-(env.now?.()??Date.now()));if(env.online())arm(delay);}
    return {wake,stop};
  }
  return {page,suggestionCache,monitor,delays,windowMs};
});
