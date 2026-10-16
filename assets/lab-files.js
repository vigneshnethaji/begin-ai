(function(root,factory){
  const files=factory();
  if(typeof module==='object'&&module.exports)module.exports=files;
  else root.AcademyLabFiles=files;
})(typeof globalThis!=='undefined'?globalThis:this,()=>[
  ['SupportDesk.Classifier.csproj','Project file (.csproj)'],
  ['Program.cs','Program.cs: command entry point'],
  ['LabData.cs','LabData.cs: data shapes and validation'],
  ['SupportClassifier.cs','SupportClassifier.cs: model workflow'],
  ['Verification.cs','Verification.cs: executable checks'],
  ['NuGet.Config','NuGet.Config: public package source'],
  ['data/train.tsv','Training data (train.tsv)'],
  ['data/test.tsv','Held-out data (test.tsv)'],
  ['README.md','Lab instructions (.md)']
]);
