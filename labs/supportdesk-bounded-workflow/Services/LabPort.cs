using System.Globalization;
namespace SupportDesk.BoundedWorkflow.Services;
public static class LabPort
{
    public static string Url(string? value)
    {
        int port = 5115;
        if (value is not null && (value.Length == 0 || !int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out port) || port is < 1024 or > 65535))
            throw new ArgumentException("WORKFLOW_LAB_PORT must contain only decimal digits for a port from 1024 to 65535.");
        return $"http://127.0.0.1:{port}";
    }
}
