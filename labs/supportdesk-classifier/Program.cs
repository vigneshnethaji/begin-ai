using SupportDesk.Classifier;

try
{
    var command = Command.Parse(args);
    var classifier = new SupportClassifier();
    switch (command.Name)
    {
        case "train":
            classifier.Train();
            break;
        case "evaluate":
            classifier.Evaluate(classifier.Load(), LabData.Load("test.tsv")).Print();
            break;
        case "predict":
            var prediction = classifier.Predict(classifier.Load(), command.Text!);
            Console.WriteLine($"Category: {prediction.Category}");
            Console.WriteLine("This educational classifier always chooses one of three labels; review the result.");
            break;
        case "--verify":
            Verification.Run(classifier);
            break;
    }
    return 0;
}
catch (Exception error)
{
    Console.Error.WriteLine($"Error: {error.Message}");
    return 1;
}

namespace SupportDesk.Classifier
{
    internal sealed record Command(string Name, string? Text = null)
    {
        public static Command Parse(string[] arguments)
        {
            const string usage = "Use: dotnet run -- train | evaluate | predict \"message\" | --verify";
            if (arguments.Length == 1 && arguments[0] is "train" or "evaluate" or "--verify")
                return new Command(arguments[0]);
            if (arguments.Length == 2 && arguments[0] == "predict")
            {
                if (string.IsNullOrWhiteSpace(arguments[1]))
                    throw new ArgumentException("Please provide a nonempty message: dotnet run -- predict \"message\".");
                return new Command("predict", arguments[1]);
            }
            throw new ArgumentException($"Invalid command or arguments. {usage}");
        }
    }
}
