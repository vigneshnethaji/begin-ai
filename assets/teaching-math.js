/* Small arithmetic demonstrations, not a trainer, tokenizer or model benchmark. */
(function(root,factory){
 const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.AcademyTeachingMath=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function binaryMetrics({tp,fp,fn,tn}){
  for(const n of [tp,fp,fn,tn])if(!Number.isInteger(n)||n<0||n>1000000)throw new RangeError('Counts must be whole numbers from 0 to 1000000.');
  const total=tp+fp+fn+tn,divide=(a,b)=>b===0?null:a/b;
  return {total,correct:tp+tn,accuracy:divide(tp+tn,total),precision:divide(tp,tp+fp),recall:divide(tp,tp+fn),f1:divide(2*tp,2*tp+fp+fn)};
 }
 function linearStep(weight,rate){
  if(!Number.isFinite(weight)||!Number.isFinite(rate)||Math.abs(weight)>1000000||rate<=0||rate>1)throw new RangeError('Use a finite weight and a learning rate greater than 0 and at most 1.');
  // One authored regression example: input=2, target=4, prediction=weight*input.
  const before=weight*2,beforeLoss=(before-4)**2,gradient=2*(before-4)*2;
  const updated=weight-rate*gradient,after=updated*2;
  return {before,beforeLoss,weight:updated,after,afterLoss:(after-4)**2};
 }
 return {binaryMetrics,linearStep};
});
