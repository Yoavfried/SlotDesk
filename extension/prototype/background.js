/* One background entry for Chromium workers and Firefox event pages. */
if(typeof importScripts==='function'&&!globalThis.SlotPlatform)importScripts('../slot-desk-engine/recovery.js','../slot-desk-engine/google-auth.js','../slot-desk-engine/browser-platform.js','../slot-desk-engine/web-auth.js','service-config.js');
(function(){
  const api=SlotPlatform.apiFor(globalThis);if(!api?.runtime)return;
  SlotPlatform.installLauncher(api);
  if(api.runtime.onMessage&&SlotServices.googleAuthEndpoint)SlotWebAuth.install({api,endpoint:SlotServices.googleAuthEndpoint});
})();
