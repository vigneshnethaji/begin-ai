namespace SupportDesk.TicketLookup.Services;

public sealed record CallerScope(string Identity, string Team, bool CanLookup);
public enum LookupScenario { Normal, Transient, Unknown }
public enum LookupOutcome { Allowed, Invalid, Denied, Unavailable, ApprovalRequired, Conflict, Success, Unknown, CapacityReached }
public sealed record TicketView(string TicketId, string Subject, string Status, string Summary);
public sealed record ReviewResult(LookupOutcome Outcome, string Message, string? Canonical = null)
{
    public bool CanApprove => Outcome == LookupOutcome.Allowed;
}
public sealed record LookupResult(LookupOutcome Outcome, string Message, TicketView? Ticket = null, int Attempts = 0, bool Replay = false);
public sealed record AuditEntry(Guid RequestId, string Tool, string TicketId, string Caller, LookupOutcome Outcome, int Attempts, bool Replay, bool Unknown);

public sealed class LookupExecutor
{
    private sealed record Snapshot(Guid RequestId, string Canonical, string Identity, LookupScenario Scenario);
    private sealed record Saved(Snapshot Snapshot, LookupResult Result);
    private readonly object gate = new();
    private readonly Dictionary<Guid, Saved> records = [];
    private readonly Queue<AuditEntry> audit = [];
    private Snapshot? reviewed;
    private Snapshot? approved;
    private int invocationCount;
    private const int Limit = 128;

    public int InvocationCount { get { lock (gate) return invocationCount; } }
    public int RecordCount { get { lock (gate) return records.Count; } }
    public IReadOnlyList<AuditEntry> Audit { get { lock (gate) return audit.ToArray(); } }

    // Called on every editor, demo identity or failure mode change, including
    // changes back to an earlier value. Old approval cannot become live again.
    public void InvalidateReview()
    {
        lock (gate) { reviewed = null; approved = null; }
    }

    public ReviewResult Validate(Guid requestId, string raw, string identity, LookupScenario scenario)
    {
        lock (gate)
        {
            reviewed = approved = null;
            var (proposal, scope, error) = CheckRequest(requestId, raw, identity, scenario);
            if (error is not null) return new(error.Outcome, error.Message);
            var snapshot = MakeSnapshot(requestId, proposal!, scope!, scenario);
            reviewed = snapshot;
            return new(LookupOutcome.Allowed, "Valid proposal. Demo permission and team checks passed. Explicit staff approval required.", snapshot.Canonical);
        }
    }

    public bool Approve(Guid requestId, string raw, string identity, LookupScenario scenario)
    {
        lock (gate)
        {
            approved = null;
            var (proposal, scope, error) = CheckRequest(requestId, raw, identity, scenario);
            if (error is not null) { reviewed = null; return false; }
            var snapshot = MakeSnapshot(requestId, proposal!, scope!, scenario);
            if (reviewed != snapshot) { reviewed = null; return false; }
            approved = snapshot;
            return true;
        }
    }

    public LookupResult Invoke(Guid requestId, string raw, string identity, LookupScenario scenario)
    {
        // Includes authorization, approval, duplicate detection, local read and
        // cache publication in one critical section; concurrent calls cannot
        // both pass duplicate detection. No I/O or await inside this section.
        lock (gate)
        {
            var (proposal, scope, error) = CheckRequest(requestId, raw, identity, scenario);
            LookupResult result;
            if (error is not null) { reviewed = approved = null; result = error; }
            else
            {
                var snapshot = MakeSnapshot(requestId, proposal!, scope!, scenario);
                if (records.TryGetValue(requestId, out var saved) && saved.Snapshot != snapshot)
                {
                    reviewed = approved = null;
                    result = new(LookupOutcome.Conflict, "Request ID already belongs to a different proposal, demo identity or scenario. Start a fresh request.");
                }
                else if (approved != snapshot)
                {
                    reviewed = approved = null;
                    result = new(LookupOutcome.ApprovalRequired, "Validate and explicitly approve this exact request before invoking or replaying it.");
                }
                else if (saved is not null) result = saved.Result with { Replay = true };
                else if (records.Count >= Limit)
                    result = new(LookupOutcome.CapacityReached, "This session has reached 128 requests. Existing requests can still replay; open a new session for new work.");
                else
                {
                    result = RunLocalFunction(proposal!, scenario);
                    records.Add(requestId, new(snapshot, result));
                }
            }
            // Audit only known, validated identifiers. Never raw proposal or
            // arbitrary identity strings, secrets, customer text or ticket body.
            var parsed = ProposalParser.Parse(raw).Proposal;
            audit.Enqueue(new(requestId, parsed?.Tool ?? "-", parsed?.Arguments.TicketId ?? "-",
                Resolve(identity)?.Identity ?? "unrecognized", result.Outcome, result.Attempts, result.Replay, result.Outcome == LookupOutcome.Unknown));
            while (audit.Count > Limit) audit.Dequeue();
            return result;
        }
    }

