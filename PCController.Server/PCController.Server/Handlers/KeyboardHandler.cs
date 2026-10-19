using PCController.Server.Input;
using PCController.Server.Protocol.Keyboard;

namespace PCController.Server.Handlers;

public class KeyboardHandler
{
    private readonly IKeyboardInput _keyboard;

    public KeyboardHandler(IKeyboardInput keyboard)
    {
        _keyboard = keyboard;
    }

    public void HandleChar(KeyboardCharCommand command)
    {
        if (string.IsNullOrEmpty(command.Char))
        {
            Console.WriteLine("Char-команда должна содержать хотя бы один символ");
            return;
        }

        _keyboard.TypeChar(command.Char[0], ParseModifiers(command.Modifiers));
    }

    public void HandleKey(KeyboardKeyCommand command)
    {
        if (!_keyboard.PressKey(command.Key, ParseModifiers(command.Modifiers)))
            Console.WriteLine($"Неизвестная клавиша: {command.Key}");
    }

    private static List<Modifier> ParseModifiers(IEnumerable<string> names)
    {
        var result = new List<Modifier>();
        foreach (var name in names)
        {
            if (Enum.TryParse<Modifier>(name, out var modifier) && Enum.IsDefined(modifier))
                result.Add(modifier);
        }
        return result;
    }
}
