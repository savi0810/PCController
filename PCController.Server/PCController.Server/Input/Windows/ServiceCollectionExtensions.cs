using WindowsInput;

namespace PCController.Server.Input.Windows;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddWindowsInput(this IServiceCollection services)
    {
        services.AddSingleton<InputSimulator>();
        services.AddSingleton<IMouseInput, MouseController>();
        services.AddSingleton<IKeyboardInput, KeyboardController>();
        return services;
    }
}
