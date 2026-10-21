import {deflateRawSync} from 'node:zlib';
export function zipEntries(entries){
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
return Buffer.concat([...local,directory,end]);
}
