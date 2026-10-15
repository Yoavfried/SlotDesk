(function(root){
  'use strict';
  const R=root.SlotRecovery,esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  root.SlotRecoveryUI={create(env){
    const $=id=>document.getElementById(id);let item=null,checked=false;
    const message=text=>$('recovery-message').textContent=text;
    const current=()=>{const c=env.context(),pending=R.pending(c.state);if(!pending||pending.type!==item?.type||R.operationKey(pending)!==R.operationKey(item)||item.value.account!==c.account)throw new Error('This unfinished operation changed. Reopen it from the workspace.');return c;};
    function show(){
      item=R.pending(env.context().state);if(!item)return;checked=false;$('recovery-ack').checked=false;$('recovery-found').checked=false;
      const value=item.value,event=item.type==='booking'?value.request.event:null;
      $('recovery-title').textContent=item.type==='booking'?'Check unfinished invitation':'Check unfinished meeting change';
      $('recovery-details').innerHTML=(event?'<h3>'+esc(event.summary)+'</h3>':'')+'<p class="muted">'+esc(value.account)+'</p><p>The previous request may have reached Google. Checking its result only reads the same appointment.</p><details><summary>Saved operation details</summary><pre class="copy-text">'+esc(JSON.stringify(value,null,2))+'</pre></details>';
      $('recovery-retry').hidden=true;$('recovery-manual').hidden=true;message('');if(!$('recovery-dialog').open)$('recovery-dialog').showModal();
    }
    async function check(){if(env.context().busy)return;await env.run(async()=>{try{current();message('Checking the saved appointment…');const result=await env.check(item);current();if(result.applied){await env.complete(item,result.event);$('recovery-dialog').close();return;}
        checked=result.canRetry===true;$('recovery-retry').hidden=!checked;message(result.message||'The reviewed result is not present. Review the current details before choosing whether to retry.');
      }catch(error){message(error.message);env.connectionError(error);}});}
    $('recovery-check').onclick=check;
    $('recovery-retry').onclick=()=>{try{current();if(!checked)return;$('recovery-dialog').close();env.retry(item);}catch(error){message(error.message);}};
    $('recovery-manual-toggle').onclick=()=>{$('recovery-manual').hidden=!$('recovery-manual').hidden;};
    $('recovery-resolve').onclick=()=>env.run(async()=>{try{current();if(!$('recovery-ack').checked)throw new Error('Confirm that you checked the calendar and understand the unresolved result.');await env.resolve(item,$('recovery-found').checked?'found':'unverified');$('recovery-dialog').close();}catch(error){message(error.message);}});
    function history(){const entries=env.context().state.settings.recoveryHistory||[];$('recovery-history-list').innerHTML=entries.length?entries.slice().reverse().map(entry=>'<article class="meeting-entry"><h3>'+esc(entry.status==='reported_found'?'Reported found by you':'Result left unverified')+'</h3><p>'+esc(root.SlotWorkspace.fullTime(entry.resolvedAt,env.context().zone,env.context().clock,{dateFormat:env.context().dateFormat}))+'</p><p class="muted">This is a manual report, not Google confirmation. The saved request will not be resent automatically.</p><details><summary>Exact operation record</summary><pre class="copy-text">'+esc(JSON.stringify(entry.operation,null,2))+'</pre></details></article>').join(''):'<p>No manually resolved calendar changes.</p>';$('recovery-history-dialog').showModal();}
    return {show,history};
  }};
})(typeof self!=='undefined'?self:this);
