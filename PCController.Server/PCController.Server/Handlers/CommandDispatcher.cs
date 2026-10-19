using System.Text.Json;
using PCController.Server.Protocol;
using PCController.Server.Protocol.Keyboard;
using PCController.Server.Protocol.Mouse;

namespace PCController.Server.Handlers
{
    public class CommandDispatcher
    {
        private readonly MouseHandler _mouseHandler;
        private readonly KeyboardHandler _keyboardHandler;

        public CommandDispatcher(MouseHandler mouseHandler, KeyboardHandler keyboardHandler)
        {
            _mouseHandler = mouseHandler;
            _keyboardHandler = keyboardHandler;
        }

        public void ReleaseButtons() => _mouseHandler.ReleaseButtons();

        public void Dispatch(string message)
        {
            JsonDocument json;

            try
            {
                json = JsonDocument.Parse(message);
            }
            catch (JsonException)
            {
                Console.WriteLine("Некорректный JSON");
                return;
            }

            using (json)
            {
                var root = json.RootElement;

                if (!root.TryGetProperty(ProtocolNames.Fields.Type, out var typeProp))
                {
                    Console.WriteLine("Команда не содержит поле Type");
                    return;
                }

                switch (typeProp.GetString())
                {
                    case ProtocolNames.Types.Mouse:
                        HandleMouseCommand(root);
                        break;
                    case ProtocolNames.Types.Keyboard:
                        HandleKeyboardCommand(root);
                        break;
                    case ProtocolNames.Types.Ping:
                        break;
                    default:
                        Console.WriteLine($"Неизвестный Type команды: {typeProp.GetString()}");
                        break;
                }
            }
        }

        private void HandleMouseCommand(JsonElement root)
        {
            if (!root.TryGetProperty(ProtocolNames.Fields.Action, out var actionProperty))
            {
                Console.WriteLine("Mouse-команда не содержит Action");
                return;
            }

            switch (actionProperty.GetString())
            {
                case ProtocolNames.MouseActions.Move:
                    var move = root.Deserialize<MouseMoveCommand>();
                    if (move != null) _mouseHandler.HandleMouseMovement(move);
                    break;

                case ProtocolNames.MouseActions.Click:
                    var click = root.Deserialize<MouseClickCommand>();
                    if (click != null) _mouseHandler.HandleMouseClick(click);
                    break;

                case ProtocolNames.MouseActions.ButtonDown:
                    var buttonDown = root.Deserialize<MouseButtonDownCommand>();
                    if (buttonDown != null) _mouseHandler.HandleMouseButtonDown(buttonDown);
                    break;

                case ProtocolNames.MouseActions.ButtonUp:
                    var buttonUp = root.Deserialize<MouseButtonUpCommand>();
                    if (buttonUp != null) _mouseHandler.HandleMouseButtonUp(buttonUp);
                    break;

                case ProtocolNames.MouseActions.Scroll:
                    var scroll = root.Deserialize<MouseScrollCommand>();
                    if (scroll != null) _mouseHandler.HandleMouseScroll(scroll);
                    break;

                default:
                    Console.WriteLine($"Неизвестная Mouse-команда: {actionProperty.GetString()}");
                    break;
            }
        }

        private void HandleKeyboardCommand(JsonElement root)
        {
            if (!root.TryGetProperty(ProtocolNames.Fields.Action, out var actionProperty))
            {
                Console.WriteLine("Keyboard-команда не содержит Action");
                return;
            }

            switch (actionProperty.GetString())
            {
                case ProtocolNames.KeyboardActions.Char:
                    var ch = root.Deserialize<KeyboardCharCommand>();
                    if (ch != null) _keyboardHandler.HandleChar(ch);
                    break;

                case ProtocolNames.KeyboardActions.Key:
                    var key = root.Deserialize<KeyboardKeyCommand>();
                    if (key != null) _keyboardHandler.HandleKey(key);
                    break;

                default:
                    Console.WriteLine($"Неизвестная Keyboard-команда: {actionProperty.GetString()}");
                    break;
            }
        }
    }
}