// Two developer-owned tabs share one fresh origin/storage context.
const assert=require('node:assert/strict');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{const b=await pw.chromium.launch();try{
 const context=await b.newContext();await context.addInitScript(()=>{window.visitWrites=0;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='dotnet-ai-workspace-progress-v1'&&++window.visitWrites>12)return;return original.call(this,key,value);};});
 const a=await context.newPage(),c=await context.newPage();
 await a.goto('http://127.0.0.1:4173/?two-tab=a#lesson/rules/try');await a.locator('#rule-message').fill('Keep this unfinished exercise');
 await a.locator('#desktop-navigation a[href="#lesson/rules/understand"]').focus();
 await c.goto('http://127.0.0.1:4173/?two-tab=b#lesson/vector-arrays/understand');await c.locator('main h1').waitFor();
 // Observe for repeated asynchronous storage publications; cap above prevents
 // an unfixed loop consuming the diagnostic browser indefinitely.
 await a.waitForTimeout(500);
 const count=await a.evaluate(()=>window.visitWrites)+await c.evaluate(()=>window.visitWrites);
 assert.equal(count,2,'Storage-driven rendering must not publish another visit');
 assert.equal(await a.evaluate(()=>JSON.parse(localStorage.getItem('dotnet-ai-workspace-progress-v1')).lastVisited.lessonId),'vector-arrays');
 assert.equal(await a.locator('#rule-message').inputValue(),'Keep this unfinished exercise','another tab must not clear this exercise');
 assert.equal(await a.evaluate(()=>document.activeElement?.getAttribute('href')),'#lesson/rules/understand','remote visits must preserve navigation focus');
 await a.goto('http://127.0.0.1:4173/#lesson/rules/understand');await a.locator('#mark-read').check();
 await c.evaluate(()=>{const key='dotnet-ai-workspace-progress-v1',s=JSON.parse(localStorage.getItem(key));s.lessons.rules.read=false;localStorage.setItem(key,JSON.stringify(s));});
 await a.waitForFunction(()=>document.querySelector('[data-read-status]')?.textContent==='Not marked as read');
 assert.equal(await a.locator('#mark-read').isChecked(),false,'remote read changes must synchronize the checkbox');
 await a.goto('http://127.0.0.1:4173/#lab');await a.locator('#complete-lab').waitFor();
 await c.evaluate(()=>{const key='dotnet-ai-workspace-progress-v1',s=JSON.parse(localStorage.getItem(key));s.labs['rules-baseline']=true;localStorage.setItem(key,JSON.stringify(s));});
 await a.waitForFunction(()=>document.querySelector('#complete-lab')?.checked===true);
 await context.close();
 console.log('PASS: two shared-storage lesson tabs publish only their two real visits, without a storage loop');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