    private static Snapshot MakeSnapshot(Guid id, ToolProposal proposal, CallerScope scope, LookupScenario scenario) =>
        new(id, ProposalParser.Canonical(proposal), scope.Identity, scenario);

    private static (ToolProposal? Proposal, CallerScope? Scope, LookupResult? Error) CheckRequest(Guid id, string raw, string identity, LookupScenario scenario)
    {
        var parsed = ProposalParser.Parse(raw);
        if (!parsed.IsValid) return (null, null, new(LookupOutcome.Invalid, parsed.Error!));
        if (id == Guid.Empty || !Enum.IsDefined(scenario))
            return (parsed.Proposal, null, new(LookupOutcome.Invalid, "A nonempty request ID and a known demo scenario are required."));
        var scope = Resolve(identity);
        if (scope is null || !scope.CanLookup)
            return (parsed.Proposal, scope, new(LookupOutcome.Denied, "Denied: this demo identity has no lookup permission."));
        // Routing metadata is checked before the local function. A missing ID
        // and an ID belonging to another team have identical public behavior.
        if (TicketTeam(parsed.Proposal!.Arguments.TicketId) != scope.Team)
            return (parsed.Proposal, scope, new(LookupOutcome.Unavailable, "Ticket unavailable in this demo scope."));
        return (parsed.Proposal, scope, null);
    }

    // The selector resolves only these server-owned simulation identities.
    // No CallerScope, permission, tenant or approval is deserialized from JSON.
    private static CallerScope? Resolve(string identity) => identity switch
    {
        "billing" => new("billing", "teamA", true),
        "technical" => new("technical", "teamB", true),
        "no-access" => new("no-access", "teamA", false),
        _ => null
    };

    private static string? TicketTeam(string id) => id switch { "DEMO-104" => "teamA", "DEMO-205" => "teamB", _ => null };

    private LookupResult RunLocalFunction(ToolProposal proposal, LookupScenario scenario)
    {
        for (var attempt = 1; attempt <= 2; attempt++)
        {
            // Only this explicit simulation is safe to retry: nothing was read
            // on the first attempt. Unknown outcomes never enter a retry path.
            if (scenario == LookupScenario.Transient && attempt == 1) continue;
            var ticket = LookupTicket(proposal.Arguments);
            if (scenario == LookupScenario.Unknown)
                return new(LookupOutcome.Unknown, "Unknown: simulated response lost after the read. No automatic retry. Replay preserves Unknown without another lookup.", Attempts: attempt);
            return new(LookupOutcome.Success, "Read-only local lookup completed.", ticket, attempt);
        }
        throw new InvalidOperationException("Bounded retry exhausted unexpectedly.");
    }

    private TicketView LookupTicket(LookupArguments arguments)
    {
        invocationCount++;
        return arguments.TicketId switch
        {
            "DEMO-104" => new("DEMO-104", "Duplicate charge", "Open", "Fictional duplicate charge reported; staff review pending."),
            "DEMO-205" => new("DEMO-205", "Export issue", "Open", "Fictional export issue reported; investigation pending."),
            _ => throw new InvalidOperationException("Only authorized fixture IDs reach the local lookup.")
        };
    }
}
