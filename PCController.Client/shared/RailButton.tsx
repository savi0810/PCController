import type { LucideIcon } from "lucide-react-native";

import { PressBox, type PressVariant } from "@/shared/PressBox";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";
import { cn } from "@/core/utils";

type Variant = "default" | "danger" | "accent";

const LOOK: Record<Variant, { press: PressVariant; border: string; text: string }> = {
  default: { press: "raised", border: "border-border", text: "text-foreground" },
  danger: { press: "danger", border: "border-destructive/30", text: "text-destructive" },
  accent: { press: "primary", border: "border-primary", text: "text-primary-foreground" },
};

type Props = {
  icon?: LucideIcon;
  label?: string;
  onPress: () => void;
  variant?: Variant;
};

export function RailButton({ icon, label, onPress, variant = "default" }: Props) {
  const look = LOOK[variant];

  return (
    <PressBox
      variant={look.press}
      className={cn(
        "min-h-8 w-14 max-h-14 flex-1 items-center justify-center rounded-2xl border",
        look.border,
      )}
      onPress={onPress}
    >
      {icon ? (
        <Icon as={icon} size={24} className={look.text} />
      ) : (
        <Text className={cn("text-lg font-semibold", look.text)}>{label}</Text>
      )}
    </PressBox>
  );
}
