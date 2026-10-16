using SupportDesk.DraftReplies.Services;

namespace SupportDesk.DraftReplies.Verification;

// No test packages or network: this runner returns a failing process exit code.
internal static partial class Verify
{
    private static readonly List<(string Name, Func<Task> Run)> Tests = [];

    public static async Task<int> RunAsync()
    {
        AddSampleTests();
        AddHttpTests();
        AddConfigurationTests();
        var failures = 0;
        foreach (var (name, run) in Tests)
        {
            try { await run(); Console.WriteLine($"PASS {name}"); }
            catch (Exception error) { failures++; Console.Error.WriteLine($"FAIL {name}: {error.Message}"); }
        }
        Console.WriteLine($"{Tests.Count - failures}/{Tests.Count} checks passed (local only).");
        return failures == 0 ? 0 : 1;
    }

    private static void AddSampleTests()
    {
        // Breaks caught: empty/single-chunk samples, lost cancellation, missing validation.
        Tests.Add(("sample streams several deterministic chunks", async () =>
        {
            var chunks = await Collect(new SampleDraftReplyService(), "My fictional parcel is late.");
            Check(chunks.Count > 1, "Expected incremental chunks.");
            Check(string.Concat(chunks).Contains("Thank you for contacting"), "Expected a support draft.");
            Check(string.Concat(chunks) == string.Concat(await Collect(new SampleDraftReplyService(), "Another fictional issue.")),
                "Sample must be a clearly fixed teaching fixture.");
        }));
        Tests.Add(("sample stops after cancellation between chunks", async () =>
        {
            using var stop = new CancellationTokenSource();
            await using var stream = new SampleDraftReplyService().StreamAsync("Fictional issue", stop.Token).GetAsyncEnumerator();
            Check(await stream.MoveNextAsync(), "Expected first chunk.");
            stop.Cancel();
            await Throws<OperationCanceledException>(async () => { await stream.MoveNextAsync(); });
        }));
        foreach (var input in new[] { "", "   ", new string('a', 2001) })
        {
            var value = input;
            Tests.Add(($"sample rejects invalid input length {value.Length}", async () =>
                await Throws<ArgumentException>(async () => { await Collect(new SampleDraftReplyService(), value); })));
        }
        Tests.Add(("sample accepts input at limit", async () =>
            Check((await Collect(new SampleDraftReplyService(), new string('a', 2000))).Count > 0, "Expected valid input.")));
    }

    private static async Task<List<string>> Collect(IDraftReplyService service, string ticket,
        CancellationToken token = default)
    {
        var chunks = new List<string>();
        await foreach (var chunk in service.StreamAsync(ticket, token)) chunks.Add(chunk);
        return chunks;
    }

    private static void Check(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static async Task Throws<T>(Func<Task> action) where T : Exception
    {
        try { await action(); }
        catch (T) { return; }
        throw new InvalidOperationException($"Expected {typeof(T).Name}.");
    }
}
