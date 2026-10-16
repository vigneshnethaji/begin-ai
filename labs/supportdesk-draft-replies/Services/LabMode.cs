namespace SupportDesk.DraftReplies.Services;

// Browser receives only this non-secret display choice, never provider credentials.
public sealed record LabMode(bool IsSample);
