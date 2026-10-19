using System.Net.WebSockets;
using System.Text;
using Microsoft.AspNetCore.Http;
using PCController.Server.Handlers;

namespace PCController.Server.Transport;

public class WebSocketHandler
{
    private readonly CommandDispatcher _commandDispatcher;

    private const int BufferSize = 8192;

    public WebSocketHandler(CommandDispatcher commandDispatcher)
    {
        _commandDispatcher = commandDispatcher;
    }

    public async Task HandleAsync(HttpContext context)
    {
        if (!context.WebSockets.IsWebSocketRequest)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            return;
        }

        using var socket = await context.WebSockets.AcceptWebSocketAsync();

        try
        {
            await ReceiveLoopAsync(socket, context.RequestAborted);
        }
        catch (OperationCanceledException)
        {
        }
        catch (WebSocketException ex)
        {
            Console.WriteLine($"Ошибка соединения: {ex.Message}");
        }
        finally
        {
            _commandDispatcher.ReleaseButtons();
        }
    }

    private async Task ReceiveLoopAsync(WebSocket socket, CancellationToken ct)
    {
        var buffer = new byte[BufferSize];

        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(buffer, ct);
            if (result.MessageType == WebSocketMessageType.Close) break;

            var text = Encoding.UTF8.GetString(buffer, 0, result.Count);
            await OnMessage(socket, text, ct);
        }
    }

    private async Task OnMessage(WebSocket socket, string text, CancellationToken ct)
    {
        try
        {
            _commandDispatcher.Dispatch(text);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка обработки команды: {ex.Message}");
        }

        await socket.SendAsync("ok"u8.ToArray(), WebSocketMessageType.Text, true, ct);
    }
}
