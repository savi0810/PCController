using WindowsInput;

namespace PCController.Server.Input.Windows;

public class MouseController : IMouseInput
{
    private readonly InputSimulator _sim;

    public MouseController(InputSimulator sim)
    {
        _sim = sim;
    }

    public void MoveBy(double dx, double dy)
    {
        InputDesktop.Run(() => _sim.Mouse.MoveMouseBy(RoundToNonZeroInt(dx), RoundToNonZeroInt(dy)));
    }

    private static int RoundToNonZeroInt(double v)
    {
        if (v == 0) return 0;
        var rounded = (int)Math.Round(v, MidpointRounding.AwayFromZero);
        return rounded != 0 ? rounded : Math.Sign(v);
    }

    public void LeftClick() => InputDesktop.Run(() => _sim.Mouse.LeftButtonClick());
    public void LeftButtonDown() => InputDesktop.Run(() => _sim.Mouse.LeftButtonDown());
    public void LeftButtonUp() => InputDesktop.Run(() => _sim.Mouse.LeftButtonUp());
    public void ScrollUp() => InputDesktop.Run(() => _sim.Mouse.VerticalScroll(1));
    public void ScrollDown() => InputDesktop.Run(() => _sim.Mouse.VerticalScroll(-1));
    public void RightClick() => InputDesktop.Run(() => _sim.Mouse.RightButtonClick());
}
