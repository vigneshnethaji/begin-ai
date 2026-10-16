using SupportDesk.DraftReplies.Services;

namespace SupportDesk.DraftReplies.Verification;

internal static partial class Verify
{
    private static void AddConfigurationTests()
    {
        // Breaks caught: invalid port accepted, default overwritten, alternate ignored.
        Tests.Add(("port defaults to 5103", () =>
        {
            Check(LabPort.Parse(null) == 5103, "Expected default port.");
            return Task.CompletedTask;
        }));
        foreach (var value in new[] { "1024", "5104", "65535" })
        {
            var port = value;
            Tests.Add(($"port accepts {port}", () =>
            {
                Check(LabPort.Parse(port) == int.Parse(port), "Alternate port ignored.");
                return Task.CompletedTask;
            }));
        }
        foreach (var value in new[] { "", " ", "abc", "1023", "65536", "-1", "5103/path", "http://0.0.0.0:5103" })
        {
            var port = value;
            Tests.Add(($"port rejects '{port}'", async () =>
                await Throws<ArgumentException>(() => { LabPort.Parse(port); return Task.CompletedTask; })));
        }
    }
}
