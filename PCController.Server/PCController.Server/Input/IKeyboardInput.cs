using PCController.Server.Protocol.Keyboard;

namespace PCController.Server.Input;

public interface IKeyboardInput
{
    void TypeChar(char c, IReadOnlyCollection<Modifier> modifiers);

    bool PressKey(string keyName, IReadOnlyCollection<Modifier> modifiers);
}
