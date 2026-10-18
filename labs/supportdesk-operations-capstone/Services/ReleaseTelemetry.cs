using System.Diagnostics;
using System.Diagnostics.Metrics;
namespace SupportDesk.Operations.Services;
public sealed class ReleaseTelemetry:IDisposable
{
 private readonly ActivitySource source=new("SupportDesk.Operations");
 private readonly Meter meter=new("SupportDesk.Operations");
 private readonly Counter<long> outcomes;
 public ReleaseTelemetry(){outcomes=meter.CreateCounter<long>("release.transitions");}
 public void Record(string operation,string outcome)
 {
  if(operation is not ("edit" or "gate" or "approve" or "promote" or "smoke" or "deny" or "cancel" or "replay")||outcome is not ("idle" or "blocked" or "ready" or "approved" or "awaiting-smoke" or "complete" or "rolled-back" or "unknown" or "denied" or "cancelled"))return;
  using var activity=source.StartActivity("release."+operation);
  activity?.SetTag("release.operation",operation);activity?.SetTag("release.outcome",outcome);
  outcomes.Add(1,new KeyValuePair<string,object?>("operation",operation),new KeyValuePair<string,object?>("outcome",outcome));
 }
 public void Dispose(){source.Dispose();meter.Dispose();}
}
