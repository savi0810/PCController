using PCController.Server.Input;
using PCController.Server.Protocol;
using PCController.Server.Protocol.Mouse;

namespace PCController.Server.Handlers;

public class MouseHandler
{
    private readonly IMouseInput _mouse;
    private bool _leftDown;

    public MouseHandler(IMouseInput mouse)
    {
        _mouse = mouse;
    }

    public void HandleMouseMovement(MouseMoveCommand command)
    {
        _mouse.MoveBy(command.X, command.Y);
    }

    public void HandleMouseClick(MouseClickCommand command)
    {
        switch (command.Button)
        {
            case ProtocolNames.Buttons.Left:
                _mouse.LeftClick();
                break;

            case ProtocolNames.Buttons.Right:
                _mouse.RightClick();
                break;

            default:
                Console.WriteLine($"Неизвестная кнопка мыши: {command.Button}");
                break;
        }
    }

    public void HandleMouseButtonUp(MouseButtonUpCommand command)
    {
        switch (command.Button)
        {
            case ProtocolNames.Buttons.Left:
                _leftDown = false;
                _mouse.LeftButtonUp();
                break;
            default:
                Console.WriteLine($"Неизвестная кнопка мыши: {command.Button}");
                break;
        }
    }

    public void HandleMouseButtonDown(MouseButtonDownCommand command)
    {
        switch (command.Button)
        {
            case ProtocolNames.Buttons.Left:
                _leftDown = true;
                _mouse.LeftButtonDown();
                break;
            default:
                Console.WriteLine($"Неизвестная кнопка мыши: {command.Button}");
                break;
        }
    }

    public void ReleaseButtons()
    {
        if (_leftDown) HandleMouseButtonUp(new MouseButtonUpCommand());
    }

    public void HandleMouseScroll(MouseScrollCommand command)
    {
        switch (command.Direction)
        {
            case ProtocolNames.Directions.Up:
                _mouse.ScrollUp();
                break;
            case ProtocolNames.Directions.Down:
                _mouse.ScrollDown();
                break;
            default:
                Console.WriteLine($"Неизвестное направление прокрутки: {command.Direction}");
                break;
        }
    }
}
