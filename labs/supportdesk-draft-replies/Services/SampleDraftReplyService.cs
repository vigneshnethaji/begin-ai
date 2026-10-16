using System.Runtime.CompilerServices;

namespace SupportDesk.DraftReplies.Services;

public sealed class SampleDraftReplyService : IDraftReplyService
{
    public async IAsyncEnumerable<string> StreamAsync(string ticket,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        DraftLimits.Validate(ticket);
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeout.CancelAfter(DraftLimits.Timeout);
        // Fixed, deliberately simulated text: no model and no network are involved.
        string[] chunks = ["Hello,\n\n", "Thank you for contacting our support team. ",
            "I understand you need help with this issue. ",
            "Could you share the steps you tried and any error message, without personal details? ",
            "We can then review the next steps together.\n\n", "Kind regards,\nSupport team"];
        foreach (var chunk in chunks)
        {
            await Task.Delay(TimeSpan.FromMilliseconds(70), timeout.Token);
            yield return chunk;
        }
    }
}
