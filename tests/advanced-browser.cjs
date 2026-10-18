// End-to-end navigation, grading, progress and portable artifacts for Units6–11.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const root=path.resolve(__dirname,'..'),out=path.join(root,'.artifacts'),KEY='dotnet-ai-workspace-progress-v1';
const units=[
  {id:'semantic-search',lab:'semantic-search',prefix:'search',name:'Search lessons'},
  {id:'document-answers',lab:'grounded-answers',prefix:'rag',name:'RAG lessons'},
  {id:'production-retrieval',lab:'retrieval-quality',prefix:'retrieval',name:'Retrieval lessons'},
  {id:'agents-workflows',lab:'bounded-workflow',prefix:'workflow',name:'Workflow lessons'},
  {id:'model-choices',lab:'attachment-review',prefix:'inputs',name:'Input and model lessons'},
  {id:'azure-operations',lab:'operations-capstone',prefix:'operations',name:'Operations lessons'}
];
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const browser=await pw.chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(8000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
    const go=async hash=>{await page.goto('http://127.0.0.1:4173/'+hash);await page.locator('main h1').waitFor();};
    const C=require('../assets/curriculum.js');
    const isolated=path.join(out,'advanced-standalone-isolated');fs.mkdirSync(isolated,{recursive:true});
    fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
    const portable=await browser.newPage();portable.on('pageerror',e=>errors.push(e.message));
    for(const u of units){
      await go('#map/'+u.id);
      const stage=page.locator('#unit-'+u.id);
      assert.match(await stage.innerText(),/Available now/);
      assert.equal(await stage.locator('.stage-topics a').count(),6);
      const lessons=C.lessons.filter(x=>x.unitId===u.id);assert.equal(lessons.length,6);
      for(const [index,lesson]of lessons.entries()){
        await go(`#lesson/${lesson.id}/understand`);
        const nav=page.locator('#desktop-navigation').getByRole('navigation',{name:u.name,exact:true});
        assert.equal(await nav.getByRole('link').count(),6);
        assert.match(await page.locator('.lesson-meta').innerText(),new RegExp(`Lesson ${index+1} of 6`));
        await go(`#lesson/${lesson.id}/check`);
        await page.locator(`[data-answer="${(lesson.quiz.answer+1)%3}"]`).click();
        assert.equal(await page.evaluate(([key,id])=>JSON.parse(localStorage.getItem(key)).lessons[id].checked,[KEY,lesson.id]),false);
        await page.locator(`[data-answer="${lesson.quiz.answer}"]`).click();
        assert.equal(await page.evaluate(([key,id])=>JSON.parse(localStorage.getItem(key)).lessons[id].checked,[KEY,lesson.id]),true);
        await go(`#lesson/${lesson.id}/dotnet`);
        assert.equal(await page.getByRole('link',{name:`Open the ${u.prefix} desktop lab`,exact:true}).getAttribute('href'),'#lab/'+u.lab);
      }
      await go(`#lesson/${lessons[0].id}/understand`);
      await page.screenshot({path:path.join(out,`desktop-unit${units.indexOf(u)+6}.png`),fullPage:false});
      await go('#lab/'+u.lab);
      assert.equal(await page.locator('#desktop-navigation').getByRole('navigation',{name:'Lab prerequisites'}).getByRole('link').count(),3);
      await page.locator(`#complete-${u.prefix}-lab`).check();
      assert.equal(await page.evaluate(([key,id])=>JSON.parse(localStorage.getItem(key)).labs[id],[KEY,u.lab]),true);
      const label=`Download complete ${u.prefix} lab (.zip)`;
      const download=page.waitForEvent('download');await page.getByRole('link',{name:label,exact:true}).click();
      const zip=await download;await zip.saveAs(path.join(out,`${u.prefix}-source.zip`));
      const target=zip.suggestedFilename();
      assert.deepEqual(fs.readFileSync(path.join(out,`${u.prefix}-source.zip`)),fs.readFileSync(path.join(root,'downloads',target)));
      const folder=target.replace(/\.zip$/,'');
      for(const [file]of require(`../assets/${u.prefix}-files.js`))assert.equal((await page.request.get(`http://127.0.0.1:4173/labs/${folder}/${file}`)).status(),200);
      await portable.goto(pathToFileURL(path.join(isolated,'standalone.html')).href+'#lab/'+u.lab);
      const embedded=portable.waitForEvent('download');await portable.getByRole('link',{name:label,exact:true}).click();
      await (await embedded).saveAs(path.join(out,`standalone-${u.prefix}-source.zip`));
      assert.deepEqual(fs.readFileSync(path.join(out,`standalone-${u.prefix}-source.zip`)),fs.readFileSync(path.join(root,'downloads',target)));
      await page.setViewportSize({width:390,height:844});
      await go(`#lesson/${lessons[0].id}/try`);
      await page.getByRole('button',{name:'Open course navigation'}).click();
      assert.equal(await page.locator('#course-drawer').getByRole('navigation',{name:u.name,exact:true}).getByRole('link').count(),6);
      await page.keyboard.press('Escape');
      await page.screenshot({path:path.join(out,`mobile-unit${units.indexOf(u)+6}.png`),fullPage:true});
      await page.setViewportSize({width:1440,height:1000});
      console.log(`PASS: ${u.id} mapping, six checks, all .NET links, contextual drawer, lab milestone, complete downloads and isolated portable ZIP`);
    }
    let responsive=0;
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      const routes=units.flatMap(u=>[...C.lessons.filter(l=>l.unitId===u.id).map(l=>`#lesson/${l.id}/try`),'#lab/'+u.lab]);
      for(const hash of routes){await go(hash);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${width} ${hash}`);responsive++;}
    }
    await go('#home');assert.match(await page.locator('main').innerText(),/68 complete lessons across 11 available units/);
    await go('#map');assert.equal(await page.locator('.stage-status.available').count(),11);
    assert.deepEqual(errors,[]);console.log(`PASS: ${responsive} new responsive routes; eleven available units; no page errors or missing assets`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
