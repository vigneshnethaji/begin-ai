// Isolated local component test; never reads or controls the user's browser tab.
const assert=require('node:assert/strict');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{
 const browser=await pw.chromium.launch();
 try{
  const page=await browser.newPage();await page.setContent('<main id="host"></main>');
  await page.addScriptTag({path:path.resolve(__dirname,'../assets/rag-experiments.js')});
  for(const type of ['rag-retrieve','rag-chunks','rag-evidence','rag-context','rag-citations','rag-evaluate']){
   await page.evaluate(t=>window.AcademyRagExperiments.mount(document.querySelector('#host'),t),type);
   const result=page.locator('[data-rag-output]');
   assert.equal(await result.getAttribute('role'),'status',type+' must announce its changing result, not only a generic hint');
   assert.equal(await result.getAttribute('aria-live'),'polite');
   assert.equal(await result.getAttribute('aria-atomic'),'true');
   const before=await result.innerText();await page.locator('[data-rag-action]').first().click();
   assert.notEqual(await result.innerText(),before,type+' must update the announced result');
  }
  await page.evaluate(()=>window.AcademyRagExperiments.mount(document.querySelector('#host'),'rag-citations'));
  await page.locator('[data-rag-action="check"]').click();assert.match(await page.locator('[data-rag-output]').innerText(),/Quote not found/);
  await page.locator('[data-rag-action="quote"]').click();assert.match(await page.locator('[data-rag-output]').innerText(),/Exact quote found/);
  console.log('PASS: all six changing RAG results are live/atomic status regions; repeat quote checks announce the actual changed outcome');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
