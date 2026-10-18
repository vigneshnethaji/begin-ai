using System.Globalization;
namespace SupportDesk.GroundedAnswers.Services;
public static class LabPort
{
    public static string Url(string? value)
    {
        if (value is null) return "http://127.0.0.1:5111";
        if (!int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out var port) || port is < 1024 or > 65535)
            throw new ArgumentException("RAG_LAB_PORT must be an integer from 1024 to 65535.");
        return $"http://127.0.0.1:{port}";
    }
}
