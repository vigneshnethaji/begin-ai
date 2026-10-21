const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const math=fs.existsSync(require('node:path').join(__dirname,'../assets/teaching-math.js'))?require('../assets/teaching-math.js'):{};
test('an always-General classifier exposes missed Billing tickets despite 90 percent accuracy',()=>{
 assert.equal(typeof math.binaryMetrics,'function');
 assert.deepEqual(math.binaryMetrics({tp:0,fp:0,fn:10,tn:90}),{total:100,correct:90,accuracy:0.9,precision:null,recall:0,f1:0});
});
test('binary metrics use distinct prediction and actual-class denominators',()=>{
 assert.equal(typeof math.binaryMetrics,'function');
 assert.deepEqual(math.binaryMetrics({tp:8,fp:2,fn:2,tn:88}),{total:100,correct:96,accuracy:0.96,precision:0.8,recall:0.8,f1:0.8});
 const m=math.binaryMetrics({tp:3,fp:1,fn:2,tn:4});assert.equal(m.precision,0.75);assert.equal(m.recall,0.6);assert.ok(Math.abs(m.f1-2/3)<1e-12);
});
test('undefined metrics remain undefined rather than reporting false perfect or zero evidence',()=>{
 assert.equal(typeof math.binaryMetrics,'function');
 assert.deepEqual(math.binaryMetrics({tp:0,fp:0,fn:0,tn:0}),{total:0,correct:0,accuracy:null,precision:null,recall:null,f1:null});
 assert.equal(math.binaryMetrics({tp:0,fp:3,fn:0,tn:7}).recall,null);
});
test('metric calculator rejects negative, fractional, nonnumeric and excessive counts',()=>{
 assert.equal(typeof math.binaryMetrics,'function');
 for(const tp of [-1,0.5,NaN,Infinity,'8',1000001])assert.throws(()=>math.binaryMetrics({tp,fp:0,fn:0,tn:1}),RangeError);
});
test('one illustrative gradient step changes a weight and reduces this example squared error',()=>{
 assert.equal(typeof math.linearStep,'function');
 const s=math.linearStep(0,0.1);assert.equal(s.before,0);assert.equal(s.beforeLoss,16);assert.equal(s.weight,1.6);assert.equal(s.after,3.2);assert.ok(Math.abs(s.afterLoss-0.64)<1e-12);
 const next=math.linearStep(s.weight,0.1);assert.ok(Math.abs(next.weight-1.92)<1e-12);
});
test('an excessive learning step can increase error instead of promising every update improves',()=>{
 assert.equal(typeof math.linearStep,'function');
 const s=math.linearStep(0,0.5);assert.equal(s.weight,8);assert.equal(s.after,16);assert.equal(s.afterLoss,144);
 for(const v of [NaN,Infinity,'0'])assert.throws(()=>math.linearStep(v,0.1),RangeError);
});
