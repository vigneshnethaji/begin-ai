// Real keyboard traversal checks that fixed navigation does not cover focused controls.
const assert=require('node:assert/strict');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{const browser=await pw.chromium.launch();try{
 const page=await browser.newPage({viewport:{width:320,height:844},reducedMotion:'reduce'});page.setDefaultTimeout(8000);let checked=0;
 for(const [hash,enlarged]of [...['#home','#map','#lesson/prompt-roles/try','#progress','#lab/bounded-workflow'].map(h=>[h,false]),['#home',true]]){
  await page.goto('http://127.0.0.1:4173/?focus='+checked+hash);
  if(enlarged){await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body,body *')].map(n=>[n,parseFloat(getComputedStyle(n).fontSize)]);for(const [n,size]of sizes)if(n instanceof HTMLElement)n.style.fontSize=(size*2)+'px';});}
  await page.waitForFunction(()=>{const s=getComputedStyle(document.documentElement);return Math.abs(parseFloat(s.getPropertyValue('--header-offset'))-document.querySelector('.app-header').getBoundingClientRect().height)<1&&Math.abs(parseFloat(s.getPropertyValue('--bottom-nav-offset'))-document.querySelector('.mobile-bottom-nav').getBoundingClientRect().height)<1;});
  for(let i=0;i<35;i++){
   await page.keyboard.press('Tab');
   const result=await page.evaluate(()=>{
    const n=document.activeElement;if(!(n instanceof HTMLElement)||n===document.body)return null;
    // Wrapped inline links have multiple fragments; their union's center may be
    // empty paragraph space. Hit-test real fragments rather than that empty gap.
    const rects=[...n.getClientRects()].filter(b=>b.width>0&&b.height>0&&b.bottom>0&&b.top<innerHeight&&b.right>0&&b.left<innerWidth);
    const hits=rects.map(b=>{const x=(Math.max(0,b.left)+Math.min(innerWidth-1,b.right))/2,y=(Math.max(0,b.top)+Math.min(innerHeight-1,b.bottom))/2;const top=document.elementFromPoint(x,y);return {uncovered:top===n||n.contains(top),cover:top?.tagName+' '+top?.className,top:b.top,bottom:b.bottom};});
    return {tag:n.tagName,text:(n.getAttribute('aria-label')||n.textContent).trim().slice(0,80),visible:rects.length>0,uncovered:hits.some(h=>h.uncovered),hits};
   });
   if(result){assert.ok(result.visible&&result.uncovered,hash+' '+JSON.stringify(result));checked++;}
  }
 }
 console.log('PASS mobile keyboard: '+checked+' visible, unobscured focus stops at 320px across Home, map, exercise, progress and lab, including doubled-text Home.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
