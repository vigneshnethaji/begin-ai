using System.Globalization;

namespace SupportDesk.TicketLookup.Services;

public static class LabPort
{
    public static int Parse(string? value) => value is null ? 5107 :
        int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out var port) && port is >= 1024 and <= 65535
            ? port : throw new ArgumentException("LOOKUP_LAB_PORT must be an integer from 1024 to 65535.");
    public static string Url(string? value) => $"http://127.0.0.1:{Parse(value)}";
}
