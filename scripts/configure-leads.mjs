import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export async function configureLeads(value,root=new URL('../',import.meta.url)) {
  const endpoint=new URL(value||'');
  if(endpoint.protocol!=='https:'||endpoint.username||endpoint.password||endpoint.search||endpoint.hash||endpoint.pathname!=='/api/leads')throw new Error('Use the HTTPS /api/leads endpoint without credentials or query parameters.');
  const manifestPath=new URL('extension/manifest.json',root),configPath=new URL('extension/prototype/service-config.js',root);
  const manifest=JSON.parse(await readFile(manifestPath,'utf8')),source=await readFile(configPath,'utf8');
  const match=source.match(/^globalThis\.SlotServices=Object\.freeze\((\{.*\})\);\s*$/s);
  if(!match)throw new Error('Service configuration could not be read safely. No configuration was changed.');
  const config={...JSON.parse(match[1]),leadsEndpoint:endpoint.href},origins=new Set([endpoint.origin]);
  if(config.googleAuthEndpoint){const auth=new URL(config.googleAuthEndpoint);if(auth.protocol!=='https:'||auth.username||auth.password||auth.search||auth.hash)throw new Error('The saved sign-in endpoint is invalid. No configuration was changed.');origins.add(auth.origin);}
  manifest.host_permissions=['https://www.googleapis.com/*',...[...origins].map(origin=>origin+'/*')];
  manifest.content_security_policy.extension_pages="default-src 'self'; script-src 'self'; object-src 'none'; connect-src 'self' https://www.googleapis.com "+[...origins].join(' ')+"; base-uri 'none'";
  await writeFile(configPath,'globalThis.SlotServices=Object.freeze('+JSON.stringify(config)+');\n');
  await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');return endpoint.origin;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('Configured registration origin: '+await configureLeads(process.argv[2])+'. Rebuild and reload the extension.');
