using SupportDesk.DraftReplies.Verification;
using SupportDesk.DraftReplies.Components;
using SupportDesk.DraftReplies.Services;

// Exit before host/configuration creation: verification never reads credentials.
if (args is ["--verify"]) return await Verify.RunAsync();
if (args.Length != 0)
{
    Console.Error.WriteLine("Use dotnet run, or dotnet run -- --verify.");
    return 1;
}

var mode = Environment.GetEnvironmentVariable("DRAFT_REPLY_PROVIDER") ?? "Sample";
if (!mode.Equals("Sample", StringComparison.OrdinalIgnoreCase) && !mode.Equals("OpenAI", StringComparison.OrdinalIgnoreCase))
{
    Console.Error.WriteLine("DRAFT_REPLY_PROVIDER must be Sample or OpenAI.");
    return 1;
}

// EmptyBuilder deliberately avoids automatic appsettings, user secrets and broad
// environment loading. Only OpenAI mode reads the two named server variables.
int port;
try { port = LabPort.Parse(Environment.GetEnvironmentVariable("DRAFT_REPLY_PORT")); }
catch (ArgumentException error) { Console.Error.WriteLine(error.Message); return 1; }
var builder = WebApplication.CreateEmptyBuilder(new WebApplicationOptions
{
    Args = [],
    ContentRootPath = Directory.GetCurrentDirectory(),
    WebRootPath = "wwwroot"
});
builder.WebHost.UseKestrel().UseUrls($"http://localhost:{port}");
// EmptyBuilder skips the default static-web-assets setup. This localhost-only
// source lab must load build assets (including Blazor's bootstrap script) even
// outside Development, then map their generated endpoints below.
builder.WebHost.UseStaticWebAssets();
builder.Services.AddLogging(logging => logging.AddConsole());
builder.Services.AddRazorComponents().AddInteractiveServerComponents();
var isSample = mode.Equals("Sample", StringComparison.OrdinalIgnoreCase);
builder.Services.AddSingleton(new LabMode(isSample));
if (isSample)
    builder.Services.AddScoped<IDraftReplyService, SampleDraftReplyService>();
else
{
    var model = Environment.GetEnvironmentVariable("OPENAI_MODEL");
    var key = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
    if (string.IsNullOrWhiteSpace(model) || string.IsNullOrWhiteSpace(key))
    {
        Console.Error.WriteLine("OpenAI mode requires server OPENAI_MODEL and OPENAI_API_KEY. No sample fallback.");
        return 1;
    }
    // The container owns/disposes HttpClient. No retry or redirect can create an
    // unexpected second model request; request cancellation covers the body too.
    builder.Services.AddSingleton(_ => new HttpClient(new HttpClientHandler { AllowAutoRedirect = false })
        { Timeout = Timeout.InfiniteTimeSpan });
    builder.Services.AddScoped<IDraftReplyService>(services =>
        new OpenAiDraftReplyService(services.GetRequiredService<HttpClient>(), key, model));
}

var app = builder.Build();
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
await app.RunAsync();
return 0;
