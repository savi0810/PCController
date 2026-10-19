using Makaretu.Dns;
using PCController.Server.Protocol;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;

namespace PCController.Server.Discovery;

public class DnsServiceDiscovery : BackgroundService
{
    private static readonly string[] VirtualMarkers = ["tun", "tap", "vpn", "virtual", "vethernet"];

    private ServiceDiscovery? _discovery;
    private List<IPAddress> _addresses = [];

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Refresh();
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(10));
        while (await timer.WaitForNextTickAsync(stoppingToken)) Refresh();
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await base.StopAsync(cancellationToken);
        Unadvertise();
    }

    private void Refresh()
    {
        try
        {
            var addresses = GetLanAddresses();
            if (_discovery is not null && addresses.SequenceEqual(_addresses)) return;

            Unadvertise();

            var profile = new ServiceProfile(Environment.MachineName, "_pccontroller._tcp", ProtocolNames.Port, addresses);
            _discovery = new ServiceDiscovery();
            _discovery.Advertise(profile);
            _discovery.Announce(profile);
            _addresses = addresses;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"PCController: не удалось объявить компьютер в сети — {ex.Message}");
        }
    }

    private void Unadvertise()
    {
        try
        {
            _discovery?.Unadvertise();
            _discovery?.Dispose();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"PCController: не удалось убрать объявление из сети — {ex.Message}");
        }

        _discovery = null;
    }

    private static List<IPAddress> GetLanAddresses() =>
        NetworkInterface.GetAllNetworkInterfaces()
            .Where(IsRealLan)
            .SelectMany(ni => ni.GetIPProperties().UnicastAddresses)
            .Select(a => a.Address)
            .Where(a => a.AddressFamily == AddressFamily.InterNetwork && !a.ToString().StartsWith("169.254."))
            .OrderBy(a => a.ToString())
            .ToList();

    private static bool IsRealLan(NetworkInterface ni)
    {
        if (ni.OperationalStatus != OperationalStatus.Up) return false;
        if (ni.NetworkInterfaceType is not (NetworkInterfaceType.Ethernet or NetworkInterfaceType.Wireless80211)) return false;

        var name = $"{ni.Name} {ni.Description}".ToLowerInvariant();
        if (VirtualMarkers.Any(name.Contains)) return false;

        return ni.GetIPProperties().GatewayAddresses
            .Any(g => g.Address.AddressFamily == AddressFamily.InterNetwork && !g.Address.Equals(IPAddress.Any));
    }
}
