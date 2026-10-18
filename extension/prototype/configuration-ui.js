(function(root){
  'use strict';
  root.SlotConfigurationUI={create({context,apply,escape:esc}){
    const F=SlotConfigurationFiles,dialog=document.getElementById('files-dialog'),list=document.getElementById('files-people'),note=document.getElementById('files-note'),error=document.getElementById('files-error'),confirm=document.getElementById('files-confirm'),input=document.getElementById('configuration-file');let mode=null,loaded=null,baseline=null;
    function download(file,name){const url=URL.createObjectURL(new Blob([JSON.stringify(file,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    function backup(){const c=context();if(c.unreadable)throw new Error('Download the original saved data from the recovery window instead.');download(F.exportFile(c.state,c.display),'SlotDesk-backup-'+new Date().toISOString().slice(0,10)+'.json');}
    function open(operation){mode=operation;loaded=null;error.textContent='';note.replaceChildren();list.replaceChildren();confirm.disabled=false;confirm.textContent=operation==='export'?'Export profiles':operation==='restore'?'Replace my SlotDesk setup':'Import profiles';document.getElementById('files-title').textContent=operation==='export'?'Export profiles':operation==='restore'?'Restore a backup':'Import profiles';document.getElementById('files-select-actions').hidden=operation==='restore';document.getElementById('files-backup').hidden=operation!=='restore'||context().unreadable;baseline=context();if(operation==='export'){render(baseline.state.profiles.map((p,index)=>({index,name:p.name,email:p.email})));dialog.showModal();}else{input.value='';input.click();}}
    function render(people){list.innerHTML=people.map(p=>'<label class="file-person check"><input type="checkbox" data-row="'+p.index+'" checked><span><strong>'+esc(p.name)+'</strong><small>'+esc(p.email)+'</small></span></label>').join('');}
    function selected(){return [...list.querySelectorAll('[data-row]:checked')].map(el=>+el.dataset.row);}
    input.onchange=async()=>{try{const file=input.files[0];if(!file)return;if(file.size>10*1024*1024)throw new Error('Choose a file smaller than 10 MB.');loaded=F.inspect(await file.text());if(mode==='restore'&&loaded.file.format!=='slotdesk-backup')throw new Error('Choose a complete SlotDesk backup.');if(mode==='restore'){note.textContent='This will replace your SlotDesk settings, calendar selections and saved profiles, and clear your unfinished meeting draft. Your own profile is updated only when its email matches; otherwise it stays unchanged. Calendar events will not be changed.';}else render(loaded.people);dialog.showModal();}catch(err){error.textContent=err.message;if(!dialog.open)dialog.showModal();}};
    document.getElementById('files-all').onclick=()=>list.querySelectorAll('[data-row]').forEach(el=>el.checked=true);document.getElementById('files-none').onclick=()=>list.querySelectorAll('[data-row]').forEach(el=>el.checked=false);
    document.getElementById('files-backup').onclick=()=>{try{backup();}catch(err){error.textContent=err.message;}};
    let prepared=null;
    function clearReview(){prepared=null;confirm.textContent=mode==='restore'?'Replace my SlotDesk setup':'Import profiles';}
    list.addEventListener('change',clearReview);
    confirm.onclick=async()=>{error.textContent='';try{
      const current=context();if(current.account!==baseline.account||current.generation!==baseline.generation||current.raw!==baseline.raw)throw new Error('Your setup changed. Close this window and choose the file again.');
      if(mode==='export'){const ids=selected().map(i=>baseline.state.profiles[i].id);download(F.exportFile(baseline.state,baseline.display,ids),'SlotDesk-profiles-'+new Date().toISOString().slice(0,10)+'.json');dialog.close();return;}
      if(!loaded)throw new Error('Choose a valid SlotDesk file.');if(current.unreadable&&!document.getElementById('storage-reset-ack').checked)throw new Error('In the recovery window, confirm that you saved a copy and checked your calendar for unfinished changes.');
      if(!prepared){prepared=await apply({stage:true,file:loaded.file,selected:selected(),restore:mode==='restore',baseline});if(prepared.warnings.length){const p=document.createElement('p');p.className='file-warnings';p.textContent=prepared.warnings.join('\n');note.append(p);confirm.textContent=mode==='restore'?'Confirm replacement':'Confirm import';return;}}
      confirm.disabled=true;await apply({prepared,restore:mode==='restore',baseline});dialog.close();clearReview();
    }catch(err){prepared=null;error.textContent=err.message;}finally{confirm.disabled=false;}};
    document.getElementById('files-close').onclick=()=>{dialog.close();prepared=null;};dialog.addEventListener('close',()=>{prepared=null;loaded=null;list.replaceChildren();});
    return {open,backup,reset:()=>{dialog.close();prepared=null;loaded=null;}};
  }};
})(typeof self!=='undefined'?self:this);
