using System.Runtime.CompilerServices;
using System.Text;

namespace SupportDesk.DraftReplies.Services;

// SSE frames end at a blank line; consecutive data: lines form one JSON event.
internal static class SseReader
{
    public static async IAsyncEnumerable<string> ReadAsync(Stream stream,
        [EnumeratorCancellation] CancellationToken token)
    {
        using var reader = new StreamReader(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, leaveOpen: true);
        var character = new char[1];
        var line = new StringBuilder();
        var data = new StringBuilder();
        var total = 0;
        while (await reader.ReadAsync(character.AsMemory(), token) != 0)
        {
            // Bound before appending; ReadLineAsync alone could allocate an unbounded line.
            if (++total > 1_048_576 || line.Length + data.Length >= 65_536)
                throw new DraftReplyException("The provider stream exceeded the local parsing limit.");
            if (character[0] != '\n') { line.Append(character[0]); continue; }
            var text = line.ToString().TrimEnd('\r');
            line.Clear();
            if (text.Length == 0)
            {
                if (data.Length == 0) continue;
                yield return data.ToString();
                data.Clear();
            }
            else if (text.StartsWith("data:", StringComparison.Ordinal))
            {
                var value = text[5..];
                if (value.StartsWith(' ')) value = value[1..];
                if (data.Length > 0) data.Append('\n');
                data.Append(value);
            }
        }
        if (line.Length != 0 || data.Length != 0)
            throw new DraftReplyException("The stream ended inside an SSE event. The partial draft is incomplete.");
    }
}
