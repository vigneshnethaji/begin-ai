const assert=require('node:assert/strict');const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{const browser=await pw.chromium.launch();try{
  const page=await browser.newPage({viewport:{width:320,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<main><div id="exercise"></div></main>');
  await page.addScriptTag({path:path.resolve(__dirname,'../assets/inputs-experiments.js')});
  const mount=async type=>page.evaluate(t=>window.AcademyInputsExperiments.mount(document.querySelector('#exercise'),t),type);
  const run=async()=>{await page.locator('[data-inputs-action="run"]').click();return JSON.parse(await page.locator('[data-inputs-output]').innerText());};
  await mount('inputs-image');assert.equal((await run()).outcome,'OCR text candidate');await page.locator('[data-inputs-field="task"]').selectOption('damage');assert.match(await page.locator('[data-inputs-output]').innerText(),/changed/i);assert.equal((await run()).outcome,'Vision assessment required');await page.locator('[data-inputs-field="text"]').fill('');assert.equal((await run()).outcome,'Denied');
  await mount('inputs-speech');assert.equal((await run()).outcome,'Needs review');await page.locator('[data-inputs-field="end"]').fill('3');assert.equal((await run()).outcome,'Denied');
  await mount('inputs-evidence');assert.deepEqual((await run()).values,['image-1: 120','audio-1: 170']);await page.locator('[data-inputs-field="image"]').fill('<img src=x onerror=alert(1)>');await run();assert.equal(await page.locator('#exercise img').count(),0);await page.locator('[data-inputs-field="image"]').fill('');assert.equal((await run()).outcome,'Denied');
  await mount('inputs-local');assert.equal((await run()).profile,'local-text');
  const memorySyntaxOutcomes=[];
  for(const value of ['8.0','1e1']){await page.locator('[data-inputs-field="memory"]').fill(value);assert.equal(await page.locator('[data-inputs-field="memory"]').inputValue(),value);memorySyntaxOutcomes.push((await run()).outcome);}
  assert.deepEqual(memorySyntaxOutcomes,['Denied','Denied'],'Decimal and exponent memory syntax must be denied before numeric coercion');
  await page.locator('[data-inputs-field="memory"]').fill('8');assert.equal((await run()).profile,'local-text');
  await page.locator('[data-inputs-field="capability"]').selectOption('vision');assert.equal((await run()).outcome,'No eligible profile');await page.locator('[data-inputs-field="noCloud"]').uncheck();assert.equal((await run()).profile,'cloud-general');await page.locator('[data-inputs-field="memory"]').fill('-1');assert.equal((await run()).outcome,'Denied');
  await mount('inputs-quant');assert.equal((await run()).speedRatio,0.8);await page.locator('[data-inputs-field="accuracy"]').fill('0.85');assert.equal((await run()).outcome,'Reject candidate');await page.locator('[data-inputs-field="after"]').fill('0');assert.equal((await run()).outcome,'Denied');
  await mount('inputs-tune');assert.equal((await run()).outcome,'Try RAG');await page.locator('[data-inputs-field="need"]').selectOption('format');assert.equal((await run()).outcome,'Evaluate fine-tuning candidate');await page.locator('[data-inputs-field="heldout"]').fill('-1');assert.equal((await run()).outcome,'Denied');
  for(const type of ['inputs-image','inputs-speech','inputs-evidence','inputs-local','inputs-quant','inputs-tune']){
    await mount(type);const output=page.locator('[data-inputs-output]');assert.equal(await output.getAttribute('role'),'status');assert.equal(await output.getAttribute('aria-live'),'polite');assert.equal(await output.getAttribute('aria-atomic'),'true');
    for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${type} ${width}`);}
    for(const control of await page.locator('#exercise input,#exercise select,#exercise button').all()){assert.ok(await control.evaluate(n=>n.getBoundingClientRect().height>=44));await control.focus();assert.ok(await control.evaluate(n=>parseFloat(getComputedStyle(n).outlineWidth)>=2));}
  }
  await page.evaluate(()=>{const node=document.querySelector('#exercise');const old=window.AcademyInputsExperiments.mount(node,'inputs-image');window.AcademyInputsExperiments.mount(node,'inputs-speech');old();});assert.equal((await run()).outcome,'Needs review');
  await page.evaluate(()=>{window.AcademyInputsExperiments.mount(document.querySelector('#exercise'),'inputs-image')();});assert.equal(await page.locator('[data-inputs-action="run"]').isDisabled(),true);
  await page.addScriptTag({path:path.resolve(__dirname,'../assets/inputs-files.js')});await page.addScriptTag({path:path.resolve(__dirname,'../assets/inputs-lab.js')});
  await page.evaluate(()=>{window.events=[];window.AcademyLabDownloads={'downloads/supportdesk-attachment-review.zip':'blob:inputs-zip'};window.AcademyInputsLab.render({main:document.querySelector('main'),codeBlock:c=>{const p=document.createElement('pre');p.textContent=c;return p.outerHTML;},icon:()=>'',warning:()=>'',breadcrumb:()=>'',bottom:()=>'',state:{labs:{'attachment-review':false}},onComplete:v=>window.events.push(v)});});
  assert.equal(await page.getByRole('link',{name:'Download complete inputs lab (.zip)',exact:true}).getAttribute('href'),'blob:inputs-zip');await page.locator('#complete-inputs-lab').check();await page.locator('#complete-inputs-lab').uncheck();assert.deepEqual(await page.evaluate(()=>window.events),[true,false]);
  assert.deepEqual(errors,[]);console.log('PASS inputs exercises: six interactive calculators; negative cases; stale feedback; safe text; disposal; 320/390/768/1440; focus/44px; ZIP override; explicit completion.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
