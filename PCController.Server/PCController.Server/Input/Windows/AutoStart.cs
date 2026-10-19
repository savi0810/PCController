using System.Diagnostics;
using System.Security.Principal;
using System.Text;

namespace PCController.Server.Input.Windows;

public static class AutoStart
{
    public static bool IsSystem
    {
        get
        {
            using var identity = WindowsIdentity.GetCurrent();
            return identity.IsSystem;
        }
    }

    private static string StopRunning => $$"""
        function Others { @(Get-Process PCController.Server -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne {{Environment.ProcessId}} }) }
        Disable-ScheduledTask PCController -ErrorAction SilentlyContinue | Out-Null
        Stop-ScheduledTask PCController -ErrorAction SilentlyContinue
        for ($i = 0; $i -lt 10 -and (Others).Count -gt 0; $i++) { taskkill /F /IM PCController.Server.exe /FI "PID ne {{Environment.ProcessId}}" | Out-Null; Start-Sleep 1 }
        if ((Others).Count -gt 0) { throw 'Не удалось остановить уже запущенную программу PCController. Завершите процессы PCController.Server в Диспетчере задач и запустите установку снова.' }
        """;

    public static void Install()
    {
        var source = Environment.ProcessPath!.Replace("'", "''");

        var succeeded = RunScript($$"""
            try {
            $ErrorActionPreference = 'Stop'
            $ProgressPreference = 'SilentlyContinue'
            $src = '{{source}}'
            $dir = Join-Path $env:ProgramFiles 'PCController'
            $dst = Join-Path $dir 'PCController.Server.exe'
            {{StopRunning}}
            New-Item -ItemType Directory -Force $dir | Out-Null
            if ($src -ne $dst) { for ($i = 1; $i -le 10; $i++) { try { Copy-Item $src $dst -Force; break } catch { if ($i -eq 10) { throw }; Start-Sleep 1 } } }
            $a = New-ScheduledTaskAction -Execute $dst
            $t = (New-ScheduledTaskTrigger -AtStartup), (New-ScheduledTaskTrigger -AtLogOn)
            $s = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
            Register-ScheduledTask PCController -Action $a -Trigger $t -Settings $s -User SYSTEM -RunLevel Highest -Force | Out-Null
            Get-NetFirewallRule -DisplayName PCController -ErrorAction SilentlyContinue | Remove-NetFirewallRule
            New-NetFirewallRule -DisplayName PCController -Direction Inbound -Action Allow -Program $dst | Out-Null
            Start-ScheduledTask PCController
            } catch { Enable-ScheduledTask PCController -ErrorAction SilentlyContinue | Out-Null; Start-ScheduledTask PCController -ErrorAction SilentlyContinue; Write-Host $_.Exception.Message; exit 1 }
            """);

        if (!succeeded)
        {
            Console.WriteLine("PCController: не удалось установить автозапуск. Нажмите Enter, чтобы закрыть окно.");
            Console.ReadLine();
            return;
        }

        Console.WriteLine("PCController: установлен и будет запускаться вместе с Windows");
        Thread.Sleep(3000);
    }

    public static void Remove()
    {
        var succeeded = RunScript($$"""
            try {
            $ErrorActionPreference = 'Stop'
            $ProgressPreference = 'SilentlyContinue'
            {{StopRunning}}
            Unregister-ScheduledTask PCController -Confirm:$false -ErrorAction SilentlyContinue
            Get-NetFirewallRule -DisplayName PCController -ErrorAction SilentlyContinue | Remove-NetFirewallRule
            Remove-Item (Join-Path $env:ProgramFiles 'PCController') -Recurse -Force -ErrorAction SilentlyContinue
            } catch { Write-Host $_.Exception.Message; exit 1 }
            """);

        Console.WriteLine(succeeded ? "PCController: автозапуск удалён" : "PCController: не удалось удалить автозапуск");
        Thread.Sleep(3000);
    }

    private static bool RunScript(string script)
    {
        var powershell = Path.Combine(Environment.SystemDirectory, @"WindowsPowerShell\v1.0\powershell.exe");
        var encoded = Convert.ToBase64String(Encoding.Unicode.GetBytes(script));

        using var process = Process.Start(new ProcessStartInfo(powershell,
            $"-NoProfile -NonInteractive -ExecutionPolicy Bypass -OutputFormat Text -EncodedCommand {encoded}")
        {
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
        })!;

        var output = process.StandardOutput.ReadToEnd() + process.StandardError.ReadToEnd();
        process.WaitForExit();

        if (process.ExitCode != 0) Console.WriteLine(output.Trim());
        return process.ExitCode == 0;
    }
}
