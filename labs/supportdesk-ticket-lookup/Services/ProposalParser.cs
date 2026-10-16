using System.Text.Json;

namespace SupportDesk.TicketLookup.Services;

public sealed record ToolProposal(string Tool, LookupArguments Arguments);
public sealed record LookupArguments(string TicketId);
public sealed record ProposalParseResult(ToolProposal? Proposal, string? Error)
{
    public bool IsValid => Proposal is not null;
}

public static class ProposalParser
{
    public static ProposalParseResult Parse(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw) || raw.Length > 4000)
            return new(null, "Enter a JSON proposal of at most 4000 characters.");
        try
        {
            using var document = JsonDocument.Parse(raw, new JsonDocumentOptions { MaxDepth = 6 });
            var root = document.RootElement;
            if (!ExactKeys(root, "tool", "arguments") ||
                root.GetProperty("tool").ValueKind != JsonValueKind.String ||
                root.GetProperty("tool").GetString() != "lookup_ticket")
                return Invalid();
            var arguments = root.GetProperty("arguments");
            if (!ExactKeys(arguments, "ticketId") || arguments.GetProperty("ticketId").ValueKind != JsonValueKind.String)
                return Invalid();
            var id = arguments.GetProperty("ticketId").GetString()!;
            if (id.Length != 8 || !id.StartsWith("DEMO-", StringComparison.Ordinal) ||
                id.AsSpan(5).ContainsAnyExceptInRange('0', '9')) return Invalid();
            return new(new("lookup_ticket", new(id)), null);
        }
        catch (JsonException) { return Invalid(); }
        // JsonDocument can retain escaped lone surrogates until GetString or
        // property-name decoding, which throws InvalidOperationException.
        catch (InvalidOperationException) { return Invalid(); }
    }

    private static bool ExactKeys(JsonElement element, params string[] expected)
    {
        if (element.ValueKind != JsonValueKind.Object) return false;
        var seen = new HashSet<string>(StringComparer.Ordinal);
        foreach (var property in element.EnumerateObject())
            if (!expected.Contains(property.Name, StringComparer.Ordinal) || !seen.Add(property.Name)) return false;
        return seen.Count == expected.Length;
    }

    private static ProposalParseResult Invalid() => new(null,
        "Use only lookup_ticket with one ticketId matching DEMO-[0-9]{3}. Exact keys, types and no duplicates; depth ≤6.");

    // Only normalized, strictly validated proposals reach this formatter.
    public static string Canonical(ToolProposal proposal) =>
        JsonSerializer.Serialize(new { tool = proposal.Tool, arguments = new { ticketId = proposal.Arguments.TicketId } });
}
