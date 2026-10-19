import type { LucideIcon } from "lucide-react-native";

import { PressBox } from "@/shared/PressBox";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";
import { cn } from "@/core/utils";

type Props = {
  label?: string;
  corner?: string;
  icon?: LucideIcon;
  flex?: number;
  active?: boolean;
  onPressStart: () => void;
  onPressEnd?: () => void;
};

export function KeyboardKey({
  label,
  corner,
  icon,
  flex = 1,
  active,
  onPressStart,
  onPressEnd,
}: Props) {
  const text = active ? "text-primary-foreground" : "text-foreground";

  return (
    <PressBox
      variant={active ? "primary" : "surface"}
      className={cn(
        "items-center justify-center rounded-lg border",
        active ? "border-primary" : "border-border",
      )}
      style={{ flex }}
      onPressStart={onPressStart}
      onPressEnd={onPressEnd}
    >
      {corner && (
        <Text
          className={cn(
            "absolute right-1 top-0.5 text-[10px]",
            active ? "text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {corner}
        </Text>
      )}
      {icon ? (
        <Icon as={icon} size={20} className={text} />
      ) : (
        <Text numberOfLines={1} className={text}>
          {label}
        </Text>
      )}
    </PressBox>
  );
}
