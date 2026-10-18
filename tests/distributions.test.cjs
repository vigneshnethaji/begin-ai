const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
let check;try{check=require('../scripts/check-distributions.cjs');}catch{check={};}
const root=path.resolve(__dirname,'..');
test('archive verification rejects a stale source payload without modifying canonical files',()=>{
 assert.equal(typeof check.verifyArchive,'function');
 const bytes=fs.readFileSync(path.join(root,'downloads/supportdesk-rules.zip'));
 const files=['SupportDesk.Rules.csproj','Program.cs','README.md'];
 assert.equal(check.verifyArchive(bytes,path.join(root,'labs/supportdesk-rules'),files),3);
 const corrupt=Buffer.from(bytes),offset=corrupt.indexOf(Buffer.from('<Project'));assert.ok(offset>0);corrupt[offset]=33;
 assert.throws(()=>check.verifyArchive(corrupt,path.join(root,'labs/supportdesk-rules'),files),/mismatch|checksum|CRC/i);
});
test('archive verification rejects missing end record even when every source payload is intact',()=>{
 assert.equal(typeof check.verifyArchive,'function');
 const bytes=fs.readFileSync(path.join(root,'downloads/supportdesk-rules.zip'));
 assert.throws(()=>check.verifyArchive(bytes.subarray(0,bytes.length-22),path.join(root,'labs/supportdesk-rules'),['SupportDesk.Rules.csproj','Program.cs','README.md']),/end|directory|ZIP/i);
});
