// Actual DOM events against the shipped exercise module; no simulated DOM or copied algorithms.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await pw.chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:320,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><body><main id="host" style="max-width:100%;min-width:0"></main></body></html>');
  await page.addStyleTag({content:fs.readFileSync(path.join(root,'styles.css'),'utf8')});
  for(const file of ['retrieval-experiments.js','retrieval-files.js','retrieval-lab.js'])await page.addScriptTag({content:fs.readFileSync(path.join(root,'assets',file),'utf8')});
  const selector=name=>'[data-retrieval-'+name+']',action=name=>'[data-retrieval-action="'+name+'"]';
  const mount=async type=>page.evaluate(type=>{window.disposeRetrieval=window.AcademyRetrievalExperiments.mount(document.querySelector('#host'),type);},type);
  const output=()=>page.locator(selector('output')).innerText();
  await mount('retrieval-evaluation');assert.equal(await page.locator(selector('output')).getAttribute('aria-live'),'polite','Computed output must announce changes');await page.locator(action('evaluate')).click();assert.match(await output(),/Recall@2: 0\.50\nRR@2: 0\.50/);
  await page.locator(selector('k')).selectOption('3');await page.locator(action('evaluate')).click();assert.match(await output(),/Recall@3: 1\.00\nRR@3: 0\.50/);
  await page.locator(selector('retrieved')).fill('A-101,A-101');await page.locator(action('evaluate')).click();assert.match(await output(),/Recall@3: 0\.50\nRR@3: 1\.00/);
  await page.locator(selector('labels')).fill('');await page.locator(action('evaluate')).click();assert.match(await page.locator(selector('feedback')).innerText(),/Unlabelled/);assert.match(await output(),/0\.00/);
  await mount('retrieval-ranking');await page.locator(action('rank')).click();assert.match(await output(),/A-102 v1 · toy score 6[\s\S]*A-101 v1 · toy score 1/);
  await page.locator(selector('ranking')).selectOption('tuned');await page.locator(action('rank')).click();assert.match(await output(),/A-101 v1 · toy score 9[\s\S]*A-102 v1 · toy score 6/);
  assert.doesNotMatch(await output(),/A-104|B-201/);
  await page.locator(action('rank')).click();assert.match(await output(),/Cache: hit/);
  await page.locator(selector('ranking')).selectOption('baseline');await page.locator(action('rank')).click();assert.match(await output(),/A-102 v1 · toy score 6[\s\S]*A-101 v1 · toy score 1/);
  await page.evaluate(()=>window.disposeRetrieval());assert.equal(await page.locator(action('rank')).isDisabled(),true);
  await mount('retrieval-freshness');await page.locator(action('read')).click();assert.match(await output(),/ten minutes/);
  await page.locator(action('update')).click();assert.doesNotMatch(await output(),/ten minutes/);await page.locator(action('read')).click();assert.match(await output(),/ten minutes/);
  await page.locator(action('publish')).click();assert.match(await output(),/Index revision: 2[\s\S]*A-101 v2[\s\S]*five minutes/);
  await page.locator(action('delete')).click();assert.match(await output(),/^Document unavailable/);await page.locator(action('publish')).click();assert.match(await output(),/^Document unavailable/);
  await mount('retrieval-permissions');await page.locator(action('retrieve')).click();assert.match(await output(),/ten minutes/);
  await page.locator(action('retrieve')).click();assert.match(await output(),/Cache: hit/);
  await page.locator(action('revoke')).click();assert.doesNotMatch(await output(),/ten minutes/);await page.locator(action('retrieve')).click();assert.match(await output(),/^Document unavailable/);
  await mount('retrieval-permissions');
  const responses=[];for(const id of ['B-201','A-104','A-999']){await page.locator(selector('target')).fill(id);await page.locator(action('retrieve')).click();responses.push(await output());}
  assert.equal(responses[0],responses[1]);assert.equal(responses[1],responses[2]);assert.doesNotMatch(responses[0],/B-201|A-104|A-999|procedure/);
  await page.locator(selector('target')).fill('A-101');await page.locator(selector('caller')).selectOption('teamB');assert.match(await output(),/earlier response cleared/);await page.locator(action('retrieve')).click();assert.match(await output(),/^Document unavailable/);
  await mount('retrieval-injection');await page.locator(action('injection')).click();assert.match(await output(),/Ignore previous[\s\S]*<script>/);assert.equal(await page.locator('#host script').count(),0);
  await page.locator(action('attack')).click();assert.match(await output(),/^Document unavailable/);assert.doesNotMatch(await output(),/private procedure/);
  await page.locator(action('injection')).click();assert.match(await output(),/Cache: hit/);await page.locator(action('attack')).click();assert.match(await output(),/^Document unavailable/);
  await mount('retrieval-tracing');for(const [scenario,pattern]of [['ranking',/toy-baseline/],['stale',/"indexRevision": 1/],['denied',/"returnedIds": \[\]/],['cache',/scope-rechecked[\s\S]*cache-hit/]]){
   await page.locator(selector('scenario')).selectOption(scenario);await page.locator(action('trace')).click();assert.match(await output(),pattern);assert.doesNotMatch(await output(),/ten minutes|Ignore previous|B-201|password reset/);
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'320px exercise has no page overflow');
  assert.ok(await page.locator('[data-retrieval-feedback][aria-live="polite"]').count());
  await page.evaluate(()=>{
   window.completionCalls=[];window.AcademyLabDownloads={'downloads/supportdesk-retrieval-quality.zip':'blob:local-retrieval-test'};
   window.AcademyRetrievalLab.render({main:document.querySelector('#host'),codeBlock:(code,label)=>{const pre=document.createElement('pre');pre.textContent=label+'\n'+code;return pre.outerHTML;},icon:()=>'',warning:()=>'',breadcrumb:()=>'',bottom:()=>'',state:{labs:{'retrieval-quality':false}},onComplete:value=>window.completionCalls.push(value)});
  });
  assert.equal(await page.getByRole('link',{name:'Download complete retrieval lab (.zip)',exact:true}).getAttribute('href'),'blob:local-retrieval-test');
  assert.equal(await page.locator('#complete-retrieval-lab').isChecked(),false);assert.deepEqual(await page.evaluate(()=>window.completionCalls),[]);
  await page.locator('#complete-retrieval-lab').check();await page.locator('#complete-retrieval-lab').uncheck();assert.deepEqual(await page.evaluate(()=>window.completionCalls),[true,false]);
  assert.equal(await page.locator('.file-links a').count(),14);
  assert.deepEqual(errors,[]);console.log('PASS: six real exercise mounts/events, metrics edits, ranking, source publication/delete, cache/revocation, generic denial, plain-text injection, four trace scenarios, disposal, exact download/completion contracts.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
