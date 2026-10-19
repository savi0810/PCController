import Zeroconf, { Service } from "react-native-zeroconf";

const RETRY_MS = 3000;

class DiscoveryService {
  private zeroconf = new Zeroconf();
  private serviceList: Service[] = [];
  private callback?: (services: Service[]) => void;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;

  private update(services: Service[]) {
    this.serviceList = services;
    this.callback?.(services);
  }

  onDeviceChanged(callback: (services: Service[]) => void) {
    this.callback = callback;
  }

  rescan = () => {
    clearTimeout(this.retryTimer);
    this.update([]);
    this.zeroconf.scan("pccontroller", "tcp", "local.");
  };

  startScanning() {
    this.zeroconf.on("resolved", (service) =>
      this.update([...this.serviceList.filter((s) => s.name !== service.name), service]),
    );
    this.zeroconf.on("remove", (name) => this.update(this.serviceList.filter((s) => s.name !== name)));
    this.zeroconf.on("error", () => {
      clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(this.rescan, RETRY_MS);
    });
    this.rescan();
  }

  stopScanning() {
    clearTimeout(this.retryTimer);
    this.zeroconf.stop();
    this.zeroconf.removeAllListeners();
    this.update([]);
  }
}

export const discoveryService = new DiscoveryService();
