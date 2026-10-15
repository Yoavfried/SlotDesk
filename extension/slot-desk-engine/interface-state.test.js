const assert=require('node:assert/strict'),I=require('./interface-state'),U=require('./workspace-model'),P=require('./workspace-policy');
let checks=0;const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
async function main(){
  const profiles=Array.from({length:53},(_,i)=>({id:String(i),name:i<3?['Yoav','Yotam','Yonatan'][i]:'Person '+i,email:'person'+i+'@example.test'}));
  eq(I.page(profiles).items.length,5);eq(I.page(profiles,11).items.length,3);eq(I.page(profiles,99).current,11);eq(I.page([],7).current,1);eq(I.page([],7).items,[]);
  const matches=U.matchProfiles(profiles,'yo');eq(matches.length,3);eq(I.page(matches,10).current,1);eq(U.matchProfiles(profiles,'PERSON52@').map(p=>p.id),['52']);
  const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};let now=0;const cache=I.suggestionCache(storage,()=>now),scope='one',people=[{email:'friend@example.test',name:'Friend',count:12,recent:1,privateEventBody:'must never persist'}];
  eq(cache.read('a',scope),null);cache.write('a',scope,people);eq(cache.read('a',scope),[{email:'friend@example.test',name:'Friend',count:12,recent:1}]);eq(cache.read('b',scope),null);eq(cache.read('a','other'),null);cache.write('a',scope,people);
  for(let i=0;i<100;i++){now+=20*60*1000;eq(cache.read('a',scope,true).length,1,'repeated entry extends the sliding expiry');}
  now+=29*60*1000;eq(cache.read('a',scope).length,1);now+=60*1000;eq(cache.read('a',scope),null,'reading/rendering without entering does not extend expiry');
  cache.write('a',scope,[]);eq(cache.read('a',scope),[],'an empty successful result is cached');cache.clear('a');eq(cache.read('a',scope),null);
  const unavailable={getItem:()=>null,setItem:()=>{throw Error('blocked');},removeItem:()=>{}};const memory=I.suggestionCache(unavailable,()=>0);memory.write('a',scope,people);eq(memory.read('a',scope).length,1);
  const list=[{id:'one',accessRole:'owner'},{id:'two',accessRole:'writer'},{id:'read',accessRole:'reader'}],state={settings:{}};
  eq(P.scopeChange(state,['two'],'one',list).defaultCalendar,'','excluding default never substitutes another calendar');eq(P.scopeChange(state,['two'],'one',list).defaultCalendarSelected,false);eq(P.scopeChange(state,['one'],'one',list).defaultCalendar,'one');eq(P.scopeChange(state,['read'],'',list).calendarScopeConfirmed,true);
  let queue=new Map(),next=0,time=1000,online=true,busy=false,item={key:'a|one'},reads=0,done=false;
  const schedule=(fn,delay)=>{const id=++next;queue.set(id,{fn,delay});return id;},cancel=id=>queue.delete(id),fire=async()=>{const [id,task]=queue.entries().next().value;queue.delete(id);time+=task.delay;await task.fn();return task.delay;};
  const monitor=I.monitor({current:()=>item,online:()=>online,busy:()=>busy,schedule,cancel,now:()=>time,verify:async()=>{reads++;return {done};}});
  monitor.wake();eq([...queue.values()][0].delay,5000);monitor.wake();eq(queue.size,1,'rerenders do not accumulate polls');eq(await fire(),5000);eq(reads,1);eq([...queue.values()][0].delay,15000);
  busy=true;await fire();eq(reads,1,'a poll never races a foreground operation');eq([...queue.values()][0].delay,5000);busy=false;
  online=false;monitor.wake();eq(queue.size,0);eq(reads,1);online=true;monitor.wake(true);eq(await fire(),0);eq(reads,2);
  for(let i=0;i<8;i++)await fire();eq([...queue.values()][0].delay,300000,'backoff caps at five minutes');
  done=true;await fire();eq(queue.size,0,'verified result stops polling');item={key:'a|two'};done=false;monitor.wake();eq([...queue.values()][0].delay,5000,'a new operation restarts the loop');
  monitor.stop();eq(queue.size,0);monitor.wake(true);item=null;await fire();eq(queue.size,0);
  const retryMonitor=I.monitor({current:()=>({key:'rate'}),online:()=>true,busy:()=>false,schedule,cancel,now:()=>time,verify:async()=>{throw {retryAt:time+600000};}});retryMonitor.wake(true);await fire();eq([...queue.values()][0].delay,600000,'provider Retry-After can extend the cap');retryMonitor.stop();
  let active={key:'old-account'},settle;const changing=I.monitor({current:()=>active,online:()=>true,busy:()=>false,schedule,cancel,verify:async()=>{await new Promise(resolve=>settle=resolve);return {};}});changing.wake(true);const inFlight=fire();await Promise.resolve();changing.wake(true);eq(queue.size,0,'online events do not overlap an active check');changing.stop();active=null;settle();await inFlight;eq(queue.size,0,'a stopped/account-switched operation cannot schedule more checks');
  console.log(checks+' interface-state checks passed; synthetic data and virtual clocks only.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
