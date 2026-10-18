// Real event-driven Blazor tests. Run against an already started local lab.
const assert=require('node:assert/strict');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=new URL(process.argv[2]||'http://localhost:5109');
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Local lab only');
(async()=>{
  const browser=await pw.chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base.href);
    await page.waitForFunction(()=>document.querySelector('#search-run')?.disabled===false);
    assert.equal((await page.request.get(new URL('/app.css',base).href)).status(),200);
    assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200);
    assert.match(await page.locator('body').innerText(),/toy|hand-authored/i);
    const run=async(expected)=>{await page.locator('#search-run').click();await page.waitForFunction(text=>document.querySelector('#search-status').textContent.includes(text),expected);};
    await page.locator('#search-query').fill('money back');
    await page.locator('#search-mode').selectOption('keyword');await run('No matches');
    assert.equal(await page.locator('[data-search-hit]').count(),0);
    await page.locator('#search-mode').selectOption('vector');await run('Search complete');
    assert.equal(await page.locator('[data-search-hit]').first().getAttribute('data-search-hit'),'ART-101');
    assert.match(await page.locator('#query-vector').innerText(),/\[2, 0, 0, 0\]/);
    assert.match(await page.locator('#search-results').innerText(),/1\.0000/);
    await page.locator('#search-mode').selectOption('hybrid');await run('Search complete');
    assert.match(await page.locator('#search-results').innerText(),/0\.6500/);
    await page.locator('#search-query').fill('refund password');
    await page.locator('#search-category').selectOption('Account');await page.locator('#search-k').selectOption('1');await run('Search complete');
    assert.equal(await page.locator('[data-search-hit]').count(),1);
    assert.equal(await page.locator('[data-search-hit]').first().getAttribute('data-search-hit'),'ART-201');
    await page.locator('#search-space').selectOption('toy-topics/v2/4');await run('Model-space mismatch');
    assert.equal(await page.locator('[data-search-hit]').count(),0);
    await page.locator('#search-space').selectOption('toy-topics/v1/4');
    await page.locator('#search-query').fill('');await run('Enter a query');
    await page.locator('#search-query').fill('unmapped vocabulary');await run('No matches');
    await page.locator('#cosine-case').selectOption('orthogonal');await page.locator('#cosine-run').click();
    await page.waitForFunction(()=>document.querySelector('#cosine-result').textContent.includes('0.0000'));
    await page.locator('#cosine-case').selectOption('zero');await page.locator('#cosine-run').click();
    await page.waitForFunction(()=>document.querySelector('#cosine-result').textContent.includes('zero-vector policy'));
    await page.setViewportSize({width:320,height:900});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'No horizontal overflow at 320px');
    for(const id of ['search-run','cosine-run','search-query','search-mode']){
      const box=await page.locator('#'+id).boundingBox();assert.ok(box.height>=44,id+' minimum target');
    }
    await page.locator('#search-run').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator('#search-run').evaluate(e=>e===document.activeElement),true);
    assert.equal(await page.locator('#search-run').evaluate(e=>getComputedStyle(e).outlineStyle),'solid','Keyboard focus has a visible outline');
    assert.deepEqual(errors,[]);console.log('PASS search lab: readiness, real lexical/vector/hybrid events, scores, prefilter/top-k, mismatch, empty/unknown query, cosine, 320px and keyboard focus.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
