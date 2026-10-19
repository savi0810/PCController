const timers = new Map<string, ReturnType<typeof setTimeout>>();

export function start(id: string, fire: () => void, delayMs: number, intervalMs: number) {
  stop(id);
  fire();
  timers.set(
    id,
    setTimeout(() => timers.set(id, setInterval(fire, intervalMs)), delayMs),
  );
}

export function stop(id: string) {
  clearTimeout(timers.get(id));
  clearInterval(timers.get(id));
  timers.delete(id);
}

export function stopAll() {
  timers.forEach((_, id) => stop(id));
}
