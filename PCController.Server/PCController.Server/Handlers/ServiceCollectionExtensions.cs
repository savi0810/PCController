namespace PCController.Server.Handlers;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddHandlers(this IServiceCollection services)
    {
        services.AddSingleton<MouseHandler>();
        services.AddSingleton<KeyboardHandler>();
        services.AddSingleton<CommandDispatcher>();
        return services;
    }
}
