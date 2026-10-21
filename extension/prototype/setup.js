(async function(){
  'use strict';const $=id=>document.getElementById(id);let manifest;
  $('permission-list').replaceChildren(...SlotGoogleAuth.SCOPES.map(scope=>{const item=document.createElement('li');item.textContent=scope;return item;}));
  try{
    const api=globalThis.browser||globalThis.chrome;manifest=api?.runtime?.getManifest?api.runtime.getManifest():await (await fetch('manifest.json')).json();
    if(api?.runtime?.id)$('extension-id').textContent=api.runtime.id;
    else if(manifest.key){const bytes=Uint8Array.from(atob(manifest.key),c=>c.charCodeAt(0)),hash=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes));$('extension-id').textContent=[...hash.slice(0,16)].map(b=>String.fromCharCode(97+(b>>4),97+(b&15))).join('');}
    $('client-id').value=manifest.oauth2?.client_id||'';$('configuration-status').textContent=manifest.oauth2?.client_id?'A client is configured in this copy. Reload Chrome after replacing the manifest.':'Google OAuth client has not been configured yet.';
  }catch(_){$('download-manifest').disabled=true;$('configuration-status').textContent='Load SlotDesk as a Chrome extension first, then open Google setup from its workspace. You can also run node configure-google.js CLIENT_ID in the project folder.';}
  $('configuration-form').onsubmit=event=>{event.preventDefault();try{
    const configured=SlotGoogleAuth.configuredManifest(manifest,$('client-id').value.trim()),blob=new Blob([JSON.stringify(configured,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='manifest.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    $('configuration-status').textContent='Manifest download requested. Replace manifest.json in the extension folder, then click Reload in chrome://extensions. Downloading alone does not change the installed extension.';
  }catch(e){$('configuration-status').textContent=e.message;}};
})();
