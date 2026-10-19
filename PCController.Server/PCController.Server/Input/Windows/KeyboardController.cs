using System.Runtime.InteropServices;
using PCController.Server.Protocol.Keyboard;
using WindowsInput;
using WindowsInput.Native;

namespace PCController.Server.Input.Windows;

public class KeyboardController : IKeyboardInput
{
    private readonly InputSimulator _sim;

    public KeyboardController(InputSimulator sim)
    {
        _sim = sim;
    }

    private static readonly Dictionary<Modifier, VirtualKeyCode> ModifierCodes = new()
    {
        [Modifier.Ctrl] = VirtualKeyCode.CONTROL,
        [Modifier.Alt] = VirtualKeyCode.MENU,
        [Modifier.Win] = VirtualKeyCode.LWIN,
        [Modifier.Shift] = VirtualKeyCode.SHIFT,
    };

    private static readonly Dictionary<string, VirtualKeyCode> SpecialKeys = new()
    {
        ["Escape"] = VirtualKeyCode.ESCAPE,
        ["Enter"] = VirtualKeyCode.RETURN,
        ["Tab"] = VirtualKeyCode.TAB,
        ["Backspace"] = VirtualKeyCode.BACK,
        ["ArrowUp"] = VirtualKeyCode.UP,
        ["ArrowDown"] = VirtualKeyCode.DOWN,
        ["ArrowLeft"] = VirtualKeyCode.LEFT,
        ["ArrowRight"] = VirtualKeyCode.RIGHT,
        ["Delete"] = VirtualKeyCode.DELETE,
        ["Insert"] = VirtualKeyCode.INSERT,
        ["Home"] = VirtualKeyCode.HOME,
        ["End"] = VirtualKeyCode.END,
        ["PageUp"] = VirtualKeyCode.PRIOR,
        ["PageDown"] = VirtualKeyCode.NEXT,
        ["F1"] = VirtualKeyCode.F1,
        ["F2"] = VirtualKeyCode.F2,
        ["F3"] = VirtualKeyCode.F3,
        ["F4"] = VirtualKeyCode.F4,
        ["F5"] = VirtualKeyCode.F5,
        ["F6"] = VirtualKeyCode.F6,
        ["F7"] = VirtualKeyCode.F7,
        ["F8"] = VirtualKeyCode.F8,
        ["F9"] = VirtualKeyCode.F9,
        ["F10"] = VirtualKeyCode.F10,
        ["F11"] = VirtualKeyCode.F11,
        ["F12"] = VirtualKeyCode.F12,
    };

    public void TypeChar(char c, IReadOnlyCollection<Modifier> modifiers)
    {
        var resolved = modifiers.Count > 0
            ? ResolveChar(c, EnLayout.Value)
            : ResolveChar(c);

        if (resolved is null)
        {
            InputDesktop.Run(() => _sim.Keyboard.TextEntry(c));
            return;
        }

        var (vk, vkMods) = resolved.Value;
        var all = ResolveModifiers(modifiers).Concat(VkModifiers(vkMods)).Distinct();
        InputDesktop.Run(() => _sim.Keyboard.ModifiedKeyStroke(all, vk));
    }

    public bool PressKey(string keyName, IReadOnlyCollection<Modifier> modifiers)
    {
        if (!SpecialKeys.TryGetValue(keyName, out var vk)) return false;

        InputDesktop.Run(() => _sim.Keyboard.ModifiedKeyStroke(ResolveModifiers(modifiers), vk));
        return true;
    }

    private static IEnumerable<VirtualKeyCode> ResolveModifiers(IEnumerable<Modifier> modifiers) =>
        modifiers.Select(m => ModifierCodes[m]);

    private static IEnumerable<VirtualKeyCode> VkModifiers(int mods)
    {
        if ((mods & 1) != 0) yield return VirtualKeyCode.SHIFT;
        if ((mods & 2) != 0) yield return VirtualKeyCode.CONTROL;
        if ((mods & 4) != 0) yield return VirtualKeyCode.MENU;
    }

    private static readonly Lazy<IntPtr> EnLayout = new(() => LoadKeyboardLayout("00000409", 0));

    private static (VirtualKeyCode Vk, int Mods)? ResolveChar(char c)
    {
        var layout = GetKeyboardLayout(GetWindowThreadProcessId(GetForegroundWindow(), out _));
        return ResolveChar(c, layout);
    }

    private static (VirtualKeyCode Vk, int Mods)? ResolveChar(char c, IntPtr layout)
    {
        var scan = VkKeyScanExW(c, layout);
        return scan == -1 ? null : ((VirtualKeyCode)(scan & 0xFF), (scan >> 8) & 0x07);
    }

    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

    [DllImport("user32.dll")]
    private static extern IntPtr GetKeyboardLayout(uint threadId);

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    private static extern short VkKeyScanExW(char ch, IntPtr layout);

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    private static extern IntPtr LoadKeyboardLayout(string klid, uint flags);
}
