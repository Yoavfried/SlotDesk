(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./recovery'));else root.SlotPlatform=factory(root.SlotRecovery);})(typeof self!=='undefined'?self:this,function(R){
  'use strict';
  const apiFor=scope=>scope?.browser || scope?.chrome || null;
  function manifest(api){try{return api?.runtime?.getManifest?.() || {};}catch{return {};}}
  function capabilities(api,nav={}) {
    return {installed:typeof api?.runtime?.getManifest==='function',messaging:typeof api?.runtime?.sendMessage==='function',
      webAuth:typeof api?.identity?.launchWebAuthFlow==='function'&&typeof api?.identity?.getRedirectURL==='function',
      nativeAuth:typeof api?.identity?.getAuthToken==='function',sessionStorage:typeof api?.storage?.session?.get==='function',
      sidePanel:typeof api?.sidePanel?.setPanelBehavior==='function'||typeof api?.sidePanel?.open==='function',
      sidebar:typeof api?.sidebarAction?.open==='function',tabs:typeof api?.tabs?.create==='function',
      locks:typeof nav.locks?.request==='function',clipboard:typeof nav.clipboard?.writeText==='function'};
  }
  function locks(nav={}) {
    if(typeof nav.locks?.request==='function')return nav.locks;
    return {request:()=>Promise.reject(R.issue('browser-capability','This browser cannot safely coordinate changes between SlotDesk windows. Update your browser before changing calendars or saved settings. Reference: B103.',{diagnosticCode:'B103'}))};
  }
  function installLauncher(api) {
    const state={panelReady:false,configured:false},own=manifest(api);
    async function tab(){if(typeof api?.tabs?.create!=='function')throw R.issue('browser-capability','Open SlotDesk from its extension settings. This browser could not open its workspace tab. Reference: B101.',{diagnosticCode:'B101'});return api.tabs.create({url:api.runtime.getURL('index.html')});}
    async function configure(){state.panelReady=false;state.configured=true;
      if(own.side_panel&&typeof api?.sidePanel?.setPanelBehavior==='function')try{await api.sidePanel.setPanelBehavior({openPanelOnActionClick:true});state.panelReady=true;}catch{/* A rejected panel API uses the full workspace tab. */}
    }
    function launch(clickedTab) {
      if(state.panelReady)return Promise.resolve('panel');
      if(own.side_panel&&typeof api?.sidePanel?.open==='function')try{return Promise.resolve(api.sidePanel.open({windowId:clickedTab?.windowId})).then(()=> 'panel',tab);}catch{return tab();}
      if(own.sidebar_action&&typeof api?.sidebarAction?.open==='function')try{return Promise.resolve(api.sidebarAction.open()).then(()=> 'sidebar',tab);}catch{return tab();}
      return tab();
    }
    api?.action?.onClicked?.addListener(clickedTab=>{Promise.resolve(launch(clickedTab)).catch(()=>{/* No calendar operation is attempted by the launcher. */});});
    api?.runtime?.onInstalled?.addListener(()=>{configure().catch(()=>{});});
    configure().catch(()=>{});
    return {configure,launch,state};
  }
  function connection(api,nativeFactory) {
    if(typeof api?.runtime?.sendMessage!=='function')return nativeFactory(api?.identity);
    async function call(action,extra={}) {
      let result;try{result=await api.runtime.sendMessage({channel:'slotdesk-google-v1',action,...extra});}
      catch{throw R.issue('connection','SlotDesk’s background connection is unavailable. Reload the extension and connect again. Reference: G112.',{diagnosticCode:'G112'});}
      if(!result?.ok){const e=result?.error;throw R.issue(e?.kind || 'connection',e?.message || 'SlotDesk’s Google connection could not be started. Reload the extension. Reference: G112.',
        {diagnosticCode:e?.diagnosticCode || 'G112',requiresReconnect:!!e?.requiresReconnect});}
      return result.value;
    }
    return {getToken:interactive=>call('token',{interactive:!!interactive}),invalidateToken:token=>call('invalidate',{token}),disconnect:()=>call('disconnect'),
      submitRegistration:async(record,fallback)=>{const result=await call('registration',{record});if(result?.useDirect)return fallback();return result;}};
  }
  return {apiFor,manifest,capabilities,locks,installLauncher,connection};
});
