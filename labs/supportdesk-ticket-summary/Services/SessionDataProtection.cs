using System.Xml.Linq;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;

namespace SupportDesk.TicketSummary.Services;

public static class SessionDataProtection
{
    public static IServiceCollection AddSessionDataProtection(this IServiceCollection services)
    {
        // The provider alone is not enough: framework startup also preloads a
        // key ring. Explicitly keep that separate repository in memory too.
        services.AddDataProtection().UseEphemeralDataProtectionProvider()
            .AddKeyManagementOptions(options => options.XmlRepository = new SessionKeyRepository());
        return services;
    }
}

public sealed class SessionKeyRepository : IXmlRepository
{
    private readonly object gate = new();
    private readonly List<XElement> elements = [];
    public int Reads { get; private set; }
    public int Writes { get; private set; }
    public IReadOnlyCollection<XElement> GetAllElements()
    {
        lock (gate) { Reads++; return elements.Select(element => new XElement(element)).ToArray(); }
    }
    public void StoreElement(XElement element, string friendlyName)
    {
        lock (gate) { Writes++; elements.Add(new XElement(element)); }
    }
}
