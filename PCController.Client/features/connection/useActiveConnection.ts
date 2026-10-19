import { useEffect } from "react";

import { webSocketService } from "@/services/webSocketService";

export function useActiveConnection(onClose: (lost: boolean) => void) {
  useEffect(() => {
    const unsubscribe = webSocketService.subscribeClose(() => onClose(true));
    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, [onClose]);

  return function disconnect() {
    webSocketService.disconnect();
    onClose(false);
  };
}
