using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;
using System.Xml.Linq;
namespace SupportDesk.RetrievalQuality.Services;
public static class SessionDataProtection
{
    public static void AddTo(IServiceCollection services) => services.AddDataProtection()
        .UseEphemeralDataProtectionProvider()
        .AddKeyManagementOptions(options => options.XmlRepository = new MemoryKeys());
    // Explicit repository also prevents default key-ring preloading from selecting disk storage.
    private sealed class MemoryKeys : IXmlRepository
    {
        private readonly object gate = new();
        private readonly List<XElement> keys = [];
        public IReadOnlyCollection<XElement> GetAllElements() { lock (gate) return keys.Select(x => new XElement(x)).ToArray(); }
        public void StoreElement(XElement element, string friendlyName) { lock (gate) keys.Add(new XElement(element)); }
    }
}
