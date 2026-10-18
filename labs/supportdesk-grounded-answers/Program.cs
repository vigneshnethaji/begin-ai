using SupportDesk.GroundedAnswers.Services;
using SupportDesk.GroundedAnswers.Verification;
using SupportDesk.GroundedAnswers.Components;

if (args is ["--verify"]) return Verify.Run();
if (args.Length != 0) { Console.Error.WriteLine("Use dotnet run, or dotnet run -- --verify."); return 1; }
string url;
try { url = LabPort.Url(Environment.GetEnvironmentVariable("RAG_LAB_PORT")); }
catch (ArgumentException error) { Console.Error.WriteLine(error.Message); return 1; }
var builder = WebApplication.CreateEmptyBuilder(new WebApplicationOptions {
    Args = [], ContentRootPath = Directory.GetCurrentDirectory(), WebRootPath = "wwwroot"
});
builder.WebHost.UseKestrel().UseUrls(url);
builder.WebHost.UseStaticWebAssets();
builder.Services.AddLogging(logging => logging.AddConsole());
SessionDataProtection.AddTo(builder.Services);
builder.Services.AddRazorComponents().AddInteractiveServerComponents()
    .AddHubOptions(options => options.MaximumReceiveMessageSize = 128 * 1024);
builder.Services.AddScoped<RetrievalService>();
var app = builder.Build();
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
await app.RunAsync();
return 0;
