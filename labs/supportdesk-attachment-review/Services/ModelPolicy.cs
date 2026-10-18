namespace SupportDesk.AttachmentReview.Services;
public sealed record Choice(string Outcome,string Profile,string Detail);
public static class ModelPolicy
{
    private sealed record Profile(string Id,bool Cloud,string[] Capabilities,int MemoryGiB,int IllustrativeScore);
    private static readonly Profile[] Profiles=[new("local-text",false,["text"],4,80),new("cloud-general",true,["text","vision","speech"],0,70)];
    public static Choice Choose(string? capability,bool noCloud,int memoryGiB)
    {
        if(capability is not ("text" or "vision" or "speech") || memoryGiB is <1 or >128)
            return new("Denied","","Select text, vision or speech and whole-number memory from 1–128 GiB.");
        var eligible=Profiles.Where(p=>p.Capabilities.Contains(capability)&&(!noCloud||!p.Cloud)&&(p.Cloud||p.MemoryGiB<=memoryGiB)).OrderByDescending(p=>p.IllustrativeScore).ToArray();
        if(eligible.Length==0)return new("No eligible profile","","Capability, privacy and memory are hard requirements. A cloud fallback cannot bypass no-cloud policy.");
        var chosen=eligible[0];
        return new("Illustrative candidate",chosen.Id,$"Authored score {chosen.IllustrativeScore}; fictional profile, not a benchmark or verified capability. Eligible: {string.Join(", ",eligible.Select(x=>x.Id))}. No inference or transfer occurred.");
    }
}
