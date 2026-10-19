namespace PCController.Server.Protocol.Keyboard
{
    public class KeyboardKeyCommand : KeyboardCommand
    {
        public override string Action { get; set; } = ProtocolNames.KeyboardActions.Key;
        public string Key { get; set; } = "";
    }
}
