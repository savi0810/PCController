namespace PCController.Server.Protocol;

public static class ProtocolNames
{
    public const int Port = 5000;

    public static class Fields
    {
        public const string Type = "Type";
        public const string Action = "Action";
    }

    public static class Types
    {
        public const string Mouse = "Mouse";
        public const string Keyboard = "Keyboard";
        public const string Ping = "Ping";
    }

    public static class MouseActions
    {
        public const string Move = "Move";
        public const string Click = "Click";
        public const string ButtonDown = "ButtonDown";
        public const string ButtonUp = "ButtonUp";
        public const string Scroll = "Scroll";
    }

    public static class KeyboardActions
    {
        public const string Char = "Char";
        public const string Key = "Key";
    }

    public static class Buttons
    {
        public const string Left = "Left";
        public const string Right = "Right";
    }

    public static class Directions
    {
        public const string Up = "Up";
        public const string Down = "Down";
    }
}
