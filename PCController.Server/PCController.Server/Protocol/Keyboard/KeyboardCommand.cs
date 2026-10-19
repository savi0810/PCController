namespace PCController.Server.Protocol.Keyboard
{
    public abstract class KeyboardCommand
    {
        public string Type { get; set; } = ProtocolNames.Types.Keyboard;

        public abstract string Action { get; set; }

        public List<string> Modifiers { get; set; } = new();
    }
}
