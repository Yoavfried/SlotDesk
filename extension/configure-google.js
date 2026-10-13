const fs=require('node:fs'),path=require('node:path'),A=require('./slot-desk-engine/google-auth.js');
const client=process.argv[2];
if(!A.validClient(client))throw new Error('Usage: node configure-google.js YOUR_CHROME_EXTENSION_OAUTH_CLIENT_ID');
const file=path.join(__dirname,'manifest.json'),manifest=JSON.parse(fs.readFileSync(file,'utf8'));
fs.writeFileSync(file,JSON.stringify(A.configuredManifest(manifest,client),null,2)+'\n');console.log('OAuth client configured. Reload the unpacked extension.');
