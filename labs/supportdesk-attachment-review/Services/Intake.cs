namespace SupportDesk.AttachmentReview.Services;

public sealed record IntakeInput(string? FixtureId,string? MediaType,string? Notes);
public sealed record Observation(string SourceId,string Modality,string Field,string Value,decimal Confidence,string Speaker="",int StartSeconds=0,int EndSeconds=0);

public sealed class Intake
{
    private IntakeInput? current,normalized,reviewed;
    public string Phase {get;private set;}="Idle";
    public string Message {get;private set;}="Choose a fixture and normalize the current input.";
    public IReadOnlyList<Observation> Evidence {get;private set;}=Array.Empty<Observation>();
    public bool Reviewed=>reviewed is not null && reviewed==current && normalized==current;
    public bool HasConflict=>Evidence.GroupBy(x=>x.Field).Any(g=>g.Select(x=>x.Value).Distinct(StringComparer.Ordinal).Skip(1).Any());
    public string Result {get;private set;}="";

    // Called for every workspace input edit, even if the eventual values match a prior run.
    public void SetInput(IntakeInput? input)
    {
        current=input;
        Clear();Phase="Idle";Message="Input changed. Normalize and review the exact current input again.";
    }
    private void Clear() {normalized=null;reviewed=null;Evidence=Array.Empty<Observation>();Result="";}
    private static bool Valid(IntakeInput? input)
    {
        if(input?.FixtureId is not {Length:>0 and <=32} fixture || input.MediaType is not {Length:>0 and <=64} media || input.Notes is not {Length:>0 and <=2000} notes || string.IsNullOrWhiteSpace(notes))return false;
        if(notes.Any(c=>char.IsControl(c)&&c is not ('\n' or '\r' or '\t')))return false;
        return (fixture,media) is ("image","image/png") or ("audio","audio/wav") or ("text","text/plain") or ("bundle","application/x-supportdesk-fixture");
    }
    public void Normalize()
    {
        Clear();
        if(!Valid(current)){Phase="Denied";Message="Denied: use an allowed fixture/media pair and 1–2,000 nonblank note characters without unsupported control characters.";return;}
        // Authored observations, never OCR/ASR/vision output produced by this app.
        var image=new Observation("image-1","image","amount","120",0.92m);
        var audio=new Observation("audio-1","audio","amount","170",0.61m,"Speaker 1",12,16);
        var text=new Observation("text-1","text","amount","120",1.00m);
        Observation[] observations=current!.FixtureId switch {"image"=>[image],"audio"=>[audio],"text"=>[text],_=>[image,audio,text]};
        Evidence=Array.AsReadOnly(observations);normalized=current;Phase="AwaitingReview";
        Message=HasConflict?"Authored observations normalized. Unresolved conflict: staff review is required; no value was selected as truth.":"Authored observation normalized. Confidence is not truth; staff review is required.";
    }
    public void Review(bool accept)
    {
        Result="";reviewed=null;
        if(!accept){Phase="Denied";Message="Staff declined this evidence. No preview created.";return;}
        if(Phase!="AwaitingReview"||normalized is null||normalized!=current||!Valid(current)||Evidence.Count==0){Phase="Denied";Message="Normalize the exact current input before staff review.";return;}
        reviewed=current;Message="Staff acknowledged this exact input and evidence. No preview yet; uncertainty and conflicts remain.";
    }
    public void Preview()
    {
        if(Phase!="AwaitingReview"||!Reviewed||!Valid(current)||Evidence.Count==0){reviewed=null;Result="";Phase="Denied";Message="Denied: normalize and review the exact current input before preview.";return;}
        Result="LOCAL preview only — authored fixtures; nothing sent.\n"+string.Join("\n",Evidence.Select(e=>$"{e.SourceId}: {e.Field}={e.Value}; confidence {e.Confidence:0.00}"))+(HasConflict?"\nUnresolved conflict: staff must establish the amount separately.":"\nReview does not prove the observation true.");
        Phase="AcceptedLocalPreview";Message="Reviewed local preview accepted. No external action or persistence occurred.";
    }
}
