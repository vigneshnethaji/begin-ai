using System.Globalization;

namespace SupportDesk.TicketSummary.Services;

public static class LabPort
{
    public static int Parse(string? value) => value is null ? 5105 :
        int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out var port) && port is >= 1024 and <= 65535
            ? port : throw new ArgumentException("SUMMARY_LAB_PORT must be an integer from 1024 to 65535.");
}
