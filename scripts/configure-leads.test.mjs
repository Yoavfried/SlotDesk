import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {configureLeads} from './configure-leads.mjs';
const directory=await mkdtemp(path.join(tmpdir(),'slotdesk-config-'));
try{
  await mkdir(path.join(directory,'extension/prototype'),{recursive:true});
  const manifestPath=path.join(directory,'extension/manifest.json'),configPath=path.join(directory,'extension/prototype/service-config.js');
  await writeFile(manifestPath,JSON.stringify({content_security_policy:{},host_permissions:[]}));
  await writeFile(configPath,'globalThis.SlotServices=Object.freeze({"leadsEndpoint":"https://old.example.test/api/leads","googleAuthEndpoint":"https://auth.example.test/api/google"});\n');
  await configureLeads('https://leads.example.test/api/leads',pathToFileURL(directory+path.sep));
  const manifest=JSON.parse(await readFile(manifestPath,'utf8')),source=await readFile(configPath,'utf8');
  assert.ok(source.includes('https://auth.example.test/api/google'));
  assert.deepEqual(manifest.host_permissions,['https://www.googleapis.com/*','https://leads.example.test/*','https://auth.example.test/*']);
  assert.ok(manifest.content_security_policy.extension_pages.includes('https://auth.example.test'));
  await assert.rejects(()=>configureLeads('http://insecure.example.test/api/leads',pathToFileURL(directory+path.sep)));
  assert.equal(await readFile(configPath,'utf8'),source);
  console.log('5 endpoint-configuration preservation checks passed');
}finally{await rm(directory,{recursive:true,force:true});}
