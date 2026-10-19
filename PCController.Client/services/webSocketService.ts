import { SERVER_PORT, type ClientMessage } from "@/core/protocol";

const PING_MS = 2000;
const MAX_MISSED = 3;

class WebSocketService {
  private socket: WebSocket | null = null;
  private pingTimer: ReturnType<typeof setInterval> | undefined;

  private closeListeners = new Set<() => void>();

  subscribeClose(listener: () => void): () => void {
    this.closeListeners.add(listener);
    return () => {
      this.closeListeners.delete(listener);
    };
  }

  connect(ip: string, timeoutMs = 5000): Promise<void> {
    this.release();

    return new Promise<void>((resolve, reject) => {
      const host = ip.includes(":") ? `[${ip}]` : ip;
      const socket = new WebSocket(`ws://${host}:${SERVER_PORT}`);
      let settled = false;

      const fail = (message: string) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        socket.close();
        reject(new Error(message));
      };
      const timer = setTimeout(
        () => fail("WebSocket-соединение не установилось за отведённое время"),
        timeoutMs,
      );

      let missed = 0;
      socket.onopen = () => {
        if (settled) return socket.close();
        settled = true;
        clearTimeout(timer);
        this.socket = socket;
        this.pingTimer = setInterval(() => {
          if (++missed > MAX_MISSED) this.lose();
          else this.send({ Type: "Ping" });
        }, PING_MS);
        resolve();
      };
      socket.onmessage = () => {
        missed = 0;
      };
      socket.onerror = (e) => fail(`WebSocket: ${(e as { message?: string }).message ?? "ошибка"}`);
      socket.onclose = () => {
        if (this.socket === socket) this.lose();
        else fail("WebSocket-соединение закрылось до установки");
      };
    });
  }

  disconnect() {
    this.release();
  }

  send(message: ClientMessage) {
    this.socket?.send(JSON.stringify(message));
  }

  private release() {
    clearInterval(this.pingTimer);
    const socket = this.socket;
    this.socket = null;
    socket?.close();
    return socket !== null;
  }

  private lose() {
    if (this.release()) this.closeListeners.forEach((listener) => listener());
  }
}

export const webSocketService = new WebSocketService();
