import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=path.join(root,'extension');
const manifest=JSON.parse(await readFile(path.join(app,'manifest.json'),'utf8'));
const entries=[];
async function walk(directory){for(const item of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)){const file=path.join(directory,item.name);if(item.isDirectory())await walk(file);else if(!item.name.endsWith('.test.js')&&item.name!=='README.md')entries.push({name:path.relative(app,file).split(path.sep).join('/'),data:await readFile(file)});}}
await walk(app);
entries.push({name:'README.txt',data:Buffer.from(`SlotDesk ${manifest.version}\n\nExtract the whole ZIP and open START-HERE.html. Load the extracted folder as an unpacked Chrome extension. Real Google connection is limited to the owner's approved pilot audience. Creating from SlotDesk sends a real new invitation. Rescheduling changes the selected appointment’s times and asks Google to notify its retained guests, only after review. Edit meeting changes reviewed title/location/description and explicit guest selections while retaining time and the existing Meet link. Removed guests may lose their invitation; the organizing meeting remains. Check workplace approval before using a work account.\n`)});
const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc32=buffer=>{let crc=0xffffffff;for(const byte of buffer)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;};
const local=[],central=[];let offset=0;
for(const {name,data} of entries){
  const filename=Buffer.from(name),compressed=deflateRawSync(data,{level:9}),crc=crc32(data),header=Buffer.alloc(30),record=Buffer.alloc(46);
  header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(8,8);header.writeUInt16LE(33,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(filename.length,26);
  record.writeUInt32LE(0x02014b50);record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(0x800,8);record.writeUInt16LE(8,10);record.writeUInt16LE(33,14);record.writeUInt32LE(crc,16);record.writeUInt32LE(compressed.length,20);record.writeUInt32LE(data.length,24);record.writeUInt16LE(filename.length,28);record.writeUInt32LE(offset,42);
  local.push(header,filename,compressed);central.push(record,filename);offset+=header.length+filename.length+compressed.length;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
await mkdir(path.join(root,'dist'),{recursive:true});
const filename=`SlotDesk-${manifest.version}.zip`;
const zip=Buffer.concat([...local,directory,end]);
await writeFile(path.join(root,'dist',filename),zip);
await writeFile(path.join(root,'dist','SHA256SUMS.txt'),`${createHash('sha256').update(zip).digest('hex')}  ${filename}\n`);
console.log(`Built dist/${filename} — ${entries.length} extension files; source tests and repository documentation excluded.`);
