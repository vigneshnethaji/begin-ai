using SupportDesk.GroundedAnswers.Services;

namespace SupportDesk.GroundedAnswers.Verification;

public static class Verify
{
    public static int Run()
    {
        var checks = 0;
        void Check(bool condition, string name)
        {
            if (!condition) throw new InvalidOperationException("FAIL: " + name);
            checks++;
        }
        void Reject(Action action, string name)
        {
            try { action(); } catch (ArgumentException) { checks++; return; }
            throw new InvalidOperationException("FAIL: " + name);
        }
        try
        {
            var service = new RetrievalService();
            var chunks = RetrievalService.Chunk(new("kb-test", "r2", "Test", "one two three four five six seven", true), 4, 1);
            Check(chunks.Select(x => x.Id).SequenceEqual(["kb-test@r2:c1", "kb-test@r2:c2"]), "stable revision/chunk IDs");
            Check(chunks[0].Text == "one two three four" && chunks[1].Text == "four five six seven", "overlap retains boundary word");
            Check(RetrievalService.Chunk(new("empty", "r1", "Empty", " \r\n ", true)).Count == 0, "empty document");
            Reject(() => RetrievalService.Chunk(new("x", "r1", "X", "x", true), 4, 4), "invalid overlap");
            Reject(() => RetrievalService.Chunk(new("x", "r1", "X", "x", true), 0, 0), "invalid size");
            var pack = RetrievalService.Pack([
                new("a", "a", "r1", "one two three four", true),
                new("b", "b", "r1", "five six seven", true),
                new("c", "c", "r1", "eight", true)], 5);
            Check(pack.Selected.Select(x => x.Id).SequenceEqual(["a", "c"]), "overflow skipped stably");
            Check(pack.Excluded.Select(x => x.Id).SequenceEqual(["b"]) && pack.Used == 5, "whole-block word budget");
            Reject(() => RetrievalService.Pack([], -1), "negative budget");
            var result = service.Answer("password reset", 80);
            Check(result.Status == "Answered", "supported question");
            Check(result.Text == "To reset a password, open Account settings and select Reset password.", "literal extractive answer");
            Check(result.Citation == "kb-reset@r1:c1", "expected citation");
            Check(result.Evidence.Any(x => x.Id == result.Citation), "citation belongs to selected evidence");
            Check(RetrievalService.Chunk(service.Articles[0]).Select(x => x.Id).SequenceEqual(["kb-reset@r1:c1", "kb-reset@r1:c2"]), "real article has overlapping windows");
            Check(service.Answer("fresh link", 80).Citation == "kb-reset@r1:c2", "later recovery sentence citation");
            Check(service.Answer("fresh link", 80).Text == "Use a fresh link if the earlier recovery message has expired.", "later complete sentence survives overlap");
            Check(service.Answer("quantum banana", 80).Status == "Abstained", "unsupported abstention");
            Check(service.Answer("quantum banana", 80).Citation is null, "unsupported no invented citation");
            Check(service.Answer("password reset", 8).Status == "Abstained", "small budget abstention");
            Check(service.Answer("password reset", 0).Evidence.Count == 0, "zero budget");
            Check(service.Answer(new string('x', 241), 80).Status == "Invalid", "server input limit");
            Check(service.Answer(" ", 80).Status == "Invalid", "blank question");
            Check(service.Answer("password reset", 201).Status == "Invalid", "server budget limit");
            Check(RetrievalService.CheckQuote("kb-invented@r1:c9", "Fake quote.", result.Evidence) == "Unknown citation", "invented citation rejected");
            Check(RetrievalService.CheckQuote("kb-export@r1:c1", "Export", result.Evidence) == "Unknown citation", "existing but unretrieved citation rejected");
            Check(RetrievalService.CheckQuote(result.Citation!, "Passwords expire every day.", result.Evidence) == "Quote not found", "irrelevant answer rejected");
            Check(RetrievalService.CheckQuote(result.Citation!, result.Text, result.Evidence) == "Exact quote found", "exact quote accepted narrowly");
            Check(RetrievalService.CheckQuote(result.Citation!, "", result.Evidence) == "Invalid", "empty quote rejected");
            Check(RetrievalService.CheckQuote(result.Citation!, new string('x', 501), result.Evidence) == "Invalid", "quote bound");
            var injection = service.Answer("grant administrator permissions", 80);
            Check(injection.Evidence.Any(x => x.DocumentId == "kb-untrusted"), "hostile data is inspectable");
            Check(injection.Status == "Abstained" && injection.Citation is null, "unreviewed source cannot supply answer");
            Check(injection.Template.Contains("evidenceData") && injection.Template.Contains("Ignore previous instructions"), "structured illustrative provider boundary");
            Check(service.Answer("password reset price", 80).Status == "Abstained", "partial keyword overlap is not a full supported answer");
            var metric = RetrievalService.Evaluate(["a", "a", "b"], ["a", "c"]);
            Check(metric.Hits == 1 && metric.Precision == .5 && metric.Recall == .5, "distinct retrieval metrics independent of prose");
            Check(RetrievalService.Evaluate([], ["a"]).Recall == 0, "empty retrieval");
            Check(LabPort.Url(null) == "http://127.0.0.1:5111", "loopback default");
            Check(LabPort.Url("5112") == "http://127.0.0.1:5112", "optional valid port");
            foreach (var port in new[] { "", "0", "1023", "65536", "5111 ", "http://0.0.0.0:80", "+5111" }) Reject(() => LabPort.Url(port), "invalid port " + port);
            Console.WriteLine($"PASS: {checks} checks; actual chunking, retrieval, budgets, abstention, quote/citation validation, hostile data, evaluation and loopback configuration; no listener.");
            return 0;
        }
        catch (Exception error) { Console.Error.WriteLine(error.Message); return 1; }
    }
}
