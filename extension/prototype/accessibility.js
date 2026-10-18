(function(){
  'use strict';
  let serial=0;const openers=new WeakMap();
  function label(dialog){const heading=dialog.querySelector('.dialog-heading h2');if(heading&&!dialog.hasAttribute('aria-labelledby')){if(!heading.id)heading.id='dialog-heading-'+(++serial);dialog.setAttribute('aria-labelledby',heading.id);}if(!dialog._focusReturn){dialog._focusReturn=true;dialog.addEventListener('beforetoggle',event=>{if(event.newState==='open')openers.set(dialog,document.activeElement);});dialog.addEventListener('close',()=>{const opener=openers.get(dialog);if(opener?.isConnected&&!opener.closest('[hidden]')&&(!opener.closest('dialog')||opener.closest('dialog').open))opener.focus({preventScroll:true});});}}
  function scan(){document.querySelectorAll('dialog').forEach(label);document.querySelectorAll('.error').forEach(el=>{if(el.id)el.setAttribute('role','alert');});}
  function init(){scan();new MutationObserver(scan).observe(document.body,{subtree:true,childList:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
