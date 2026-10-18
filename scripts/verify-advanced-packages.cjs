// Developer-only verification: fresh source ZIPs, real C# and real Blazor circuits.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const {spawn,execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const specs=[
  ['search','supportdesk-semantic-search','SEARCH_LAB_PORT',5110],
  ['rag','supportdesk-grounded-answers','RAG_LAB_PORT',5112],
  ['retrieval','supportdesk-retrieval-quality','RETRIEVAL_LAB_PORT',5114],
  ['workflow','supportdesk-bounded-workflow','WORKFLOW_LAB_PORT',5116],
  ['inputs','supportdesk-attachment-review','INPUTS_LAB_PORT',5118],
  ['operations','supportdesk-operations-capstone','OPERATIONS_LAB_PORT',5120],
  ['summary','supportdesk-ticket-summary','SUMMARY_LAB_PORT',5122]
];
const selected=process.argv.slice(2);
assert.ok(selected.every(name=>specs.some(row=>row[0]===name)),'Expected search, rag, retrieval, workflow, inputs, operations or summary');
const run=(command,args,cwd,env=process.env)=>execFileSync(command,args,{cwd,env,stdio:'inherit',windowsHide:true});
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
async function ready(server,url,logs){
  const deadline=Date.now()+30000;
  while(Date.now()<deadline){
    if(server.exitCode!==null)throw new Error('Lab exited before readiness: '+logs());
    try{if((await fetch(url,{signal:AbortSignal.timeout(1000)})).ok)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw new Error('Lab did not become ready: '+logs());
}
function stop(server){
  if(server.exitCode!==null)return;
  if(process.platform==='win32'){
    // This PID belongs only to the child launched immediately below.
    assert.ok(Number.isInteger(server.pid)&&server.pid>0);
    try{execFileSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{if(server.exitCode===null)server.kill();}
  }else server.kill('SIGTERM');
}
(async()=>{
  const artifacts=path.join(root,'.artifacts');fs.mkdirSync(artifacts,{recursive:true});
  const fresh=fs.mkdtempSync(path.join(artifacts,'advanced-packages-'));
  const results=[];
  for(const [prefix,folder,setting,port]of specs.filter(row=>selected.length?selected.includes(row[0]):row[0]!=='summary')){
    const manifest=require(path.join(root,'assets',prefix+'-files.js'));
    const destination=path.join(fresh,prefix),archive=path.join(root,'downloads',folder+'.zip');
    assert.ok(fs.existsSync(archive),'Missing complete archive '+archive);
    run('powershell.exe',['-NoProfile','-Command','Expand-Archive -LiteralPath $env:ACADEMY_ZIP_PATH -DestinationPath $env:ACADEMY_EXTRACT_PATH'],root,{...process.env,ACADEMY_ZIP_PATH:archive,ACADEMY_EXTRACT_PATH:destination});
    const hashes={};
    for(const [file]of manifest){
      const extracted=path.resolve(destination,file);
      assert.ok(extracted.startsWith(destination+path.sep),'Source entry must stay in its lab');
      hashes[file]=sha(extracted);
      assert.equal(hashes[file],sha(path.join(root,'labs',folder,file)),'Packaged source mismatch '+file);
    }
    run('dotnet',['build'],destination);
    run('dotnet',['run','--no-build','--','--verify'],destination);
    const env={...process.env,[setting]:String(port)};
    const server=spawn('dotnet',['run','--no-build'],{cwd:destination,env,stdio:['ignore','pipe','pipe'],windowsHide:true});
    let logs='';const collect=chunk=>{logs=(logs+chunk.toString()).slice(-16000);};server.stdout.on('data',collect);server.stderr.on('data',collect);
    const url='http://127.0.0.1:'+port;
    try{
      await ready(server,url,()=>logs);
      run(process.execPath,[path.join(root,'tests',prefix+'-app-browser.cjs'),url],root);
    }finally{stop(server);}
    results.push({unit:prefix,sourceFiles:manifest.length,sha256:hashes,passed:true});
    console.log(`PASS: fresh ${prefix} ZIP (${manifest.length} source files), matching hashes, build, C# checks and actual Blazor circuit`);
  }
  fs.writeFileSync(path.join(fresh,'verification.json'),JSON.stringify({passed:true,results},null,2));
  console.log('Packaged verification evidence: '+fresh);
})().catch(error=>{console.error(error);process.exitCode=1;});
