using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;
using System.Xml.Linq;
namespace SupportDesk.SemanticSearch.Services;
public static class SessionDataProtection
{
    public static void AddTo(IServiceCollection services)
    {
        services.AddDataProtection().UseEphemeralDataProtectionProvider()
            .AddKeyManagementOptions(options => options.XmlRepository = new SessionKeyRepository());
    }
    // The key-manager warmup also needs its own repository to prevent disk fallback.
    private sealed class SessionKeyRepository : IXmlRepository
    {
        private readonly object gate = new();
        private readonly List<XElement> elements = [];
        public IReadOnlyCollection<XElement> GetAllElements()
        { lock (gate) return elements.Select(x => new XElement(x)).ToArray(); }
        public void StoreElement(XElement element, string friendlyName)
        { ArgumentNullException.ThrowIfNull(element); lock (gate) elements.Add(new XElement(element)); }
    }
}
