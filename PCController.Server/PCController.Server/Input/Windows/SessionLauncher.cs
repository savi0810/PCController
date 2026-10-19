using System.ComponentModel;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace PCController.Server.Input.Windows;

public static class SessionLauncher
{
    private const uint NoSession = 0xFFFFFFFF;
    private const uint TokenDuplicate = 0x0002;
    private const uint MaximumAllowed = 0x02000000;
    private const int SecurityImpersonation = 2;
    private const int TokenPrimary = 1;
    private const int TokenSessionId = 12;
    private const uint CreateNoWindow = 0x08000000;

    public static bool IsServiceSession
    {
        get
        {
            using var self = Process.GetCurrentProcess();
            return self.SessionId == 0;
        }
    }

    public static async Task RunAsync()
    {
        while (true)
        {
            var session = WTSGetActiveConsoleSessionId();
            var delay = 1000;

            if (session != NoSession)
            {
                var started = Environment.TickCount64;
                try
                {
                    using var agent = StartAgent(session);
                    while (!agent.HasExited && WTSGetActiveConsoleSessionId() == session)
                        await Task.Delay(2000);
                    if (!agent.HasExited) agent.Kill();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"PCController: агент в сессии {session} не работает — {ex.Message}");
                }
                if (Environment.TickCount64 - started < 10_000) delay = 10_000;
            }

            await Task.Delay(delay);
        }
    }

    private static Process StartAgent(uint session)
    {
        using var self = Process.GetCurrentProcess();

        if (!OpenProcessToken(self.Handle, TokenDuplicate, out var systemToken))
            throw new Win32Exception();

        try
        {
            if (!DuplicateTokenEx(systemToken, MaximumAllowed, IntPtr.Zero, SecurityImpersonation, TokenPrimary, out var sessionToken))
                throw new Win32Exception();

            try
            {
                if (!SetTokenInformation(sessionToken, TokenSessionId, ref session, sizeof(uint)))
                    throw new Win32Exception();

                var startup = new StartupInfo { cb = Marshal.SizeOf<StartupInfo>(), lpDesktop = @"winsta0\default" };
                var commandLine = $"\"{Environment.ProcessPath}\" --parent={Environment.ProcessId}";

                if (!CreateProcessAsUser(sessionToken, null, commandLine, IntPtr.Zero, IntPtr.Zero, false,
                        CreateNoWindow, IntPtr.Zero, AppContext.BaseDirectory, ref startup, out var info))
                    throw new Win32Exception();

                CloseHandle(info.hThread);
                CloseHandle(info.hProcess);
                return Process.GetProcessById(info.dwProcessId);
            }
            finally
            {
                CloseHandle(sessionToken);
            }
        }
        finally
        {
            CloseHandle(systemToken);
        }
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct StartupInfo
    {
        public int cb;
        public string? lpReserved;
        public string? lpDesktop;
        public string? lpTitle;
        public int dwX, dwY, dwXSize, dwYSize, dwXCountChars, dwYCountChars, dwFillAttribute, dwFlags;
        public short wShowWindow, cbReserved2;
        public IntPtr lpReserved2, hStdInput, hStdOutput, hStdError;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct ProcessInformation
    {
        public IntPtr hProcess, hThread;
        public int dwProcessId, dwThreadId;
    }

    [DllImport("kernel32.dll")]
    private static extern uint WTSGetActiveConsoleSessionId();

    [DllImport("kernel32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool CloseHandle(IntPtr handle);

    [DllImport("advapi32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool OpenProcessToken(IntPtr process, uint desiredAccess, out IntPtr token);

    [DllImport("advapi32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool DuplicateTokenEx(IntPtr token, uint desiredAccess, IntPtr attributes,
        int impersonationLevel, int tokenType, out IntPtr newToken);

    [DllImport("advapi32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool SetTokenInformation(IntPtr token, int informationClass, ref uint information, int length);

    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode, EntryPoint = "CreateProcessAsUserW")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool CreateProcessAsUser(IntPtr token, string? applicationName, string commandLine,
        IntPtr processAttributes, IntPtr threadAttributes, bool inheritHandles, uint creationFlags,
        IntPtr environment, string? currentDirectorys, ref StartupInfo startupInfo, out ProcessInformation processInformation);
}
