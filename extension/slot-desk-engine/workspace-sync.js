(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SlotWorkspaceSync=factory();})(typeof self!=='undefined'?self:this,function(){
  'use strict';
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  // Storage projects profile fields in a fixed order; ordering is not a user edit.
  const stable=(_key,value)=>value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,value[key]])):value;
  const equal=(a,b)=>JSON.stringify(a,stable)===JSON.stringify(b,stable);
  const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
  function mergeState(base,local,remote,{choice='local',booking=false,rescheduling=false}={}){
    const conflicts=[];
    function merge(b,l,r,path){
      if(equal(l,b))return clone(r);if(equal(r,b)||equal(l,r))return clone(l);
      if(object(b)&&object(l)&&object(r)){const out={};for(const key of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){const value=merge(b[key],l[key],r[key],path.concat(key));if(value!==undefined)out[key]=value;}return out;}
      conflicts.push({path:path.join('.'),local:clone(l),remote:clone(r)});return clone(choice==='remote'?r:l);
    }
    const settings=merge(base.settings||{},local.settings||{},remote.settings||{},['settings']),profiles=[],maps=[base,local,remote].map(state=>new Map((state.profiles||[]).map(p=>[p.id,p])));
    for(const id of new Set([...maps[2].keys(),...maps[1].keys(),...maps[0].keys()])){const p=merge(maps[0].get(id),maps[1].get(id),maps[2].get(id),['profiles',id]);if(p)profiles.push(p);}
    // Two blank editors can acquire different IDs for the same email. Keep one
    // identity after explicit conflict resolution and remap its selected references.
    const byEmail=new Map(),aliases=new Map();
    for(const p of profiles){const email=String(p.email||'').trim().toLowerCase();if(!email)continue;const other=byEmail.get(email);if(!other){byEmail.set(email,p);continue;}conflicts.push({path:'profiles.email',local:clone(local.profiles.find(x=>String(x.email||'').trim().toLowerCase()===email)),remote:clone(remote.profiles.find(x=>String(x.email||'').trim().toLowerCase()===email))});const preferred=(choice==='remote'?remote:local).profiles.find(x=>String(x.email||'').trim().toLowerCase()===email),keep=preferred?.id===p.id?p:other,drop=keep===p?other:p;aliases.set(drop.id,keep.id);byEmail.set(email,keep);}
    const unique=profiles.filter(p=>!aliases.has(p.id));
    if(Array.isArray(settings.participantIds))settings.participantIds=[...new Set(settings.participantIds.map(id=>aliases.get(id)||id))];
    if(aliases.has(settings.ownProfileId))settings.ownProfileId=aliases.get(settings.ownProfileId);
    const state={revision:remote.revision||0,settings,profiles:unique,constraints:merge(base.constraints||[],local.constraints||[],remote.constraints||[],['constraints'])};
    // Ordinary profile/draft saves cannot erase or replace an uncertain outgoing invitation.
    const pending=booking?merge(base.pendingBooking,local.pendingBooking,remote.pendingBooking,['pendingBooking']):clone(remote.pendingBooking);
    if(pending)state.pendingBooking=pending;
    const timeChange=rescheduling?merge(base.pendingReschedule,local.pendingReschedule,remote.pendingReschedule,['pendingReschedule']):clone(remote.pendingReschedule);
    if(timeChange)state.pendingReschedule=timeChange;
    return {state,conflicts};
  }
  async function commit(store,account,base,local,locks,options={}){
    if(!locks?.request||!account)throw new Error('This browser cannot coordinate saved changes between windows. Copy your meeting details before continuing.');
    return locks.request('slotdesk-workspace:'+account,{mode:'exclusive'},()=>{
      const remote=store.load(account,clone(base)),result=mergeState(base,local,remote,options);
      options.validateRemote?.(remote);
      if(result.conflicts.length&&!options.resolve)return {...result,remote};
      store.save(account,result.state);return {...result,remote};
    });
  }
  function sourceKey(account){return 'slotdesk-settings-v2:google:'+encodeURIComponent(account);}
  return {mergeState,commit,sourceKey,equal,clone};
});
