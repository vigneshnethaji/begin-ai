using SupportDesk.TicketLookup.Verification;
using SupportDesk.TicketLookup.Services;
using SupportDesk.TicketLookup.Components;

// Verification exits before host/configuration creation. EmptyBuilder avoids
// appsettings, user secrets, provider credentials and broad env configuration.
if (args is ["--verify"]) return Verify.Run();
if (args.Length != 0) { Console.Error.WriteLine("Use dotnet run, or dotnet run -- --verify."); return 1; }
string url;
try { url = LabPort.Url(Environment.GetEnvironmentVariable("LOOKUP_LAB_PORT")); }
catch (ArgumentException error) { Console.Error.WriteLine(error.Message); return 1; }
var builder = WebApplication.CreateEmptyBuilder(new WebApplicationOptions
{
    Args = [], ContentRootPath = Directory.GetCurrentDirectory(), WebRootPath = "wwwroot"
});
builder.WebHost.UseKestrel().UseUrls(url);
builder.WebHost.UseStaticWebAssets();
builder.Services.AddLogging(logging => logging.AddConsole());
SessionDataProtection.AddTo(builder.Services);
builder.Services.AddRazorComponents().AddInteractiveServerComponents()
    // Transport envelope is bounded independently from the strict 4000-char
    // editor/parser contract, including multibyte content and event overhead.
    .AddHubOptions(options => options.MaximumReceiveMessageSize = 128 * 1024);
builder.Services.AddScoped<LookupExecutor>();
var app = builder.Build();
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
await app.RunAsync();
return 0;
