using System.ComponentModel;
using System.Diagnostics;
using System.Security.Principal;

namespace PCController.Server.Hosting;

public static class ProcessSetup
{
    public static void Apply()
    {
        RaisePriority();
        WarnIfNotAdmin();
    }

    public static void ExitWithParent(string[] args)
    {
        const string prefix = "--parent=";
        var arg = args.FirstOrDefault(a => a.StartsWith(prefix));
        if (arg is null || !int.TryParse(arg[prefix.Length..], out var parentId)) return;

        try
        {
            Process.GetProcessById(parentId).WaitForExitAsync().ContinueWith(_ => Environment.Exit(0));
        }
        catch (ArgumentException)
        {
            Environment.Exit(0);
        }
    }

    private static void RaisePriority()
    {
        using var self = Process.GetCurrentProcess();
        try
        {
            self.PriorityClass = ProcessPriorityClass.AboveNormal;
        }
        catch (Exception ex) when (ex is Win32Exception or InvalidOperationException)
        {
            Console.WriteLine($"PCController: не удалось повысить приоритет процесса — {ex.Message}");
        }
    }

    private static void WarnIfNotAdmin()
    {
        using var identity = WindowsIdentity.GetCurrent();
        var isAdmin = new WindowsPrincipal(identity).IsInRole(WindowsBuiltInRole.Administrator);
        if (!isAdmin)
            Console.WriteLine("PCController: запущен БЕЗ прав администратора — " +
                "ввод не дойдёт до окон, поднятых от администратора (UIPI)");
    }
}
