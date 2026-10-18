using System.Globalization;
namespace SupportDesk.Operations.Services;
// Immutable authored measurements; a browser selection is never trusted Azure identity.
public sealed record Candidate(string Revision="v2",double Quality=95,int Samples=100,int SafetyFailures=0,int InputTokens=1000,int OutputTokens=500,int LatencyMs=500,decimal Budget=0.003m,string Identity="demo-release",string Provider="healthy");
public sealed record GateResult(string Name,bool Pass,string Detail);
public sealed class ReleaseSession:IDisposable
{
 private readonly ReleaseTelemetry telemetry=new();
 private readonly List<string> audit=[];
 private Candidate? checkedCandidate,approvedCandidate;
 private long checkNumber,approvedCheck,auditNumber;
 private bool inputValid=true;
 public Candidate Candidate {get;private set;}=new();
 public string Active {get;private set;}="V1";
 public string Status {get;private set;}="Idle";
 public int Effects {get;private set;}
 public IReadOnlyList<GateResult> Gates {get;private set;}=[];
 public IReadOnlyList<string> Audit=>audit.AsReadOnly();
 public long CheckNumber=>checkNumber;
 public bool Approved=>approvedCandidate==Candidate&&approvedCheck==checkNumber&&Status=="Approved";
 public bool CanEdit=>Effects==0;
 public bool CanCheck=>CanEdit;
 public bool CanApprove=>Status=="Ready"&&checkedCandidate==Candidate&&inputValid;
 public bool CanPromote=>Approved&&checkedCandidate==Candidate&&Gates.Count>0&&Gates.All(g=>g.Pass)&&Effects==0&&inputValid;
 public bool CanStop=>Effects==0&&Status is "Idle" or "Ready" or "Approved" or "Blocked";
 public bool CanSmoke=>Status=="AwaitingSmoke";
 public static decimal Estimate(Candidate c)
 {
  if(c.InputTokens is <1 or >100000||c.OutputTokens is <1 or >100000)throw new ArgumentOutOfRangeException(nameof(c),"Token counts must be 1–100000.");
  return (c.InputTokens+3m*c.OutputTokens)/1000000m;
 }
 public void Edit(Candidate candidate)
 {
  if(!CanEdit)return;Candidate=candidate;inputValid=true;Invalidate();Status="Idle";Record("edit","idle");
 }
 public void RejectInput()
 {
  if(!CanEdit)return;inputValid=false;Invalidate();Status="Blocked";Record("edit","blocked");
 }
 private void Invalidate(){checkedCandidate=null;approvedCandidate=null;approvedCheck=0;Gates=[];}
 public void Check()
 {
  if(!CanCheck||Status is "Denied" or "Cancelled")return;
  approvedCandidate=null;approvedCheck=0;checkedCandidate=null;checkNumber++;
  var c=Candidate;
  bool revision=c.Revision is {Length:>=2 and <=4}&&c.Revision[0]=='v'&&int.TryParse(c.Revision.AsSpan(1),NumberStyles.None,CultureInfo.InvariantCulture,out int version)&&version is >=2 and <=999&&c.Revision=="v"+version.ToString(CultureInfo.InvariantCulture);
  bool quality=double.IsFinite(c.Quality)&&c.Quality is >=0 and <=100;
  bool samples=c.Samples is >=1 and <=10000;
  bool safety=samples&&c.SafetyFailures>=0&&c.SafetyFailures<=c.Samples;
  bool tokens=c.InputTokens is >=1 and <=100000&&c.OutputTokens is >=1 and <=100000;
  bool budget=c.Budget is >0 and <=1;
  bool latency=c.LatencyMs is >=1 and <=60000;
  Gates=[new("Input",inputValid&&revision,"Valid numeric input and canonical revision v2–v999 required."),
   new("Identity",c.Identity=="demo-release","Server-owned DEMO release policy only; not Azure auth."),
   new("Quality",quality&&c.Quality>=90,"Finite 0–100; at least 90 required."),
   new("Samples",samples&&c.Samples>=20,"1–10000 valid; at least 20 required."),
   new("Safety",safety&&c.SafetyFailures==0,"Valid count no greater than samples; zero failures required."),
   new("Provider",c.Provider=="healthy","Authored healthy fixture required; Failed and Unknown block."),
   new("Budget",tokens&&budget&&Estimate(c)<=c.Budget,"Positive bounded tokens and budget; estimate must fit."),
   new("Latency",latency&&c.LatencyMs<=2000,"Valid 1–60000 ms; no more than 2000 ms synthetic latency.")];
  bool pass=Gates.All(g=>g.Pass);if(pass)checkedCandidate=c;Status=pass?"Ready":"Blocked";Record("gate",pass?"ready":"blocked");
 }
 public void Approve()
 {
  if(!CanApprove)return;approvedCandidate=Candidate;approvedCheck=checkNumber;Status="Approved";Record("approve","approved");
 }
 public void Promote()
 {
  if(!CanPromote)return;Effects++;Active=Candidate.Revision.ToUpperInvariant();Status="AwaitingSmoke";Record("promote","awaiting-smoke");
 }
 public void Smoke(string health)
 {
  if(!CanSmoke)return;
  if(health=="healthy"){Status="Complete";Record("smoke","complete");}
  else if(health=="bad"){Active="V1";Status="RolledBack";Record("smoke","rolled-back");}
  else {Status="Unknown";Record("smoke","unknown");}
 }
 public void Deny(){if(!CanStop)return;approvedCandidate=null;Status="Denied";Record("deny","denied");}
 public void Cancel(){if(!CanStop)return;approvedCandidate=null;Status="Cancelled";Record("cancel","cancelled");}
 public void Replay()
 {
  // Replaying is observational only; it cannot create evidence or another effect.
  var outcome=Status switch{"Complete"=>"complete","RolledBack"=>"rolled-back","Unknown"=>"unknown",_=>"blocked"};Record("replay",outcome);
 }
 private void Record(string operation,string outcome)
 {
  auditNumber=auditNumber>=999999?1:auditNumber+1;
  audit.Add($"A{auditNumber:D6} | {operation} | {outcome}");if(audit.Count>80)audit.RemoveAt(0);telemetry.Record(operation,outcome);
 }
 public void Dispose()=>telemetry.Dispose();
}
