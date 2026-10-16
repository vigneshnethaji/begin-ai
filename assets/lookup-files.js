(function(root,factory){
  const files=factory();
  if(typeof module==='object'&&module.exports)module.exports=files;
  else root.AcademyLookupFiles=files;
})(typeof globalThis!=='undefined'?globalThis:this,()=>[
  ['SupportDesk.TicketLookup.csproj','Project file (.csproj)'],
  ['NuGet.Config','NuGet.Config: public package source'],
  ['Program.cs','Program.cs: local demo host'],
  ['Components/App.razor','App.razor: application shell'],
  ['Components/Routes.razor','Routes.razor: page routing'],
  ['Components/_Imports.razor','Razor imports'],
  ['Components/Pages/Home.razor','Home.razor: proposal and execution workspace'],
  ['Services/ProposalParser.cs','Strict proposal and argument boundary'],
  ['Services/LookupExecutor.cs','Authorization, approval, replay and audit'],
  ['Services/LabPort.cs','Validated local port configuration'],
  ['Services/SessionDataProtection.cs','Memory-only local data protection'],
  ['Verification/Verify.cs','Executable local verification'],
  ['wwwroot/app.css','Responsive Material Blue styles'],
  ['README.md','Lab instructions (.md)'],
  ['IMPLEMENTATION.md','Implementation notes (.md)']
]);
