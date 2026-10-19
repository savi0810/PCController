import { useEffect, useState } from "react";
import { View } from "react-native";
import { Space } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { KeyboardKey } from "@/features/keyboard/KeyboardKey";
import { F_ROW, NAV_ROW, ROWS, type KeyDef } from "@/features/keyboard/layouts";
import { keyDown, resolveChar } from "@/features/keyboard/keyboardActions";
import * as repeat from "@/core/repeat";
import type { Modifier } from "@/core/protocol";
import type { Lang } from "@/core/types";

export function Keyboard({ lang }: { lang: Lang }) {
  const [fnLayer, setFnLayer] = useState(true);
  const [caps, setCaps] = useState(false);
  const [mods, setMods] = useState<Modifier[]>([]);
  const shift = mods.includes("Shift");

  useEffect(() => repeat.stopAll, []);

  function press(id: string, key: KeyDef) {
    Haptics.selectionAsync();
    if (key.kind === "caps") {
      setCaps(!caps);
    } else if (key.kind === "modifier") {
      setMods(
        mods.includes(key.keyCode) ? mods.filter((m) => m !== key.keyCode) : [...mods, key.keyCode],
      );
    } else {
      keyDown(id, key, lang, caps, mods);
      if (mods.length) setMods([]);
    }
  }

  function renderKey(key: KeyDef, index: number, rowId: string) {
    const id = `${rowId}:${index}`;
    const common = {
      flex: key.flex,
      onPressStart: () => press(id, key),
      onPressEnd: () => repeat.stop(id),
    };

    switch (key.kind) {
      case "char": {
        const { value, corner } = resolveChar(key, lang, shift, caps);
        return key.en === " " ? (
          <KeyboardKey key={index} {...common} icon={Space} />
        ) : (
          <KeyboardKey key={index} {...common} label={value} corner={corner} />
        );
      }
      case "caps":
        return <KeyboardKey key={index} {...common} label="Caps" active={caps} />;
      case "modifier":
        return (
          <KeyboardKey
            key={index}
            {...common}
            label={key.label}
            icon={key.icon}
            active={mods.includes(key.keyCode)}
          />
        );
      default:
        return <KeyboardKey key={index} {...common} label={key.label} icon={key.icon} />;
    }
  }

  const rows = [fnLayer ? F_ROW : NAV_ROW, ...ROWS];

  return (
    <View className="flex-1 gap-1.5">
      {rows.map((row, r) => (
        <View key={r} className="flex-1 flex-row gap-1.5">
          {r === 0 && (
            <KeyboardKey
              label={fnLayer ? "Fn" : "Nav"}
              active
              onPressStart={() => {
                Haptics.selectionAsync();
                setFnLayer(!fnLayer);
              }}
            />
          )}
          {row.map((key, i) => renderKey(key, i, r === 0 && !fnLayer ? "nav" : `r${r}`))}
        </View>
      ))}
    </View>
  );
}
