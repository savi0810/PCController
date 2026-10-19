import { useEffect, useRef, useState, type ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { cn } from "@/core/utils";

export type PressVariant = "surface" | "raised" | "primary" | "danger";

const COLORS: Record<PressVariant, [rest: string, pressed: string]> = {
  surface: ["bg-card", "bg-accent"],
  raised: ["bg-muted", "bg-accent"],
  primary: ["bg-primary", "bg-primary/80"],
  danger: ["bg-destructive/15", "bg-destructive/30"],
};

type Props = {
  variant: PressVariant;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  maxDistance?: number;
  children?: ReactNode;
};

export function PressBox({
  variant,
  className,
  style,
  onPress,
  onPressStart,
  onPressEnd,
  maxDistance = 24,
  children,
}: Props) {
  const [pressed, setPressed] = useState(false);

  const cb = useRef({ onPress, onPressStart, onPressEnd });
  cb.current = { onPress, onPressStart, onPressEnd };

  useEffect(() => () => cb.current.onPressEnd?.(), []);

  const [gesture] = useState(() =>
    Gesture.Tap()
      .runOnJS(true)
      .maxDuration(60_000)
      .maxDistance(maxDistance)
      .onBegin(() => {
        setPressed(true);
        cb.current.onPressStart?.();
      })
      .onEnd(() => cb.current.onPress?.())
      .onFinalize(() => {
        setPressed(false);
        cb.current.onPressEnd?.();
      }),
  );

  return (
    <GestureDetector gesture={gesture}>
      <View className={cn(COLORS[variant][pressed ? 1 : 0], className)} style={style}>
        {children}
      </View>
    </GestureDetector>
  );
}
