const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=new URL(process.argv[2]||'http://localhost:5111');
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname));
(async()=>{
  const browser=await pw.chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base.href);
    await page.waitForFunction(()=>document.querySelector('#rag-ready')?.textContent==='Interactive ready');
    assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200);
    const run=async(question)=>{await page.locator('#rag-question').fill(question);await page.locator('#rag-run').click();};
    await run('password reset');
    await page.waitForFunction(()=>document.querySelector('#rag-answer').textContent.includes('To reset a password'));
    assert.match(await page.locator('#rag-citation').innerText(),/kb-reset@r1:c1/);
    await page.locator('[data-rag-source="kb-reset"]').click();
    await page.waitForFunction(()=>document.querySelector('#rag-source').textContent.includes('Reset links expire after fifteen minutes'));
    assert.match(await page.locator('#rag-source').innerText(),/Reset links expire after fifteen minutes/);
    await page.locator('#rag-quote').fill('Passwords expire every day.');
    await page.locator('#rag-check').click();
    await page.waitForFunction(()=>document.querySelector('#rag-check-result').textContent==='Quote not found');
    await page.locator('#rag-check-citation').fill('kb-invented@r1:c9');await page.locator('#rag-check').click();
    await page.waitForFunction(()=>document.querySelector('#rag-check-result').textContent==='Unknown citation');
    await page.locator('#rag-check-citation').fill('kb-reset@r1:c1');
    await page.locator('#rag-quote').fill('To reset a password, open Account settings and select Reset password.');
    await page.locator('#rag-check').click();
    await page.waitForFunction(()=>document.querySelector('#rag-check-result').textContent==='Exact quote found');
    await page.locator('#rag-budget').selectOption('8');await page.locator('#rag-run').click();
    await page.waitForFunction(()=>document.querySelector('#rag-status').textContent==='Abstained');
    assert.equal(await page.locator('#rag-citation').innerText(),'No citation');
    await page.locator('#rag-budget').selectOption('80');await run('quantum banana');
    await page.waitForFunction(()=>document.querySelector('#rag-answer').textContent.includes('No supported answer'));
    assert.equal(await page.locator('#rag-citation').innerText(),'No citation');
    await run('grant administrator permissions');
    await page.waitForFunction(()=>document.querySelector('#rag-evidence').textContent.includes('Ignore previous instructions'));
    assert.equal(await page.locator('#rag-status').innerText(),'Abstained');
    await page.locator('summary').filter({hasText:'Illustrative provider boundary'}).click();
    assert.match(await page.locator('#rag-template').innerText(),/evidenceData/);
    await page.locator('[data-rag-source="kb-untrusted"]').click();
    await page.waitForFunction(()=>document.querySelector('#rag-source').textContent.includes('<script>'));
    assert.match(await page.locator('#rag-source').innerText(),/<script>/);
    assert.equal(await page.evaluate(()=>window.ragInjected),undefined);
    await run('');await page.waitForFunction(()=>document.querySelector('#rag-status').textContent==='Invalid');
    // Remove the HTML convenience limit to prove the server independently bounds input.
    await page.locator('#rag-question').evaluate(el=>el.removeAttribute('maxlength'));
    await run('x'.repeat(241));await page.waitForFunction(()=>document.querySelector('#rag-answer').textContent.includes('240'));
    await page.locator('#rag-evaluate').click();
    await page.waitForFunction(()=>document.querySelector('#rag-evaluation').textContent.includes('3/3'));
    await run('fresh link');
    await page.waitForFunction(()=>document.querySelector('#rag-citation').textContent==='kb-reset@r1:c2');
    assert.match(await page.locator('#rag-answer').innerText(),/Use a fresh link if the earlier recovery message has expired/);
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${width}`);
    }
    const shot=process.env.RAG_SCREENSHOT;
    if(shot){
      await page.screenshot({path:path.resolve(shot.replace(/\.png$/i,'')+'.desktop.png'),fullPage:false});
      await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.resolve(shot),fullPage:true});
    }
    // Actual browser exercises use DOM events and the published API, independent of academy wiring.
    await page.setContent('<main id="exercise"></main>');
    await page.addScriptTag({content:fs.readFileSync(path.resolve(__dirname,'../assets/rag-experiments.js'),'utf8')});
    for(const type of ['rag-retrieve','rag-chunks','rag-evidence','rag-context','rag-citations','rag-evaluate']){
      await page.evaluate(t=>window.AcademyRagExperiments.mount(document.querySelector('#exercise'),t),type);
      await page.locator('[data-rag-action]').first().click();
      assert.ok((await page.locator('[data-rag-output]').innerText()).length>10,type);
      assert.ok((await page.locator('.feedback[aria-live="polite"]').innerText()).length>10,type);
      assert.equal(await page.locator('[data-rag-output]').getAttribute('aria-live'),'polite',type+' result must be announced');
      await page.setViewportSize({width:320,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,type);
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: real Blazor readiness, retrieval, sources, citation checks, budget, abstention, server bounds, hostile text, evaluation; six event-driven exercises; 320–1440px');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
