// Read-only consistency gate: current source -> archive -> embedded standalone.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),zlib=require('node:zlib');
function verifyArchive(bytes,sourceRoot,files){
 assert.ok(bytes.length>=22,'ZIP end record missing');
 let end=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(bytes.readUInt32LE(i)===0x06054b50&&i+22+bytes.readUInt16LE(i+20)===bytes.length){end=i;break;}}
 assert.ok(end>=0,'ZIP end of central directory record missing');
 assert.equal(bytes.readUInt16LE(end+4),0,'Multi-disk ZIP unsupported');assert.equal(bytes.readUInt16LE(end+6),0,'Multi-disk ZIP unsupported');
 const directory=bytes.readUInt32LE(end+16),directorySize=bytes.readUInt32LE(end+12),count=bytes.readUInt16LE(end+10);
 assert.equal(count,files.length,'ZIP directory file count mismatch');assert.equal(bytes.readUInt16LE(end+8),count,'ZIP directory count mismatch');
 assert.equal(directory+directorySize,end,'ZIP central directory boundary mismatch');
 const crc32=data=>{let crc=0xffffffff;for(const byte of data){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;};
 const entries=new Map();let offset=0;
 while(offset<directory){
  assert.ok(offset+30<=directory&&bytes.readUInt32LE(offset)===0x04034b50,'Invalid ZIP local header');
  const flags=bytes.readUInt16LE(offset+6),method=bytes.readUInt16LE(offset+8),size=bytes.readUInt32LE(offset+18),nameLength=bytes.readUInt16LE(offset+26),extra=bytes.readUInt16LE(offset+28);
  assert.equal(flags&8,0,'Unsupported streaming ZIP entry');
  const name=bytes.subarray(offset+30,offset+30+nameLength).toString('utf8'),start=offset+30+nameLength+extra;
  assert.ok(files.includes(name)&&!entries.has(name),'Unexpected/duplicate archive entry: '+name);
  assert.ok(start+size<=directory,'ZIP local payload boundary mismatch');
  const packed=bytes.subarray(start,start+size),data=method===0?packed:method===8?zlib.inflateRawSync(packed):null;
  assert.ok(data,'Unsupported ZIP compression');assert.deepEqual(data,fs.readFileSync(path.join(sourceRoot,name)),'Source/archive mismatch: '+name);
  const crc=crc32(data);assert.equal(bytes.readUInt32LE(offset+14),crc,'ZIP CRC checksum mismatch');assert.equal(bytes.readUInt32LE(offset+22),data.length,'ZIP uncompressed size mismatch');
  entries.set(name,{offset,flags,method,size,crc,length:data.length});offset=start+size;
 }
 assert.equal(offset,directory,'ZIP directory offset mismatch');
 const seen=new Set();offset=directory;
 for(let i=0;i<count;i++){
  assert.ok(offset+46<=end&&bytes.readUInt32LE(offset)===0x02014b50,'Invalid ZIP central directory header');
  const length=bytes.readUInt16LE(offset+28),extra=bytes.readUInt16LE(offset+30),comment=bytes.readUInt16LE(offset+32),next=offset+46+length+extra+comment;
  assert.ok(next<=end,'ZIP central entry boundary mismatch');const name=bytes.subarray(offset+46,offset+46+length).toString('utf8'),entry=entries.get(name);
  assert.ok(entry&&!seen.has(name),'ZIP central directory entry mismatch');seen.add(name);
  for(const [field,want]of [[8,entry.flags],[10,entry.method],[34,0]])assert.equal(bytes.readUInt16LE(offset+field),want,'ZIP central metadata mismatch');
  for(const [field,want]of [[16,entry.crc],[20,entry.size],[24,entry.length],[42,entry.offset]])assert.equal(bytes.readUInt32LE(offset+field),want,'ZIP central payload metadata mismatch');
  offset=next;
 }
 assert.equal(offset,end,'ZIP central directory length mismatch');
 assert.deepEqual([...entries.keys()].sort(),[...files].sort(),'Archive manifest mismatch');return entries.size;
}
function checkDistributions(root=path.resolve(__dirname,'..')){
 const html=fs.readFileSync(path.join(root,'standalone.html'),'utf8'),match=html.match(/window\.AcademyLabDownloads=(\{[^\n]*\});<\/script>/);
 assert.ok(match,'Embedded source registry missing');const embedded=JSON.parse(match[1]);let total=0;
 for(const [folder,files]of require('./lab-packages.cjs')){
  const key='downloads/'+folder+'.zip',zip=fs.readFileSync(path.join(root,key));total+=verifyArchive(zip,path.join(root,'labs',folder),files);
  assert.deepEqual(Buffer.from((embedded[key]||'').split(',')[1]||'','base64'),zip,'Standalone/archive mismatch: '+folder);
  for(const file of files){const key='labs/'+folder+'/'+file;assert.equal(decodeURIComponent((embedded[key]||'').split(',').slice(1).join(',')),fs.readFileSync(path.join(root,key),'utf8'),'Standalone/source mismatch: '+key);}
 }
 return {labs:11,files:total};
}
module.exports={verifyArchive,checkDistributions};
if(require.main===module){const result=checkDistributions();console.log('PASS: '+result.labs+' source ZIPs, '+result.files+' files and embedded standalone copies match current sources.');}
