// Runs the real mounted exercise DOM and lab renderer without shared integration.
const assert=require('node:assert/strict');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{
  const browser=await pw.chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:320,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setContent('<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main id="host"></main></body></html>');
    await page.addStyleTag({path:path.resolve(__dirname,'../styles.css')});
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/search-experiments.js')});
    const mount=type=>page.evaluate(type=>window.AcademySearchExperiments.mount(document.querySelector('#host'),type),type);
    const output=()=>page.locator('[data-search-output]').innerText();
    await mount('search-arrays');await page.locator('[data-search-action="inspect"]').click();assert.match(await output(),/\[2,0,0,0\]/);
    await page.locator('[data-search-query]').fill('invoice');await page.locator('[data-search-action="inspect"]').click();assert.match(await output(),/\[0,1,0,0\]/);
    await mount('search-cosine');await page.locator('[data-search-direction]').selectOption('diagonal');await page.locator('[data-search-action="calculate"]').click();assert.match(await output(),/0\.7071/);
    await page.locator('[data-search-direction]').selectOption('zero');await page.locator('[data-search-action="calculate"]').click();assert.match(await output(),/0\.0000/);
    await mount('search-meaning');await page.locator('[data-search-action="compare"]').click();assert.match(await output(),/Keyword: No match[\s\S]*Toy vector: Request a refund/);
    await page.locator('[data-search-query]').fill('reimburse me');await page.locator('[data-search-action="compare"]').click();assert.match(await output(),/Toy vector: No match/);
    await mount('search-storage');await page.locator('[data-search-action="check-space"]').click();assert.match(await output(),/Compatible/);
    await page.locator('[data-search-space]').selectOption('toy-topics/v2/4');await page.locator('[data-search-action="check-space"]').click();assert.match(await output(),/Model-space mismatch/);
    await mount('search-index');await page.locator('[data-search-action="scan"]').click();assert.match(await output(),/Compared 6 eligible vectors; top-k 1/);
    await page.locator('[data-search-category]').selectOption('Account');await page.locator('[data-search-action="scan"]').click();assert.match(await output(),/Compared 2 eligible vectors[\s\S]*ART-201/);
    await mount('search-hybrid');await page.locator('[data-search-action="search"]').click();assert.match(await output(),/No matches/);
    await page.locator('[data-search-mode]').selectOption('hybrid');await page.locator('[data-search-action="search"]').click();assert.match(await output(),/ART-101[\s\S]*score 0\.6500/);
    await page.locator('[data-search-category]').selectOption('Account');await page.locator('[data-search-action="search"]').click();assert.match(await output(),/No matches/);
    for(const item of await page.locator('button,input,select').all()){const box=await item.boundingBox();assert.ok(box.height>=44);}
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Exercise fits 320px');
    await page.locator('[data-search-category]').selectOption('All');await page.locator('[data-search-query]').fill('<img src=x onerror=alert(1)>');await page.locator('[data-search-action="search"]').click();assert.equal(await page.locator('#host img').count(),0);
    console.log('PASS six real mounted search exercises: arrays, cosine, meaning, storage, index, hybrid, 320px and text safety.');
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/search-files.js')});
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/search-lab.js')});
    await page.evaluate(()=>{
      window.completions=[];window.AcademyLabDownloads={'downloads/supportdesk-semantic-search.zip':'blob:local-search-test'};
      window.AcademySearchLab.render({main:document.querySelector('#host'),codeBlock:(code,label)=>'<pre>'+label+'\n'+code+'</pre>',icon:()=>'',warning:()=>'',breadcrumb:title=>'<p>'+title+'</p>',bottom:()=>'',state:{labs:{}},onComplete:value=>window.completions.push(value)});
    });
    assert.equal(await page.getByRole('link',{name:'Download complete search lab (.zip)',exact:true}).getAttribute('href'),'blob:local-search-test');
    assert.equal(await page.locator('#complete-search-lab').isChecked(),false);assert.deepEqual(await page.evaluate(()=>window.completions),[]);
    await page.locator('#complete-search-lab').check();await page.locator('#complete-search-lab').uncheck();assert.deepEqual(await page.evaluate(()=>window.completions),[true,false]);
    assert.deepEqual(errors,[]);console.log('PASS search lab renderer: exact ZIP label, download override, completion off by default, explicit completion callback.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
