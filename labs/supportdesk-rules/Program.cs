// SupportDesk: an explicit routing baseline, not a learned model.
if (args.Contains("--verify", StringComparer.OrdinalIgnoreCase))
{
    (string Name, string Input, string Expected)[] cases =
    [
        ("explicit refund", "I need a refund", "Billing"),
        ("case-insensitive keyword", "REFUND PLEASE", "Billing"),
        ("related wording has no keyword", "Please return my payment", "General"),
        ("unrelated message", "I cannot sign in", "General"),
        ("whitespace is rejected", "   ", "Rejected"),
        ("empty input is rejected", "", "Rejected")
    ];

    int passed = 0;
    foreach (var test in cases)
    {
        string actual = Route(test.Input);
        bool ok = actual == test.Expected;
        Console.WriteLine($"{(ok ? "PASS" : "FAIL")}: {test.Name}");
        if (ok)
            passed++;
        else
            Console.WriteLine($"  Expected {test.Expected}; got {actual}.");
    }

    Console.WriteLine($"{passed}/{cases.Length} checks passed.");
    return passed == cases.Length ? 0 : 1;
}

string[] messages =
[
    "I need a refund",
    "Please return my payment",
    "I cannot sign in",
    "   "
];

foreach (string message in messages)
{
    string display = string.IsNullOrWhiteSpace(message) ? "<empty>" : message;
    Console.WriteLine($"{display} -> {Route(message)}");
}
return 0;

static string Route(string message)
{
    if (string.IsNullOrWhiteSpace(message))
        return "Rejected";

    return message.Contains("refund", StringComparison.OrdinalIgnoreCase)
        ? "Billing"
        : "General";
}
