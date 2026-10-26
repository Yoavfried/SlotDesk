import {createHash} from 'node:crypto';
export const FIREFOX_ID='{39c56104-958b-43a6-bcfe-5e9db811c74b}';
export const CHROMIUM_ID='blpliafbiiidhcffegochddjhagkhhip';
export const returnUrls=[`https://${CHROMIUM_ID}.chromiumapp.org/google`,`https://${createHash('sha1').update(FIREFOX_ID).digest('hex')}.extensions.allizom.org/google`];
const backgroundScripts=['slot-desk-engine/recovery.js','slot-desk-engine/google-auth.js','slot-desk-engine/browser-platform.js','slot-desk-engine/web-auth.js','prototype/service-config.js','prototype/background.js'];
export function browserManifest(base,target) {
  const manifest=structuredClone(base);
  if(target==='chromium')return manifest;
  delete manifest.key;delete manifest.oauth2;delete manifest.minimum_chrome_version;delete manifest.side_panel;
  manifest.permissions=manifest.permissions.filter(p=>p!=='sidePanel');
  manifest.background={scripts:[...backgroundScripts]};
  if(target==='firefox') {
    manifest.sidebar_action={default_title:'SlotDesk',default_panel:'index.html'};
    manifest.browser_specific_settings={gecko:{id:FIREFOX_ID,strict_min_version:'140.0',
      data_collection_permissions:{required:['authenticationInfo','personallyIdentifyingInfo','personalCommunications'],optional:['technicalAndInteraction']}}};
  } else if(target==='safari-source') {
    manifest.permissions=manifest.permissions.filter(p=>p!=='identity');
    manifest.description='SlotDesk source preparation for Safari. Google authentication requires an Apple-platform integration.';
  } else throw new Error('Unknown browser package target.');
  return manifest;
}
