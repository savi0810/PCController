import { useState } from "react";
import { View } from "react-native";
import { Keyboard as KeyboardIcon, Mouse, Power, Zap } from "lucide-react-native";

import type { Lang, Mode } from "@/core/types";
import { useActiveConnection } from "@/features/connection/useActiveConnection";
import { ActionsMenu } from "@/features/actions/ActionsMenu";
import { Help } from "@/features/help/Help";
import { Keyboard } from "@/features/keyboard/Keyboard";
import { PreciseButton, RightClickButton, ScrollControls } from "@/features/mouse/MouseControls";
import { MousePad } from "@/features/mouse/MousePad";
import { RailButton } from "@/shared/RailButton";

export function MainScreen({ onDisconnect }: { onDisconnect: (lost: boolean) => void }) {
  const [mode, setMode] = useState<Mode>("mouse");
  const [lang, setLang] = useState<Lang>("en");
  const [actionsOpen, setActionsOpen] = useState(false);
  const disconnect = useActiveConnection(onDisconnect);

  return (
    <View className="flex-1 flex-row gap-1.5 bg-background p-safe-or-2">
      <View className="w-14 items-center gap-1.5">
        <RailButton
          icon={mode === "mouse" ? KeyboardIcon : Mouse}
          onPress={() => setMode(mode === "mouse" ? "keyboard" : "mouse")}
          variant="accent"
        />
        <RailButton
          label={lang.toUpperCase()}
          onPress={() => setLang(lang === "en" ? "ru" : "en")}
        />
        <RailButton icon={Zap} onPress={() => setActionsOpen(true)} />

        <RailButton icon={Power} onPress={disconnect} variant="danger" />
        <ScrollControls />
      </View>

      {mode === "mouse" ? (
        <View className="flex-1">
          <MousePad />
          <View className="absolute bottom-3 right-3 flex-row gap-1.5">
            <PreciseButton />
            <RightClickButton />
          </View>
        </View>
      ) : (
        <Keyboard lang={lang} />
      )}

      <ActionsMenu open={actionsOpen} onOpenChange={setActionsOpen} />
      {mode === "mouse" && <Help />}
    </View>
  );
}
