using SupportDesk.AttachmentReview.Services;
namespace SupportDesk.AttachmentReview.Verification;
public static class Verify
{
    public static int Run()
    {
        int passed=0,failed=0;
        void Check(string name,Action test) { try { test();Console.WriteLine($"PASS {name}");passed++; } catch(Exception e) {Console.Error.WriteLine($"FAIL {name}: {e.Message}");failed++;} }
        static void Equal<T>(T want,T got) {if(!EqualityComparer<T>.Default.Equals(want,got))throw new Exception($"expected {want}, got {got}");}
        static Intake New(string fixture="bundle",string type="application/x-supportdesk-fixture",string notes="Fictional billing review") {var s=new Intake();s.SetInput(new(fixture,type,notes));return s;}
        Check("normalization retains conflicting values and their source identifiers",()=>{
            var s=New();s.Normalize();Equal("AwaitingReview",s.Phase);Equal(3,s.Evidence.Count);Equal(true,s.HasConflict);
            Equal("image-1",s.Evidence[0].SourceId);Equal("120",s.Evidence[0].Value);Equal("audio-1",s.Evidence[1].SourceId);Equal("170",s.Evidence[1].Value);
            Equal("Speaker 1",s.Evidence[1].Speaker);Equal(12,s.Evidence[1].StartSeconds);Equal(16,s.Evidence[1].EndSeconds);Equal(0.61m,s.Evidence[1].Confidence);
        });
        Check("unreviewed request cannot create a preview",()=>{var s=New();s.Normalize();s.Preview();Equal("Denied",s.Phase);Equal("",s.Result);});
        Check("staff review is a separate transition from the local preview",()=>{var s=New();s.Normalize();s.Review(true);Equal("",s.Result);s.Preview();Equal("AcceptedLocalPreview",s.Phase);Equal(true,s.Result.Contains("image-1: amount=120"));Equal(true,s.Result.Contains("audio-1: amount=170"));Equal(true,s.Result.Contains("Unresolved conflict"));});
        Check("denial cannot be accepted",()=>{var s=New();s.Normalize();s.Review(false);s.Preview();Equal("Denied",s.Phase);Equal("",s.Result);});
        Check("editing exact notes clears review evidence and accepted result",()=>{var s=New();s.Normalize();s.Review(true);s.Preview();s.SetInput(new("bundle","application/x-supportdesk-fixture","Changed fictional request"));Equal("Idle",s.Phase);Equal(false,s.Reviewed);Equal(0,s.Evidence.Count);Equal("",s.Result);s.Preview();Equal("Denied",s.Phase);});
        Check("re-normalizing clears an earlier review",()=>{var s=New();s.Normalize();s.Review(true);s.Normalize();Equal(false,s.Reviewed);s.Preview();Equal("",s.Result);});
        Check("fixture and media edits invalidate an earlier approval",()=>{foreach(var input in new[]{new IntakeInput("image","image/png","Fictional billing review"),new IntakeInput("bundle","text/plain","Fictional billing review")}){var s=New();s.Normalize();s.Review(true);s.SetInput(input);s.Preview();Equal(false,s.Reviewed);Equal("",s.Result);}});
        Check("each authored modality validates its allowed media type",()=>{foreach(var (f,t,source) in new[]{("image","image/png","image-1"),("audio","audio/wav","audio-1"),("text","text/plain","text-1")}){var s=New(f,t);s.Normalize();Equal("AwaitingReview",s.Phase);Equal(1,s.Evidence.Count);Equal(source,s.Evidence[0].SourceId);}});
        Check("unknown mismatched empty and oversized inputs are denied",()=>{
            foreach(var input in new[]{new IntakeInput("other","text/plain","ok"),new IntakeInput("image","text/plain","ok"),new IntakeInput("text","text/plain",""),new IntakeInput("text","text/plain",new string('x',2001)),new IntakeInput("text","text/plain","bad\0text"),new IntakeInput(new string('x',33),"text/plain","ok"),new IntakeInput("text",new string('x',65),"ok")}){var s=new Intake();s.SetInput(input);s.Normalize();s.Review(true);s.Preview();Equal("Denied",s.Phase);Equal(0,s.Evidence.Count);Equal("",s.Result);}
        });
        Check("maximum allowed notes remain valid",()=>{var s=New("text","text/plain",new string('x',2000));s.Normalize();Equal("AwaitingReview",s.Phase);});
        Check("review before normalization cannot grant authority",()=>{var s=New();s.Review(true);s.Preview();Equal("Denied",s.Phase);Equal(false,s.Reviewed);});
        Check("model choice respects privacy capability and memory before scoring",()=>{Equal("No eligible profile",ModelPolicy.Choose("vision",true,8).Outcome);Equal("local-text",ModelPolicy.Choose("text",true,8).Profile);Equal("No eligible profile",ModelPolicy.Choose("text",true,2).Outcome);Equal("cloud-general",ModelPolicy.Choose("vision",false,8).Profile);Equal("Denied",ModelPolicy.Choose("unknown",false,8).Outcome);Equal("Denied",ModelPolicy.Choose("text",false,-1).Outcome);});
        Check("port policy binds only loopback and refuses malformed bounds",()=>{Equal("http://127.0.0.1:5117",LabPort.Url(null));Equal("http://127.0.0.1:5118",LabPort.Url("5118"));foreach(var p in new[]{""," 5117","+5117","1023","65536","http://localhost"}){bool denied=false;try{LabPort.Url(p);}catch(ArgumentException){denied=true;}Equal(true,denied);}});
        Console.WriteLine($"Inputs verification: {passed} passed, {failed} failed. No listener opened.");return failed==0?0:1;
    }
}
