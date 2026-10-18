using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;
using System.Xml.Linq;
namespace SupportDesk.AttachmentReview.Services;
public static class SessionDataProtection
{
    public static void AddTo(IServiceCollection services)
    {
        // Both payload protection and key-preloading storage are memory-only.
        services.AddDataProtection().UseEphemeralDataProtectionProvider()
            .AddKeyManagementOptions(options=>options.XmlRepository=new MemoryKeys());
    }
    private sealed class MemoryKeys:IXmlRepository
    {
        private readonly object gate=new();
        private readonly List<XElement> elements=[];
        public IReadOnlyCollection<XElement> GetAllElements(){lock(gate)return elements.Select(x=>new XElement(x)).ToArray();}
        public void StoreElement(XElement element,string friendlyName){ArgumentNullException.ThrowIfNull(element);lock(gate)elements.Add(new XElement(element));}
    }
}
