import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {zipEntries} from './zip.mjs';
import {browserManifest,returnUrls,FIREFOX_ID,CHROMIUM_ID} from './browser-targets.mjs';
import {storeDistributionFile} from './store-distribution.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),app=path.join(root,'extension'),dist=path.join(root,'dist');
const base=JSON.parse(await readFile(path.join(app,'manifest.json'),'utf8')),source=[];
async function walk(directory){for(const item of(await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const file=path.join(directory,item.name);if(item.isDirectory())await walk(file);else if(!item.name.endsWith('.test.js')&&item.name!=='README.md')source.push({name:path.relative(app,file).split(path.sep).join('/'),data:await readFile(file)});}}
await walk(app);await mkdir(dist,{recursive:true});const packages=[];
for(const target of ['chromium','chromium-store','firefox','safari-source']){
  const manifest=browserManifest(base,target),note=target==='chromium'?'Chrome, Edge, Vivaldi, Brave and Opera desktop package. Actual verification by browser/version is documented separately. Load unpacked from your browser extension manager.':target==='chromium-store'?'Chrome Web Store and Microsoft Edge Add-ons draft-upload package. The development key is omitted. Store-issued identities and exact Google returns must be configured before public submission. Keep the existing unpacked beta package for manual installations.':target==='firefox'?'UNSIGNED Firefox desktop development package. It needs Mozilla signing for normal installation. Use about:debugging to load temporarily; restart removes a temporary add-on.':'SAFARI SOURCE ONLY. This is not an installable Safari app. Apple packaging/signing, a separate Google authentication bridge and real Safari validation remain required.';
  const entries=source.map(e=>({name:e.name,data:e.name==='manifest.json'?Buffer.from(JSON.stringify(manifest,null,2)+'\n'):storeDistributionFile(e.name,e.data,target)}));
  const installation=target==='chromium-store'?'Upload this ZIP to the store developer dashboard as a draft. This upload is not public-release approval.':'Extract the complete package and open START-HERE.html.';
  entries.push({name:'README.txt',data:Buffer.from('SlotDesk '+base.version+'\n\n'+note+'\n\n'+installation+' The Google account must be approved for the closed beta. Native Chrome sign-in is retained when the new hosted connection is not configured. Other browsers need the owner-managed Google connection activated. No client secret belongs in this package. Calendar creation and changes always require review; SlotDesk does not delete or move appointments automatically.\n')});
  const folder=path.join(dist,target);await mkdir(folder,{recursive:true});for(const entry of entries){const filename=path.join(folder,...entry.name.split('/'));await mkdir(path.dirname(filename),{recursive:true});await writeFile(filename,entry.data);}
  const filename=target==='chromium'?`SlotDesk-${base.version}.zip`:target==='chromium-store'?`SlotDesk-${base.version}-Chromium-store.zip`:target==='firefox'?`SlotDesk-${base.version}-Firefox-unsigned.xpi`:`SlotDesk-${base.version}-Safari-source.zip`,data=zipEntries(entries);
  await writeFile(path.join(dist,filename),data);packages.push({target,filename,files:entries.length,sha256:createHash('sha256').update(data).digest('hex')});
  console.log('Built '+filename+' — '+entries.length+' files. '+note);
}
await writeFile(path.join(dist,'SHA256SUMS.txt'),packages.map(p=>p.sha256+'  '+p.filename).join('\n')+'\n');
await writeFile(path.join(dist,'package-targets.json'),JSON.stringify({version:base.version,chromiumId:CHROMIUM_ID,chromiumIdUse:'Unpacked beta only; store identities are assigned by each store.',storeChromiumIds:null,firefoxId:FIREFOX_ID,returnUrls,returnUrlsUse:'Beta Chromium and stable Firefox returns; add exact store returns after draft upload.',packages},null,2)+'\n');
