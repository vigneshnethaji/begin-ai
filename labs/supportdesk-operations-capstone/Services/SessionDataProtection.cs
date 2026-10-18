using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.Repositories;
using System.Xml.Linq;
namespace SupportDesk.Operations.Services;
public static class SessionDataProtection
{
 public static void AddTo(IServiceCollection services)
 {
  // Both the payload provider and hosted-service key preloading remain memory-only.
  services.AddDataProtection().UseEphemeralDataProtectionProvider()
   .AddKeyManagementOptions(options=>options.XmlRepository=new MemoryKeyRepository());
 }
 private sealed class MemoryKeyRepository:IXmlRepository
 {
  private readonly object gate=new();private readonly List<XElement> elements=[];
  public IReadOnlyCollection<XElement> GetAllElements(){lock(gate)return elements.Select(x=>new XElement(x)).ToArray();}
  public void StoreElement(XElement element,string friendlyName){ArgumentNullException.ThrowIfNull(element);lock(gate)elements.Add(new XElement(element));}
 }
}
