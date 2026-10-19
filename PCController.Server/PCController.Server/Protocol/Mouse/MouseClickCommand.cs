namespace PCController.Server.Protocol.Mouse
{
    public class MouseClickCommand : MouseCommand
    {
        public override string Action { get; set; } = ProtocolNames.MouseActions.Click;
        public string Button { get; set; } = ProtocolNames.Buttons.Left;
    }
}
