import {
  ArrowBigUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CornerDownLeft,
  Delete,
  type LucideIcon,
} from "lucide-react-native";

import type { Modifier } from "@/core/protocol";

export type KeyDef =
  | { kind: "char"; en: string; ru: string; shiftEn?: string; shiftRu?: string; flex?: number }
  | {
      kind: "special";
      label: string;
      icon?: LucideIcon;
      keyCode: string;
      flex?: number;
      repeat?: boolean;
    }
  | { kind: "modifier"; label: string; keyCode: Modifier; icon?: LucideIcon; flex?: number }
  | { kind: "caps"; flex?: number };

const letters = (en: string, ru: string): KeyDef[] =>
  [...en].map((char, i) => ({ kind: "char", en: char, ru: ru[i] }));

export const F_ROW: KeyDef[] = [
  { kind: "special", label: "Esc", keyCode: "Escape" },
  ...Array.from({ length: 12 }, (_, i): KeyDef => ({
    kind: "special",
    label: `F${i + 1}`,
    keyCode: `F${i + 1}`,
  })),
];

export const NAV_ROW: KeyDef[] = [
  { kind: "special", label: "Esc", keyCode: "Escape" },
  { kind: "special", label: "Del", keyCode: "Delete", repeat: true },
  { kind: "special", label: "Ins", keyCode: "Insert" },
  { kind: "special", label: "Home", keyCode: "Home" },
  { kind: "special", label: "End", keyCode: "End" },
  { kind: "special", label: "PgUp", keyCode: "PageUp", repeat: true },
  { kind: "special", label: "PgDn", keyCode: "PageDown", repeat: true },
];

export const ROWS: KeyDef[][] = [
  [
    { kind: "char", en: "`", ru: "ё", shiftEn: "~", shiftRu: "Ё" },
    { kind: "char", en: "1", ru: "1", shiftEn: "!", shiftRu: "!" },
    { kind: "char", en: "2", ru: "2", shiftEn: "@", shiftRu: "\"" },
    { kind: "char", en: "3", ru: "3", shiftEn: "#", shiftRu: "№" },
    { kind: "char", en: "4", ru: "4", shiftEn: "$", shiftRu: ";" },
    { kind: "char", en: "5", ru: "5", shiftEn: "%", shiftRu: "%" },
    { kind: "char", en: "6", ru: "6", shiftEn: "^", shiftRu: ":" },
    { kind: "char", en: "7", ru: "7", shiftEn: "&", shiftRu: "?" },
    { kind: "char", en: "8", ru: "8", shiftEn: "*", shiftRu: "*" },
    { kind: "char", en: "9", ru: "9", shiftEn: "(", shiftRu: "(" },
    { kind: "char", en: "0", ru: "0", shiftEn: ")", shiftRu: ")" },
    { kind: "char", en: "-", ru: "-", shiftEn: "_", shiftRu: "_" },
    { kind: "char", en: "=", ru: "=", shiftEn: "+", shiftRu: "+" },
    { kind: "special", label: "Backspace", icon: Delete, keyCode: "Backspace", flex: 2, repeat: true },
  ],
  [
    { kind: "special", label: "Tab", keyCode: "Tab", flex: 1.5 },
    ...letters("qwertyuiop", "йцукенгшщз"),
    { kind: "char", en: "[", ru: "х", shiftEn: "{", shiftRu: "Х" },
    { kind: "char", en: "]", ru: "ъ", shiftEn: "}", shiftRu: "Ъ" },
    { kind: "char", en: "\\", ru: "\\", shiftEn: "|", shiftRu: "/" },
  ],
  [
    { kind: "caps", flex: 1.75 },
    ...letters("asdfghjkl", "фывапролд"),
    { kind: "char", en: ";", ru: "ж", shiftEn: ":", shiftRu: "Ж" },
    { kind: "char", en: "'", ru: "э", shiftEn: "\"", shiftRu: "Э" },
    { kind: "special", label: "Enter", icon: CornerDownLeft, keyCode: "Enter", flex: 2 },
  ],
  [
    { kind: "modifier", label: "Shift", keyCode: "Shift", icon: ArrowBigUp, flex: 2.25 },
    ...letters("zxcvbnm", "ячсмить"),
    { kind: "char", en: ",", ru: "б", shiftEn: "<", shiftRu: "Б" },
    { kind: "char", en: ".", ru: "ю", shiftEn: ">", shiftRu: "Ю" },
    { kind: "char", en: "/", ru: ".", shiftEn: "?", shiftRu: "," },
    { kind: "modifier", label: "Shift", keyCode: "Shift", icon: ArrowBigUp, flex: 2.25 },
  ],
  [
    { kind: "modifier", label: "Ctrl", keyCode: "Ctrl", flex: 1.2 },
    { kind: "modifier", label: "Win", keyCode: "Win", flex: 1.0 },
    { kind: "modifier", label: "Alt", keyCode: "Alt", flex: 1.0 },
    { kind: "char", en: " ", ru: " ", flex: 4.0 },
    { kind: "modifier", label: "Alt", keyCode: "Alt", flex: 1.0 },
    { kind: "modifier", label: "Ctrl", keyCode: "Ctrl", flex: 1.0 },
    { kind: "special", label: "Left", icon: ChevronLeft, keyCode: "ArrowLeft", repeat: true },
    { kind: "special", label: "Up", icon: ChevronUp, keyCode: "ArrowUp", repeat: true },
    { kind: "special", label: "Down", icon: ChevronDown, keyCode: "ArrowDown", repeat: true },
    { kind: "special", label: "Right", icon: ChevronRight, keyCode: "ArrowRight", repeat: true },
  ],
];
