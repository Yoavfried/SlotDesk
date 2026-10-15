import {readFile,writeFile} from 'node:fs/promises';
const endpoint=new URL(process.argv[2]||'');
if(endpoint.protocol!=='https:'||endpoint.username||endpoint.password||endpoint.search||endpoint.hash||endpoint.pathname!=='/api/leads')throw new Error('Use the HTTPS /api/leads endpoint without credentials or query parameters.');
const manifestPath=new URL('../extension/manifest.json',import.meta.url),configPath=new URL('../extension/prototype/service-config.js',import.meta.url),manifest=JSON.parse(await readFile(manifestPath,'utf8'));
// One explicit origin; never broaden host permissions to all HTTPS services.
const origin=endpoint.origin;manifest.host_permissions=['https://www.googleapis.com/*',origin+'/*'];
manifest.content_security_policy.extension_pages="default-src 'self'; script-src 'self'; object-src 'none'; connect-src 'self' https://www.googleapis.com "+origin+"; base-uri 'none'";
await writeFile(configPath,'globalThis.SlotServices=Object.freeze('+JSON.stringify({leadsEndpoint:endpoint.href})+');\n');
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Configured registration origin: '+origin+'. Rebuild and reload the extension.');
