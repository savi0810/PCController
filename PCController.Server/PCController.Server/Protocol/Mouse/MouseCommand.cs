namespace PCController.Server.Protocol.Mouse
{
    public abstract class MouseCommand
    {
        public string Type { get; set; } = ProtocolNames.Types.Mouse;

        public abstract string Action { get; set; }

    }
}
