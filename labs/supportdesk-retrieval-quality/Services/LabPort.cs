using System.Globalization;
namespace SupportDesk.RetrievalQuality.Services;
public static class LabPort
{
    public static string Url(string? value)
    {
        if (value is null) return "http://127.0.0.1:5113";
        if (value.Length == 0 || value.Any(c => c is < '0' or > '9') || !int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out int port) || port is < 1024 or > 65535)
            throw new ArgumentException("RETRIEVAL_LAB_PORT must contain only ASCII digits for a port from 1024 to 65535.");
        return $"http://127.0.0.1:{port}";
    }
}
