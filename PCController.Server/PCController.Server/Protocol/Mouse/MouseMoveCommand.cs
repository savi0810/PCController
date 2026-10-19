namespace PCController.Server.Protocol.Mouse
{
    public class MouseMoveCommand : MouseCommand
    {
        public override string Action { get; set; } = ProtocolNames.MouseActions.Move;
        public float X { get; set; }
        public float Y { get; set; }
    }
}
