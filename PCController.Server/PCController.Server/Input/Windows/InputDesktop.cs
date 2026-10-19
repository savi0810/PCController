using System.Runtime.InteropServices;

namespace PCController.Server.Input.Windows;

public static class InputDesktop
{
    private const uint GenericAll = 0x10000000;

    [ThreadStatic]
    private static IntPtr _attached;

    private static bool _failureReported;

    public static void Run(Action input)
    {
        try
        {
            input();
        }
        catch (Exception)
        {
            AttachCurrentThread();
            input();
        }
    }

    private static void AttachCurrentThread()
    {
        var desktop = OpenInputDesktop(0, false, GenericAll);
        if (desktop == IntPtr.Zero)
        {
            ReportFailure();
            return;
        }

        if (!SetThreadDesktop(desktop))
        {
            ReportFailure();
            CloseDesktop(desktop);
            return;
        }

        if (_attached != IntPtr.Zero) CloseDesktop(_attached);
        _attached = desktop;
    }

    private static void ReportFailure()
    {
        if (_failureReported) return;
        _failureReported = true;
        Console.WriteLine($"PCController: не удалось подключиться к рабочему столу ввода (Win32 ошибка {Marshal.GetLastWin32Error()})");
    }

    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr OpenInputDesktop(uint flags, bool inherit, uint desiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool SetThreadDesktop(IntPtr desktop);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool CloseDesktop(IntPtr desktop);
}
