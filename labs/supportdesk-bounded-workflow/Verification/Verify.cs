using SupportDesk.BoundedWorkflow.Services;
namespace SupportDesk.BoundedWorkflow.Verification;
public static class Verify
{
    public static int Run() => RunAsync().GetAwaiter().GetResult();
    private static async Task<int> RunAsync()
    {
        int passed = 0, failed = 0;
        async Task Check(string name, Func<Task> test)
        {
            try { await test(); Console.WriteLine($"PASS {name}"); passed++; }
            catch (Exception e) { Console.Error.WriteLine($"FAIL {name}: {e.Message}"); failed++; }
        }
        static void Equal<T>(T want, T got) { if (!EqualityComparer<T>.Default.Equals(want, got)) throw new Exception($"expected {want}, got {got}"); }
        static Workflow New(string scenario = "normal", int steps = 5, int calls = 1, int time = 10000, string text = "Fictional billing invoice is missing")
        { var w = new Workflow(); w.SetRequest(new(text, scenario, steps, calls, time)); return w; }
        await Check("normal path pauses before approval and creates one local preview", async () => {
            var w = New(); await w.RunAsync(); Equal(Phase.AwaitingApproval,w.State); Equal(3,w.Steps); Equal(1,w.Calls); Equal(0,w.Effects);
            Equal("Fictional billing help: open Billing > Invoices and select the demo month.",w.Draft);
            w.Complete(); Equal(0,w.Effects); w.Approve(true); Equal(0,w.Effects); w.Complete(); Equal(Phase.Complete,w.State); Equal(1,w.Effects);
            w.Replay(); w.Complete(); Equal(1,w.Effects); Equal(4,w.Steps);
        });
        await Check("denied approval never creates a preview", async () => {var w=New();await w.RunAsync();w.Approve(false);w.Complete();Equal(Phase.Denied,w.State);Equal(0,w.Effects);});
        await Check("changed exact text clears approval and result", async () => {var w=New();await w.RunAsync();w.Approve(true);w.SetRequest(new("Fictional login password reset"));w.Complete();Equal(Phase.Idle,w.State);Equal(false,w.Approved);Equal("",w.Draft);Equal(0,w.Effects);});
        await Check("equal snapshot retains replay record", async () => {var w=New();await w.RunAsync();w.Approve(true);w.Complete();w.SetRequest(new("Fictional billing invoice is missing"));w.Replay();Equal(Phase.Complete,w.State);Equal(1,w.Effects);});
        await Check("missing information halts before lookup", async () => {var w=New(text:"Please help");await w.RunAsync();Equal(Phase.NeedsInformation,w.State);Equal(0,w.Calls);Equal(0,w.Effects);});
        await Check("ambiguous categories ask rather than guess", async () => {var w=New(text:"billing and login");await w.RunAsync();Equal(Phase.NeedsInformation,w.State);Equal(0,w.Calls);});
        await Check("two steps cannot draft or approve", async () => {var w=New(steps:2);await w.RunAsync();Equal(Phase.BudgetExceeded,w.State);Equal(2,w.Steps);w.Approve(true);w.Complete();Equal(0,w.Effects);});
        await Check("preview itself consumes a bounded step", async () => {var w=New(steps:3);await w.RunAsync();w.Approve(true);w.Complete();Equal(Phase.BudgetExceeded,w.State);Equal(3,w.Steps);Equal(0,w.Effects);});
        await Check("loop fixture stops before step four", async () => {var w=New("loop",3);await w.RunAsync();Equal(Phase.BudgetExceeded,w.State);Equal(3,w.Steps);Equal(0,w.Calls);Equal(0,w.Effects);});
        await Check("zero call allowance blocks lookup", async () => {var w=New(calls:0);await w.RunAsync();Equal(Phase.BudgetExceeded,w.State);Equal(0,w.Calls);});
        await Check("cancelled token cannot become success", async () => {var w=New();using var c=new CancellationTokenSource();c.Cancel();await w.RunAsync(c.Token);Equal(Phase.Cancelled,w.State);Equal(0,w.Steps);w.Complete();Equal(0,w.Effects);});
        await Check("in-flight cancellation interrupts a slow fixture", async () => {var w=New("slow");using var c=new CancellationTokenSource(80);await w.RunAsync(c.Token);Equal(Phase.Cancelled,w.State);Equal(0,w.Effects);});
        await Check("time allowance bounds a slow fixture", async () => {var w=New("slow",time:40);await w.RunAsync();Equal(Phase.BudgetExceeded,w.State);Equal(0,w.Effects);});
        await Check("failed-before-preview retry stays inside original budgets", async () => {var w=New("failed");await w.RunAsync();w.Approve(true);w.Complete();Equal(Phase.Failed,w.State);Equal(0,w.Effects);await w.RecoverAsync();Equal(Phase.AwaitingApproval,w.State);Equal(false,w.Approved);w.Approve(true);w.Complete();Equal(Phase.Complete,w.State);Equal(1,w.Effects);Equal(5,w.Steps);});
        await Check("unknown cannot automatically retry or report success", async () => {var w=New("unknown");await w.RunAsync();w.Approve(true);w.Complete();Equal(Phase.Unknown,w.State);Equal(1,w.Effects);await w.RecoverAsync();w.Replay();w.Complete();Equal(Phase.Unknown,w.State);Equal(1,w.Effects);w.Reconcile();Equal(Phase.Complete,w.State);Equal(1,w.Effects);});
        await Check("unknown capability is denied", async () => {var w=New("unknown-capability");await w.RunAsync();Equal(Phase.Denied,w.State);Equal(0,w.Calls);Equal(0,w.Effects);});
        await Check("invalid input is rejected by the service", async () => {var w=New(text:new string('x',2001));await w.RunAsync();Equal(Phase.Denied,w.State);Equal(0,w.Steps);});
        await Check("invalid budgets cannot expand work", async () => {var w=New(steps:500);await w.RunAsync();Equal(Phase.Denied,w.State);Equal(0,w.Steps);});
        await Check("second edit after invalidating an in-flight run has no disposed cancellation source", async () => {
            var w=New("slow");var oldRun=w.RunAsync();
            w.SetRequest(new("Fictional login changed once"));await oldRun;
            w.SetRequest(new("Fictional billing changed twice"));
            Equal(Phase.Idle,w.State);Equal("",w.Draft);Equal(false,w.Approved);Equal(0,w.Effects);
        });
        await Check("old run cleanup cannot detach a replacement run cancellation source", async () => {
            var w=New("slow");var oldRun=w.RunAsync();
            w.SetRequest(new("Fictional login replacement", "slow"));var replacement=w.RunAsync();
            await oldRun;w.SetRequest(new("Fictional billing final"));await replacement;
            Equal(Phase.Idle,w.State);Equal("",w.Draft);Equal(false,w.Approved);Equal(0,w.Effects);
            await w.RunAsync();Equal(Phase.AwaitingApproval,w.State);Equal(1,w.Calls);
        });
        Console.WriteLine($"Workflow verification: {passed} passed, {failed} failed. No listener opened.");
        return failed == 0 ? 0 : 1;
    }
}
