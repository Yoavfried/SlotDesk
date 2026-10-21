(async function(){
  'use strict';
  const api=SlotPlatform.apiFor(globalThis),cap=SlotPlatform.capabilities(api,navigator),manifest=SlotPlatform.manifest(api);let returnAddress='Not available';
  if(cap.webAuth)try{returnAddress=api.identity.getRedirectURL('google');}catch{returnAddress='Unavailable in this browser';}
  const rows=[
    ['SlotDesk version',manifest.version||'Extension not installed'],['Browser',navigator.userAgent],['Package ID',api?.runtime?.id||'Not available'],
    ['Workspace',cap.sidePanel||cap.sidebar?'Sidebar and full tab':'Full workspace tab'],['Safe window coordination',cap.locks?'Available':'Unavailable; calendar changes remain protected'],
    ['Separate Google sign-in window',cap.webAuth?'Available':'Unavailable in this browser'],['Session-only credential storage',cap.sessionStorage?'Available':'Background memory only'],
    ['Google return address',returnAddress]];
  const list=document.getElementById('connection-details');
  function render(){list.replaceChildren(...rows.flatMap(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;return [dt,dd];}));}
  render();
  if(cap.installed&&SlotServices.googleAuthEndpoint)try{const url=new URL(SlotServices.googleAuthEndpoint);url.searchParams.set('op','status');const response=await fetch(url,{credentials:'omit',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000)}),data=await response.json();rows.push(['Browser-independent connection',response.ok&&data.ready?'Configured':'Awaiting owner setup']);}catch{rows.push(['Browser-independent connection','Could not check the connection service']);}
  render();document.getElementById('copy-support-details').onclick=async()=>{const value=rows.map(([k,v])=>k+': '+v).join('\n'),text=document.getElementById('support-copy-text');text.value=value;text.hidden=false;
    try{await navigator.clipboard.writeText(value);document.getElementById('support-copy-status').textContent='Support details copied.';}catch{document.getElementById('support-copy-status').textContent='Select and copy the details below.';text.focus();text.select();}};
})();
