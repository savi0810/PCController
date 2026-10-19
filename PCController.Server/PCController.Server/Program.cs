using Microsoft.AspNetCore.Server.Kestrel.Transport.Sockets;
using PCController.Server.Handlers;
using PCController.Server.Discovery;
using PCController.Server.Hosting;
using PCController.Server.Input.Windows;
using PCController.Server.Protocol;
using PCController.Server.Transport;

if (OperatingSystem.IsWindows())
{
    if (args.Contains("--uninstall"))
    {
        AutoStart.Remove();
        return;
    }

    if (SessionLauncher.IsServiceSession)
    {
        await SessionLauncher.RunAsync();
        return;
    }

    if (!AutoStart.IsSystem && !args.Contains("--local"))
    {
        AutoStart.Install();
        return;
    }
}

ProcessSetup.ExitWithParent(args);

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<SocketTransportOptions>(options => options.NoDelay = true);

builder.WebHost.ConfigureKestrel(options => options.ListenAnyIP(ProtocolNames.Port));

if (OperatingSystem.IsWindows()) builder.Services.AddWindowsInput();
builder.Services.AddHandlers();
builder.Services.AddSingleton<WebSocketHandler>();
builder.Services.AddHostedService<DnsServiceDiscovery>();

var app = builder.Build();

app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(5),
    KeepAliveTimeout = TimeSpan.FromSeconds(10),
});
app.Map("/", (HttpContext context, WebSocketHandler handler) => handler.HandleAsync(context));

ProcessSetup.Apply();

Console.WriteLine("PCController: сервер запущен");

app.Run();
