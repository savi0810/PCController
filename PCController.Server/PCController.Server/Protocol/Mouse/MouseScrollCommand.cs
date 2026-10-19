namespace PCController.Server.Protocol.Mouse
{
    public class MouseScrollCommand : MouseCommand
    {
        public override string Action { get; set; } = ProtocolNames.MouseActions.Scroll;
        public string Direction { get; set; } = ProtocolNames.Directions.Up;
    }
}
