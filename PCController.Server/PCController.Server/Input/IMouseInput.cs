namespace PCController.Server.Input;

public interface IMouseInput
{
    void MoveBy(double dx, double dy);
    void LeftClick();
    void RightClick();
    void LeftButtonDown();
    void LeftButtonUp();
    void ScrollUp();
    void ScrollDown();
}
