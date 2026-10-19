namespace PCController.Server.Protocol.Mouse
{
    public class MouseButtonUpCommand : MouseCommand
    {
        public override string Action { get; set; } = ProtocolNames.MouseActions.ButtonUp;
        public string Button { get; set; } = ProtocolNames.Buttons.Left;
    }
}
