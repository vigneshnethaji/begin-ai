using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;
using System.Xml.Linq;
namespace SupportDesk.GroundedAnswers.Services;
public static class SessionDataProtection
{
    public static void AddTo(IServiceCollection services) => services.AddDataProtection()
        .UseEphemeralDataProtectionProvider()
        .AddKeyManagementOptions(options => options.XmlRepository = new SessionKeyRepository());
    // The hosted key-ring preloader needs its own memory repository as well.
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
