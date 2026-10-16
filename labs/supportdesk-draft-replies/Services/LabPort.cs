namespace SupportDesk.DraftReplies.Services;

public static class LabPort
{
    public static int Parse(string? value)
    {
        if (value is null) return 5103;
        if (!int.TryParse(value, System.Globalization.NumberStyles.None,
                System.Globalization.CultureInfo.InvariantCulture, out var port) || port is < 1024 or > 65535)
            throw new ArgumentException("DRAFT_REPLY_PORT must be an integer from 1024 to 65535.");
        return port;
    }
}
