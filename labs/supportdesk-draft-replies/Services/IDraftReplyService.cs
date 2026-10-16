namespace SupportDesk.DraftReplies.Services;

public interface IDraftReplyService
{
    IAsyncEnumerable<string> StreamAsync(string ticket, CancellationToken cancellationToken = default);
}
