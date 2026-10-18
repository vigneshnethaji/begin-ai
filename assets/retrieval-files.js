(function(root,factory){const files=factory();if(typeof module==='object'&&module.exports)module.exports=files;else root.AcademyRetrievalFiles=files;})(typeof globalThis!=='undefined'?globalThis:this,()=>[
  ['SupportDesk.RetrievalQuality.csproj','Project file (.csproj)'],
  ['NuGet.Config','Offline package sources (cleared)'],
  ['Program.cs','Loopback host and verification entry point'],
  ['Components/App.razor','Blazor application shell'],
  ['Components/Routes.razor','Page routing'],
  ['Components/_Imports.razor','Razor imports'],
  ['Components/Pages/Home.razor','Interactive retrieval workspace'],
  ['Services/RetrievalEngine.cs','Scope, ranking, cache, snapshots and traces'],
  ['Services/RetrievalMetrics.cs','Recall, reciprocal rank and evaluation DTOs'],
  ['Services/LabPort.cs','Validated optional loopback port'],
  ['Services/SessionDataProtection.cs','Ephemeral protection and memory key repository'],
  ['Verification/Verify.cs','Executable service verification'],
  ['wwwroot/app.css','Responsive Material Blue design'],
  ['README.md','Run, verify, limitations and file manifest']
]);
