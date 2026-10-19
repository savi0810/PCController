export const SERVER_PORT = 5000;

export type Modifier = "Ctrl" | "Alt" | "Win" | "Shift";
export type MouseButton = "Left" | "Right";
export type ScrollDirection = "Up" | "Down";

export type ClientMessage =
  | { Type: "Keyboard"; Action: "Char"; Char: string; Modifiers: Modifier[] }
  | { Type: "Keyboard"; Action: "Key"; Key: string; Modifiers: Modifier[] }
  | { Type: "Mouse"; Action: "Move"; X: number; Y: number }
  | { Type: "Mouse"; Action: "Click" | "ButtonDown" | "ButtonUp"; Button: MouseButton }
  | { Type: "Mouse"; Action: "Scroll"; Direction: ScrollDirection }
  | { Type: "Ping" };

export const keyboardChar = (char: string, modifiers: Modifier[]): ClientMessage => ({
  Type: "Keyboard",
  Action: "Char",
  Char: char,
  Modifiers: modifiers,
});

export const keyboardKey = (key: string, modifiers: Modifier[]): ClientMessage => ({
  Type: "Keyboard",
  Action: "Key",
  Key: key,
  Modifiers: modifiers,
});
