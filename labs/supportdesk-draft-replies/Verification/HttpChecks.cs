using System.Net;
using System.Text;
using System.Text.Json;
using SupportDesk.DraftReplies.Services;

namespace SupportDesk.DraftReplies.Verification;

internal static partial class Verify
{
    // Breaks caught: wrong request fields, terminal events ignored, unbounded data,
    // buffered instead of streamed results, cancellation not reaching transport.
    private static void AddHttpTests()
    {
        Tests.Add(("HTTP request uses Responses contract and streams text", async () =>
        {
            using var client = Client(async (request, token) =>
            {
                Check(request.Method == HttpMethod.Post && request.RequestUri?.ToString() == "https://api.openai.com/v1/responses", "Wrong endpoint.");
                Check(request.Headers.Authorization?.Scheme == "Bearer" && request.Headers.Authorization.Parameter == "fake-test-key", "Wrong server auth.");
                Check(request.Headers.Accept.Any(x => x.MediaType == "text/event-stream"), "Expected SSE accept.");
                using var json = JsonDocument.Parse(await request.Content!.ReadAsStringAsync(token));
                var root = json.RootElement;
                Check(root.GetProperty("model").GetString() == "fixture-model", "Model must come from server configuration.");
                Check(root.GetProperty("stream").GetBoolean() && !root.GetProperty("store").GetBoolean(), "Wrong streaming/storage policy.");
                Check(root.GetProperty("max_output_tokens").GetInt32() is > 0 and <= 512, "Missing token cap.");
                Check(root.GetProperty("input").GetString() == "Synthetic ticket", "Input changed.");
                Check(root.GetProperty("instructions").GetString()!.Contains("staff review", StringComparison.OrdinalIgnoreCase), "Missing review instruction.");
                return Sse(Delta("Hello ") + Delta("learner.") + Completed());
            });
            var chunks = await Collect(Provider(client), "Synthetic ticket");
            Check(chunks.SequenceEqual(new[] { "Hello ", "learner." }), "Expected two exact text deltas only.");
        }));
        Tests.Add(("SSE accepts comments CRLF multiline data and unknown lifecycle events", async () =>
        {
            using var client = Client((_, _) => Task.FromResult(Sse(
                ": heartbeat\r\nevent: response.created\r\ndata: {\"type\":\"response.created\",\"response\":{\"status\":\"in_progress\"}}\r\n\r\n" +
                "event: response.output_text.delta\r\ndata: {\"type\":\"response.output_text.delta\",\r\ndata: \"delta\":\"Hi\"}\r\n\r\n" + Completed())));
            Check(string.Concat(await Collect(Provider(client), "Synthetic")) == "Hi", "SSE framing lost content.");
        }));
        foreach (var status in new[] { HttpStatusCode.TooManyRequests, HttpStatusCode.InternalServerError })
        {
            Tests.Add(($"HTTP {(int)status} fails without leaking body or falling back", async () =>
            {
                using var client = Client((_, _) => Task.FromResult(new HttpResponseMessage(status) { Content = new StringContent("sensitive upstream body") }));
                try { await Collect(Provider(client), "Synthetic"); throw new InvalidOperationException("Expected HTTP failure."); }
                catch (DraftReplyException error)
                {
                    Check(error.Message.Contains(((int)status).ToString()), "Status should help diagnose failure.");
                    Check(!error.Message.Contains("sensitive"), "Upstream body leaked.");
                }
            }));
        }
        var failures = new (string Name, string Wire)[]
        {
            ("error event", Event(new { type = "error", code = "server_error", message = "private", param = (string?)null, sequence_number = 1 })),
            ("failed response", Event(new { type = "response.failed", response = new { status = "failed", error = new { code = "server_error", message = "private" } }, sequence_number = 1 })),
            ("incomplete response", Event(new { type = "response.incomplete", response = new { status = "incomplete", incomplete_details = new { reason = "max_output_tokens" } }, sequence_number = 1 })),
            ("refusal delta", Event(new { type = "response.refusal.delta", item_id = "msg_fixture", output_index = 0, content_index = 0, delta = "Cannot help", sequence_number = 1 })),
            ("refusal done", Event(new { type = "response.refusal.done", item_id = "msg_fixture", output_index = 0, content_index = 0, refusal = "Cannot help", sequence_number = 1 })),
            ("completed refusal", Completed("refusal")),
            ("inconsistent completed status", Event(new { type = "response.completed", response = new { status = "incomplete", output = Array.Empty<object>() }, sequence_number = 2 })),
            ("truncated stream", Delta("Partial")),
            ("unterminated completed frame", Delta("Hi") + Completed().TrimEnd('\n')),
            ("malformed JSON", "data: {broken}\n\n"),
            ("missing delta", Event(new { type = "response.output_text.delta", sequence_number = 1 })),
            ("empty completed response", Completed()),
            ("oversized output", Delta(new string('a', 6001)) + Completed()),
            ("oversized frame", "data: " + new string('a', 65537) + "\n\n")
        };
        foreach (var (name, wire) in failures)
        {
            Tests.Add(($"parser rejects {name}", async () =>
            {
                using var client = Client((_, _) => Task.FromResult(Sse(wire)));
                await Throws<DraftReplyException>(async () => { await Collect(Provider(client), "Synthetic"); });
            }));
        }
        Tests.Add(("HTTP validates input before sending", async () =>
        {
            var sent = false;
            using var client = Client((_, _) => { sent = true; return Task.FromResult(Sse(Completed())); });
            foreach (var value in new[] { "", " ", new string('a', 2001) })
                await Throws<ArgumentException>(async () => { await Collect(Provider(client), value); });
            Check(!sent, "Invalid input must never leave server.");
        }));
        Tests.Add(("HTTP requires explicit key and model", async () =>
        {
            using var client = Client((_, _) => Task.FromResult(Sse(Completed())));
            await Throws<ArgumentException>(async () => { await Collect(new OpenAiDraftReplyService(client, "", "fixture-model"), "Synthetic"); });
            await Throws<ArgumentException>(async () => { await Collect(new OpenAiDraftReplyService(client, "fake-test-key", " "), "Synthetic"); });
        }));
        Tests.Add(("HTTP cancellation reaches pending send", async () =>
        {
            using var stop = new CancellationTokenSource();
            var entered = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
            using var client = Client(async (_, token) =>
            {
                entered.SetResult();
                await Task.Delay(Timeout.InfiniteTimeSpan, token);
                return Sse(Completed());
            });
            var pending = Collect(Provider(client), "Synthetic", stop.Token);
            await entered.Task.WaitAsync(TimeSpan.FromSeconds(3));
            stop.Cancel();
            await Throws<OperationCanceledException>(async () => { await pending; });
        }));
        Tests.Add(("HTTP yields before EOF and cancellation interrupts body read", async () =>
        {
            using var client = Client((_, _) => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(new PauseAfterPrefixStream(Delta("First")))
                { Headers = { ContentType = new("text/event-stream") } }
            }));
            using var stop = new CancellationTokenSource();
            await using var stream = Provider(client).StreamAsync("Synthetic", stop.Token).GetAsyncEnumerator();
            Check(await stream.MoveNextAsync().AsTask().WaitAsync(TimeSpan.FromSeconds(3)), "First chunk was buffered.");
            Check(stream.Current == "First", "Wrong incremental text.");
            var pending = stream.MoveNextAsync().AsTask();
            stop.Cancel();
            await Throws<OperationCanceledException>(async () => { await pending; });
        }));
        Tests.Add(("linked timeout interrupts a stalled response", async () =>
        {
            using var client = Client(async (_, token) =>
            {
                await Task.Delay(Timeout.InfiniteTimeSpan, token);
                return Sse(Completed());
            });
            await Throws<OperationCanceledException>(async () =>
            {
                await Collect(new OpenAiDraftReplyService(client, "fake-test-key", "fixture-model", TimeSpan.FromMilliseconds(25)), "Synthetic");
            });
        }));
    }

    private static OpenAiDraftReplyService Provider(HttpClient client) => new(client, "fake-test-key", "fixture-model");
    private static HttpClient Client(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> send)
        => new(new FakeHandler(send)) { Timeout = Timeout.InfiniteTimeSpan };
    private static HttpResponseMessage Sse(string text) => new(HttpStatusCode.OK)
    { Content = new StringContent(text, Encoding.UTF8, "text/event-stream") };
    private static string Event(object value) => "data: " + JsonSerializer.Serialize(value) + "\n\n";
    private static string Delta(string text) => Event(new
    { type = "response.output_text.delta", item_id = "msg_fixture", output_index = 0, content_index = 0, delta = text, sequence_number = 1, logprobs = Array.Empty<object>() });
    private static string Completed(string contentType = "output_text") => Event(new
    {
        type = "response.completed", sequence_number = 2,
        response = new
        {
            id = "resp_fixture", @object = "response", created_at = 1740855869, status = "completed",
            error = (object?)null, incomplete_details = (object?)null, model = "fixture-model", store = false,
            output = new[] { new { id = "msg_fixture", type = "message", role = "assistant", status = "completed",
                content = new[] { new { type = contentType, text = "Hi", refusal = contentType == "refusal" ? "Cannot help" : null, annotations = Array.Empty<object>() } } } },
            usage = new { input_tokens = 5, output_tokens = 2, total_tokens = 7 }
        }
    });

    private sealed class FakeHandler(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> send) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            => send(request, cancellationToken);
    }

    // A real readable stream that sends one event, then waits for cancellation.
    private sealed class PauseAfterPrefixStream(string prefix) : Stream
    {
        private readonly MemoryStream initial = new(Encoding.UTF8.GetBytes(prefix));
        public override async ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default)
        {
            if (initial.Position < initial.Length) return await initial.ReadAsync(buffer, cancellationToken);
            await Task.Delay(Timeout.InfiniteTimeSpan, cancellationToken);
            return 0;
        }
        public override bool CanRead => true;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => throw new NotSupportedException();
        public override long Position { get => throw new NotSupportedException(); set => throw new NotSupportedException(); }
        public override int Read(byte[] buffer, int offset, int count) => throw new NotSupportedException();
        public override void Flush() => throw new NotSupportedException();
        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
        public override void SetLength(long value) => throw new NotSupportedException();
        public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();
        protected override void Dispose(bool disposing) { if (disposing) initial.Dispose(); base.Dispose(disposing); }
    }
}
