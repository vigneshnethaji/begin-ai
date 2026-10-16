namespace SupportDesk.DraftReplies.Services;

public static class DraftLimits
{
    public const int InputCharacters = 2000;
    public const int OutputCharacters = 6000;
    public const int OutputTokens = 512;
    public static readonly TimeSpan Timeout = TimeSpan.FromSeconds(30);

    public static void Validate(string ticket)
    {
        if (string.IsNullOrWhiteSpace(ticket) || ticket.Length > InputCharacters)
            throw new ArgumentException($"Enter a synthetic ticket of 1–{InputCharacters} characters.");
    }
}
