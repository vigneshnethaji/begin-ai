using System.Diagnostics;
namespace SupportDesk.BoundedWorkflow.Services;
public enum Phase { Idle, Classified, HelpFound, AwaitingApproval, NeedsInformation, Denied, BudgetExceeded, Cancelled, Failed, Unknown, Complete }
public sealed record Request(string Text, string Scenario = "normal", int MaxSteps = 5, int MaxCalls = 1, int TimeoutMs = 10000);
public sealed class Workflow
{
    private Request request = new("");
    private Request? approval;
    private readonly List<string> trace = [];
    private readonly Dictionary<Request, Receipt> receipts = [];
    private readonly Stopwatch clock = new();
    private bool running, failedOnce;
    private int generation;
    private CancellationTokenSource? active;
    private sealed record Receipt(Phase State, string Draft, int Steps, int Calls);
    public Phase State { get; private set; }
    public int Steps { get; private set; }
    public int Calls { get; private set; }
    public int Effects { get; private set; }
    public string Draft { get; private set; } = "";
    public string Message { get; private set; } = "";
    public bool Approved { get; private set; }
    public IReadOnlyList<string> Trace => trace.AsReadOnly();
    private void Note(string text) { if (trace.Count == 80) trace.RemoveAt(0); trace.Add(text); Message = text; }
    private void Stop(Phase state, string text) { State = state; approval = null; Approved = false; Note(text); }
    public void SetRequest(Request value)
    {
        ArgumentNullException.ThrowIfNull(value);
        if (value == request) return;
        // Detach before cancellation can resume an old asynchronous run.
        // The run owns disposal; the editable request owns only this reference.
        var previous = active; active = null; generation++; running = false;
        previous?.Cancel();
        request = value; approval = null; Approved = false; failedOnce = false;
        Steps = Calls = 0; Draft = ""; State = Phase.Idle; clock.Reset(); trace.Clear();
        Note("Input changed. Approval and visible result cleared; prior local receipts remain in this session.");
    }
    private bool Valid() => !string.IsNullOrWhiteSpace(request.Text) && request.Text.Length <= 2000
        && request.MaxSteps is >= 1 and <= 12 && request.MaxCalls is >= 0 and <= 3
        && request.TimeoutMs is >= 20 and <= 30000
        && new[] { "normal", "loop", "slow", "failed", "unknown", "unknown-capability" }.Contains(request.Scenario);
    private bool Step(CancellationToken token = default)
    {
        if (token.IsCancellationRequested) { Stop(Phase.Cancelled,"Cancelled. No success recorded."); return false; }
        if (Steps >= request.MaxSteps || clock.ElapsedMilliseconds >= request.TimeoutMs)
        { Stop(Phase.BudgetExceeded,"Step or elapsed-time budget exhausted before the next operation."); return false; }
        Steps++; return true;
    }
    public async Task RunAsync(CancellationToken token = default)
    {
        if (running || State != Phase.Idle) { Note("This checkpoint cannot restart. Use replay or an eligible recovery."); return; }
        if (!Valid()) { Stop(Phase.Denied,"Invalid input: text 1–2000 characters, steps 1–12, calls 0–3, time 20–30000 ms, known fixture required."); return; }
        if (receipts.TryGetValue(request, out var saved)) { Restore(saved); Note("Exact-request receipt restored. No operation repeated."); return; }
        if (receipts.Count >= 16) { Stop(Phase.Denied,"Session receipt limit reached. Start a new session for a new demonstration."); return; }
        running = true; var version = generation;
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(token);
        active = timeout; timeout.CancelAfter(request.TimeoutMs); clock.Restart();
        try
        {
            if (!Step(token)) return;
            if (request.Scenario == "slow") await Task.Delay(2500, timeout.Token);
            if (version != generation) return;
            if (request.Scenario == "loop")
            {
                Note("Authored loop fixture: each turn consumes a step; it performs no lookup.");
                while (Step(timeout.Token)) await Task.Delay(15, timeout.Token);
                return;
            }
            bool billing = request.Text.Contains("billing",StringComparison.OrdinalIgnoreCase) || request.Text.Contains("invoice",StringComparison.OrdinalIgnoreCase);
            bool login = request.Text.Contains("login",StringComparison.OrdinalIgnoreCase) || request.Text.Contains("password",StringComparison.OrdinalIgnoreCase);
            if (billing == login) { Stop(Phase.NeedsInformation,"Is this about billing or login? Clarify one topic before continuing."); return; }
            State = Phase.Classified; Note(billing ? "Classified: billing (fixed keyword rule)." : "Classified: login (fixed keyword rule).");
            if (!Step(timeout.Token)) return;
            if (request.Scenario == "unknown-capability") { Stop(Phase.Denied,"send_email is outside the lookup_help allowlist."); return; }
            if (Calls >= request.MaxCalls) { Stop(Phase.BudgetExceeded,"Lookup call budget exhausted; no lookup performed."); return; }
            Calls++; State = Phase.HelpFound; Note("lookup_help returned an authored local help entry; its text grants no authority.");
            if (!Step(timeout.Token)) return;
            Draft = billing ? "Fictional billing help: open Billing > Invoices and select the demo month." : "Fictional login help: use the demo password reset screen; never share a password.";
            State = Phase.AwaitingApproval; Note("Authored draft ready. Review the exact request snapshot; nothing has been sent.");
        }
        catch (OperationCanceledException) when (version == generation)
        { Stop(token.IsCancellationRequested ? Phase.Cancelled : Phase.BudgetExceeded, token.IsCancellationRequested ? "Cancelled during local work. No success recorded." : "Elapsed-time budget exhausted. No preview created."); }
        catch (OperationCanceledException) { /* An input edit invalidated the old asynchronous run. */ }
        finally
        {
            // Even an invalidated run must release its own reference before
            // using disposes it. Never clear a newer run's cancellation source.
            if (ReferenceEquals(active, timeout)) active = null;
            if (version == generation) running = false;
        }
    }
    public void Approve(bool allowed)
    {
        if (State != Phase.AwaitingApproval) { Note("Approval requires a current reviewed draft."); return; }
        if (!allowed) { Stop(Phase.Denied,"Reviewer denied this draft. No preview created."); return; }
        approval = request; Approved = true; Note("Approval bound to exact text, fixture, and budgets. Preview has not run.");
    }
    public void Complete()
    {
        if (State != Phase.AwaitingApproval || !Approved || approval != request) { Note("No current approval for preview, or this request already has a terminal outcome."); return; }
        if (!Step()) return;
        if (request.Scenario == "failed" && !failedOnce)
        { failedOnce = true; Stop(Phase.Failed,"Known failure before preview. No effect occurred. Explicit retry may use remaining budgets."); return; }
        Effects++;
        State = request.Scenario == "unknown" ? Phase.Unknown : Phase.Complete;
        receipts[request] = new(State,Draft,Steps,Calls);
        approval = null; Approved = false;
        Note(State == Phase.Unknown ? "Unknown: local preview stored but acknowledgement lost (authored fixture). Reconcile; do not retry." : "Complete: one LOCAL preview stored. No message sent.");
    }
    private void Restore(Receipt saved)
    { State = saved.State; Draft = saved.Draft; Steps = saved.Steps; Calls = saved.Calls; approval = null; Approved = false; }
    public void Replay()
    {
        if (receipts.TryGetValue(request,out var saved)) { Restore(saved); Note("Replay: exact-request receipt returned; no additional preview effect."); }
        else Note("No confirmed or Unknown receipt for this exact request. Replay performs no work.");
    }
    public Task RecoverAsync()
    {
        if (State == Phase.Failed && failedOnce)
        { State = Phase.AwaitingApproval; Approved = false; approval = null; Note("Retry eligible: known pre-preview failure. Review again; original budgets and deadline still apply."); }
        else Note("Recovery blocked. Unknown needs evidence reconciliation; other stops require a deliberate new request.");
        return Task.CompletedTask;
    }
    public void Reconcile()
    {
        if (State != Phase.Unknown || !receipts.TryGetValue(request,out var receipt)) { Note("No Unknown local receipt to reconcile."); return; }
        // This fixture has reliable in-process evidence. Real remote uncertainty
        // needs independent authoritative evidence; a user click is not proof.
        State = Phase.Complete; receipts[request] = receipt with { State = Phase.Complete };
        Note("Reconciled from the existing local preview receipt. No new preview created.");
    }
}
