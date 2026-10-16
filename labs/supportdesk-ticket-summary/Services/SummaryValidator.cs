using System.Text.Json;
using System.Text.Json.Serialization;

namespace SupportDesk.TicketSummary.Services;

public sealed record SummaryDto(
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("category")] string Category,
    [property: JsonPropertyName("facts")] string[] Facts,
    [property: JsonPropertyName("missingInformation")] string[] MissingInformation);
public enum SampleStatus { Completed, Refused, Incomplete, Failed }
public sealed record SampleResponse(SampleStatus Status, string Content);
public abstract record ValidationResult;
public sealed record ValidSummary(SummaryDto Summary) : ValidationResult;
public sealed record InvalidSummary(string[] Errors) : ValidationResult;

public sealed class SummaryValidator
{
    public ValidationResult Validate(SampleResponse response)
    {
        if (response.Status != SampleStatus.Completed)
            return new InvalidSummary([$"Response status is {response.Status.ToString().ToLowerInvariant()}. Only completed responses can be validated; no DTO was parsed."]);
        if (response.Content is null || response.Content.Length > 16000)
            return new InvalidSummary(["JSON must be present and no longer than 16000 characters."]);
        try
        {
            using var document = JsonDocument.Parse(response.Content, new JsonDocumentOptions { MaxDepth = 8 });
            if (document.RootElement.ValueKind != JsonValueKind.Object)
                return new InvalidSummary(["The root must be a JSON object."]);
            var errors = new List<string>();
            var properties = new Dictionary<string, JsonElement>(StringComparer.Ordinal);
            string[] expected = ["title", "category", "facts", "missingInformation"];
            foreach (var property in document.RootElement.EnumerateObject())
            {
                if (!properties.TryAdd(property.Name, property.Value)) errors.Add($"Duplicate property: {property.Name}.");
                if (!expected.Contains(property.Name, StringComparer.Ordinal)) errors.Add($"Unexpected property: {property.Name}.");
            }
            foreach (var name in expected) if (!properties.ContainsKey(name)) errors.Add($"Missing property: {name}.");
            string ReadString(JsonElement value, string name, int max)
            {
                if (value.ValueKind != JsonValueKind.String) { errors.Add($"{name} must be a non-null string."); return ""; }
                var text = value.GetString()!;
                if (string.IsNullOrWhiteSpace(text) || text.Length > max) errors.Add($"{name} must be nonblank and at most {max} characters.");
                return text;
            }
            string[] ReadArray(string name, int min, int max, int itemMax)
            {
                if (!properties.TryGetValue(name, out var value)) return [];
                if (value.ValueKind != JsonValueKind.Array) { errors.Add($"{name} must be a non-null array."); return []; }
                if (value.GetArrayLength() < min || value.GetArrayLength() > max) errors.Add($"{name} must contain {min} to {max} items.");
                return value.EnumerateArray().Select((item, index) => ReadString(item, $"{name}[{index}]", itemMax)).ToArray();
            }
            var title = properties.TryGetValue("title", out var t) ? ReadString(t, "title", 80) : "";
            var category = properties.TryGetValue("category", out var c) ? ReadString(c, "category", 20) : "";
            if (!new[] { "Billing", "Account", "Technical", "General" }.Contains(category, StringComparer.Ordinal)) errors.Add("category must be Billing, Account, Technical or General (case-sensitive).");
            var facts = ReadArray("facts", 1, 4, 160);
            var missing = ReadArray("missingInformation", 0, 3, 120);
            return errors.Count > 0 ? new InvalidSummary(errors.ToArray()) : new ValidSummary(new(title, category, facts, missing));
        }
        catch (JsonException) { return new InvalidSummary(["Malformed JSON or nesting deeper than 8. Use a single JSON object without comments or trailing commas."]); }
    }
}
