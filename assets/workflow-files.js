(function(root,factory){const files=factory();if(typeof module==='object'&&module.exports)module.exports=files;else root.AcademyWorkflowFiles=files;})(typeof globalThis!=='undefined'?globalThis:this,()=>[
  ['SupportDesk.BoundedWorkflow.csproj','Project file (.csproj)'],
  ['NuGet.Config','NuGet.Config: no package sources or dependencies'],
  ['Program.cs','Program.cs: loopback host and independent verification'],
  ['Components/App.razor','App.razor: application shell'],
  ['Components/Routes.razor','Routes.razor: routing'],
  ['Components/_Imports.razor','Razor imports'],
  ['Components/Pages/Home.razor','Home.razor: interactive workflow workspace'],
  ['Services/Workflow.cs','Bounded state machine, approval and recovery'],
  ['Services/LabPort.cs','Validated loopback port'],
  ['Services/SessionDataProtection.cs','Memory-only data protection and key repository'],
  ['Verification/Verify.cs','Executable production-service checks'],
  ['wwwroot/app.css','Responsive Material Blue styles'],
  ['README.md','Run, verify and understand the lab']
]);
