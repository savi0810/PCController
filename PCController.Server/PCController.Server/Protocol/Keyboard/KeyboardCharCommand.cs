namespace PCController.Server.Protocol.Keyboard
{
    public class KeyboardCharCommand : KeyboardCommand
    {
        public override string Action { get; set; } = ProtocolNames.KeyboardActions.Char;
        public string Char { get; set; } = "";
    }
}
