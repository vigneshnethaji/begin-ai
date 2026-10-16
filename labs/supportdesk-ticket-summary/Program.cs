using SupportDesk.TicketSummary.Services;
using SupportDesk.TicketSummary.Verification;
using SupportDesk.TicketSummary.Components;

// Verify exits before host creation. EmptyBuilder avoids appsettings, secrets,
// default environment loading and provider configuration in normal mode too.
if (args is ["--verify"]) return Verify.Run();
if (args.Length != 0) { Console.Error.WriteLine("Use dotnet run, or dotnet run -- --verify."); return 1; }
int port;
try { port = LabPort.Parse(Environment.GetEnvironmentVariable("SUMMARY_LAB_PORT")); }
catch (ArgumentException error) { Console.Error.WriteLine(error.Message); return 1; }
var builder = WebApplication.CreateEmptyBuilder(new WebApplicationOptions
{
    Args = [], ContentRootPath = Directory.GetCurrentDirectory(), WebRootPath = "wwwroot"
});
builder.WebHost.UseKestrel().UseUrls($"http://localhost:{port}");
// Required with EmptyBuilder, including outside Development, to serve Blazor.
builder.WebHost.UseStaticWebAssets();
builder.Services.AddLogging(logging => logging.AddConsole());
builder.Services.AddSessionDataProtection();
builder.Services.AddRazorComponents().AddInteractiveServerComponents()
    // Keep transport bounded while allowing the advertised 16000-character
    // editor payload, including multibyte text and its event envelope.
    .AddHubOptions(options => options.MaximumReceiveMessageSize = 128 * 1024);
builder.Services.AddSingleton<SummaryValidator>();
builder.Services.AddSingleton<PromptComparison>();
var app = builder.Build();
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
await app.RunAsync();
return 0;
