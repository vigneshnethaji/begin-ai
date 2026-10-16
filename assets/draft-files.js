(function(root,factory){
  const files=factory();
  if(typeof module==='object'&&module.exports)module.exports=files;
  else root.AcademyDraftFiles=files;
})(typeof globalThis!=='undefined'?globalThis:this,()=>[
  ['SupportDesk.DraftReplies.csproj','Project file (.csproj)'],
  ['NuGet.Config','NuGet.Config: public package source'],
  ['Program.cs','Program.cs: host and server configuration'],
  ['Components/App.razor','App.razor: application shell'],
  ['Components/Routes.razor','Routes.razor: page routing'],
  ['Components/_Imports.razor','Razor imports'],
  ['Components/Pages/Home.razor','Home.razor: draft and review workspace'],
  ['Services/IDraftReplyService.cs','Draft service contract'],
  ['Services/SampleDraftReplyService.cs','Free sample stream'],
  ['Services/OpenAiDraftReplyService.cs','Server-only provider adapter'],
  ['Services/SseReader.cs','Bounded event-stream reader'],
  ['Services/DraftLimits.cs','Input, output and timeout limits'],
  ['Services/DraftReplyException.cs','Provider failure type'],
  ['Services/LabMode.cs','Explicit sample/provider mode'],
  ['Services/LabPort.cs','Validated loopback port configuration'],
  ['Verification/Verify.cs','Local sample verification'],
  ['Verification/HttpChecks.cs','HTTP contract and failure verification'],
  ['Verification/ConfigurationChecks.cs','Mode and port verification'],
  ['Verification/browser-smoke.cjs','Optional developer browser regression'],
  ['wwwroot/app.css','Responsive Material Blue styles'],
  ['README.md','Lab instructions (.md)']
]);
