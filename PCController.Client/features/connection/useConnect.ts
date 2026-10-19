import { useState } from "react";

import { webSocketService } from "@/services/webSocketService";

const CONNECT_ERROR =
  "Не удалось подключиться. Проверьте, что на компьютере запущена программа PCController, а телефон и компьютер подключены к одной сети Wi-Fi.";
const MANUAL_ERROR = `${CONNECT_ERROR} Проверьте также, правильно ли введён IP-адрес.`;

export function useConnect(onConnected: () => void, onFailed: () => void) {
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  async function connect(address: string, id: string) {
    if (connecting) return;
    setConnecting(id);
    setError(null);
    try {
      await webSocketService.connect(address);
      onConnected();
    } catch (e) {
      setError(id === "manual" ? MANUAL_ERROR : CONNECT_ERROR);
      console.error("Connection error:", e);
      onFailed();
    } finally {
      setConnecting(null);
    }
  }

  return { error, connecting, connect };
}
