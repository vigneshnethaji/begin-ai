using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;
using System.Xml.Linq;
namespace SupportDesk.BoundedWorkflow.Services;
public static class SessionDataProtection
{
    public static void AddTo(IServiceCollection services)
    {
        // Cover both antiforgery payloads and the key preloading hosted service.
        // Neither provider nor XML repository may fall back to disk.
        services.AddDataProtection().UseEphemeralDataProtectionProvider()
            .AddKeyManagementOptions(options => options.XmlRepository = new SessionKeyRepository());
    }
    private sealed class SessionKeyRepository : IXmlRepository
    {
        private readonly object gate = new();
        private readonly List<XElement> elements = [];
        public IReadOnlyCollection<XElement> GetAllElements()
        { lock (gate) return elements.Select(element => new XElement(element)).ToArray(); }
        public void StoreElement(XElement element, string friendlyName)
        { ArgumentNullException.ThrowIfNull(element); lock (gate) elements.Add(new XElement(element)); }
    }
}
