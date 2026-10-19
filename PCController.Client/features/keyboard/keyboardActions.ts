import { keyboardChar, keyboardKey, type ClientMessage, type Modifier } from "@/core/protocol";
import type { Lang } from "@/core/types";
import type { KeyDef } from "@/features/keyboard/layouts";
import { webSocketService } from "@/services/webSocketService";
import * as repeat from "@/core/repeat";

const LETTER_RE = /^[a-zа-яё]$/i;

export function resolveChar(
  key: Extract<KeyDef, { kind: "char" }>,
  lang: Lang,
  shift: boolean,
  caps: boolean,
) {
  const base = lang === "en" ? key.en : key.ru;
  const shifted = lang === "en" ? key.shiftEn : key.shiftRu;
  const isLetter = LETTER_RE.test(base);
  const upper = isLetter ? shift !== caps : shift;

  if (shifted === undefined) {
    return { value: isLetter && upper ? base.toUpperCase() : base, corner: undefined };
  }
  return {
    value: upper ? shifted : base,
    corner: isLetter ? undefined : shift ? base : shifted,
  };
}

function fire(id: string, message: ClientMessage, canRepeat: boolean) {
  const send = () => webSocketService.send(message);
  if (canRepeat) repeat.start(id, send, 400, 60);
  else send();
}

export function keyDown(id: string, key: KeyDef, lang: Lang, caps: boolean, mods: Modifier[]) {
  if (key.kind === "char") {
    if (mods.some((m) => m !== "Shift")) {
      fire(id, keyboardChar(key.en, mods), false);
    } else {
      fire(id, keyboardChar(resolveChar(key, lang, mods.includes("Shift"), caps).value, []), true);
    }
  } else if (key.kind === "special") {
    fire(id, keyboardKey(key.keyCode, mods), key.repeat === true);
  }
}
