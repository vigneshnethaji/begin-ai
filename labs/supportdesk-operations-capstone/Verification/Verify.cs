using SupportDesk.Operations.Services;
namespace SupportDesk.Operations.Verification;
public static class Verify
{
 public static int Run()
 {
  int checks=0;
  void Check(bool condition,string name){if(!condition)throw new InvalidOperationException(name);checks++;}
  try {
   Check(LabPort.Url(null)=="http://127.0.0.1:5119","default loopback");
   foreach(var value in new[]{"","0","1023","65536","-1"," 5120","NaN","http://x"}){bool denied=false;try{LabPort.Url(value);}catch(ArgumentException){denied=true;}Check(denied,"invalid port "+value);}
   Check(LabPort.Url("5120")=="http://127.0.0.1:5120","alternate port");
   var r=new ReleaseSession();Check(r.Active=="V1"&&r.Status=="Idle","known baseline");
   r.Promote();Check(r.Effects==0&&r.Active=="V1","no approval bypass");
   r.Check();Check(r.Status=="Ready"&&r.Gates.All(x=>x.Pass),"valid gates");
   r.Approve();Check(r.Status=="Approved"&&r.Effects==0,"approval has no effect");
   r.Edit(r.Candidate with {Revision="v3"});r.Promote();Check(r.Status=="Idle"&&r.Effects==0&&!r.Approved,"edit invalidates");
   r.Check();r.Approve();r.Promote();Check(r.Status=="AwaitingSmoke"&&r.Active=="V3"&&r.Effects==1,"local promote");
   r.Promote();Check(r.Effects==1,"duplicate promote blocked");r.Smoke("healthy");r.Replay();Check(r.Status=="Complete"&&r.Effects==1,"healthy replay");
   r=new();r.Check();r.Approve();r.Promote();r.Smoke("bad");Check(r.Status=="RolledBack"&&r.Active=="V1"&&r.Effects==1,"bad smoke restores V1");
   r.Replay();Check(r.Status=="RolledBack"&&r.Active=="V1"&&r.Effects==1,"rollback replay");
   r=new();r.Check();r.Approve();r.Promote();r.Smoke("unknown");r.Replay();r.Promote();r.Check();r.Approve();Check(r.Status=="Unknown"&&r.Effects==1,"unknown never success or repeat");
   r.Edit(r.Candidate with {Revision="v4"});Check(r.Status=="Unknown"&&r.Effects==1,"unknown cannot edit away");
   foreach(var fixture in new[]{"denied","cancelled"}){r=new();r.Check();r.Approve();if(fixture=="denied")r.Deny();else r.Cancel();r.Promote();Check(r.Effects==0&&r.Active=="V1","terminal "+fixture);}
   foreach(var c in new[]{new Candidate(Quality:double.NaN),new Candidate(Quality:double.PositiveInfinity),new Candidate(Quality:-1),new Candidate(Quality:101),new Candidate(Samples:0),new Candidate(SafetyFailures:-1),new Candidate(SafetyFailures:1),new Candidate(InputTokens:0),new Candidate(OutputTokens:-1),new Candidate(InputTokens:100001),new Candidate(Budget:0),new Candidate(LatencyMs:0),new Candidate(LatencyMs:2501),new Candidate(Identity:"admin"),new Candidate(Provider:"unknown"),new Candidate(Provider:"failed"),new Candidate(Revision:"unknown"),new Candidate(Revision:new string('x',100))}){r=new();r.Edit(c);r.Check();r.Approve();r.Promote();Check(r.Status=="Blocked"&&r.Active=="V1"&&r.Effects==0,"fail closed "+c);}
   r=new();r.Check();r.Approve();r.RejectInput();r.Check();r.Approve();r.Promote();Check(r.Status=="Blocked"&&!r.Approved&&r.Effects==0,"invalid UI input cannot reuse approval");
   Check(ReleaseSession.Estimate(new Candidate())==0.0025m,"hand calculated decimal cost");
   r=new();r.Edit(new Candidate(Budget:0.0024m));r.Check();Check(r.Status=="Blocked","cost gate");
   r=new();r.Check();r.Approve();r.Edit(new Candidate(Quality:96));Check(!r.Approved&&r.Gates.Count==0,"measurement invalidates gate snapshot");
   r.Check();r.Approve();r.Promote();r.Smoke("nonsense");Check(r.Status=="Unknown","unknown smoke fails closed");
   for(int i=0;i<150;i++)r.Replay();Check(r.Audit.Count==80&&r.Audit.All(x=>x.Length<100),"bounded safe audit");
   Console.WriteLine($"PASS operations verification: {checks} checks; no host created.");return 0;
  }catch(Exception e){Console.Error.WriteLine("FAIL operations verification: "+e.Message);return 1;}
 }
}
