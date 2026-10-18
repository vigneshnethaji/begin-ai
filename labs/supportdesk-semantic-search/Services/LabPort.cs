namespace SupportDesk.SemanticSearch.Services;
public static class LabPort
{
    public static string Url(string? value)
    {
        if (value is null) return "http://127.0.0.1:5109";
        if (value.Length is < 1 or > 5 || value.Any(c => c is < '0' or > '9') ||
            !int.TryParse(value, out var port) || port is < 1024 or > 65535)
            throw new ArgumentException("SEARCH_LAB_PORT must contain only digits for a port from 1024 to 65535.");
        return $"http://127.0.0.1:{port}";
    }
}
