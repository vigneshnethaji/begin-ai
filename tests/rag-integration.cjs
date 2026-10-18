const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {spawnSync}=require('node:child_process');
test('runnable C# grounded-answer verification uses production services without a listener',()=>{
 const result=spawnSync('dotnet',['run','--project',path.resolve(__dirname,'../labs/supportdesk-grounded-answers'),'--','--verify'],{encoding:'utf8',timeout:120000,windowsHide:true});
 assert.equal(result.status,0,result.stdout+'\n'+result.stderr);assert.match(result.stdout,/PASS: .*checks/);
});
