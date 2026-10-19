import { useState } from "react";
import { View } from "react-native";
import { ChevronDown, ChevronUp, Crosshair, MousePointerClick } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { PressBox } from "@/shared/PressBox";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";
import { cn } from "@/core/utils";
import * as mouse from "@/features/mouse/mouseActions";

export function ScrollControls() {
  return (
    <View className="max-h-[86px] min-h-[70px] flex-[2] gap-1.5">
      {(["Up", "Down"] as const).map((direction) => (
        <PressBox
          key={direction}
          variant="raised"
          className="min-h-8 w-14 max-h-10 flex-1 items-center justify-center rounded-2xl border border-border"
          maxDistance={48}
          onPressStart={() => mouse.startScroll(direction, Haptics.selectionAsync)}
          onPressEnd={() => mouse.stopScroll(direction)}
        >
          <Icon as={direction === "Up" ? ChevronUp : ChevronDown} size={24} />
        </PressBox>
      ))}
    </View>
  );
}

export function RightClickButton() {
  return (
    <PressBox
      variant="primary"
      className="h-14 w-32 flex-row items-center justify-center gap-1.5 rounded-2xl"
      onPress={mouse.rightClick}
      onPressStart={Haptics.selectionAsync}
    >
      <Icon as={MousePointerClick} size={20} className="text-primary-foreground" />
      <Text className="font-semibold text-primary-foreground">ПКМ</Text>
    </PressBox>
  );
}

export function PreciseButton() {
  const [on, setOn] = useState(mouse.isPrecise);

  const toggle = () => {
    mouse.setPrecise(!on);
    setOn(!on);
  };

  return (
    <PressBox
      variant={on ? "primary" : "raised"}
      className="size-14 items-center justify-center rounded-2xl border border-border"
      onPress={toggle}
      onPressStart={Haptics.selectionAsync}
    >
      <Icon as={Crosshair} size={24} className={cn(on && "text-primary-foreground")} />
    </PressBox>
  );
}
