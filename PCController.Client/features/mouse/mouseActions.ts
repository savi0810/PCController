import type { ClientMessage, MouseButton, ScrollDirection } from "@/core/protocol";
import { webSocketService } from "@/services/webSocketService";
import * as repeat from "@/core/repeat";

const MIN_GAIN = 1.5;
const MAX_GAIN = 6;
const GAIN_PER_PX = 0.4;
const PRECISE_DIVIDER = 3;

const send = (message: ClientMessage) => webSocketService.send(message);

let precise = false;

export const setPrecise = (on: boolean) => {
  precise = on;
};

export const isPrecise = () => precise;

export function move(dx: number, dy: number) {
  const speed = Math.hypot(dx, dy);
  const gain = Math.min(MAX_GAIN, MIN_GAIN + speed * GAIN_PER_PX) / (precise ? PRECISE_DIVIDER : 1);
  send({ Type: "Mouse", Action: "Move", X: dx * gain, Y: dy * gain });
}

const button = (Action: "Click" | "ButtonDown" | "ButtonUp", Button: MouseButton) =>
  send({ Type: "Mouse", Action, Button });

export const leftClick = () => button("Click", "Left");
export const rightClick = () => button("Click", "Right");
export const leftDown = () => button("ButtonDown", "Left");
export const leftUp = () => button("ButtonUp", "Left");

export function startScroll(direction: ScrollDirection, onTick: () => void) {
  repeat.start(
    `scroll:${direction}`,
    () => {
      send({ Type: "Mouse", Action: "Scroll", Direction: direction });
      onTick();
    },
    280,
    60,
  );
}

export const stopScroll = (direction: ScrollDirection) => repeat.stop(`scroll:${direction}`);
