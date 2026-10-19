import { useEffect, useState } from "react";
import { AppState } from "react-native";
import type { Service } from "react-native-zeroconf";

import { discoveryService } from "@/services/discoveryService";

export function useDiscovery() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    discoveryService.onDeviceChanged(setServices);
    discoveryService.startScanning();
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active") discoveryService.rescan();
    });

    return () => {
      appState.remove();
      discoveryService.stopScanning();
    };
  }, []);

  return { services, rescan: discoveryService.rescan };
}
