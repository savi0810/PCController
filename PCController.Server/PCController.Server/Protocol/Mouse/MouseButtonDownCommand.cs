namespace PCController.Server.Protocol.Mouse
{
    public class MouseButtonDownCommand : MouseCommand
    {
        public override string Action { get; set; } = ProtocolNames.MouseActions.ButtonDown;
        public string Button { get; set; } = ProtocolNames.Buttons.Left;
    }
}
