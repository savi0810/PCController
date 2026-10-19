import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { cn } from "@/core/utils";
import * as mouse from "@/features/mouse/mouseActions";

const DEAD_ZONE = 3;
const DRAG_HOLD_MS = 300;

export function MousePad() {
  const [dragging, setDragging] = useState(false);
  const moved = useRef(false);
  const holding = useRef(false);
  const dragTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => () => clearTimeout(dragTimer.current), []);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onStart((e) => {
      x.value = e.x;
      y.value = e.y;
      opacity.value = 1;
      moved.current = false;
      dragTimer.current = setTimeout(() => {
        holding.current = true;
        setDragging(true);
        mouse.leftDown();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, DRAG_HOLD_MS);
    })
    .onChange((e) => {
      x.value = e.x;
      y.value = e.y;
      if (Math.hypot(e.translationX, e.translationY) <= DEAD_ZONE) return;
      moved.current = true;
      clearTimeout(dragTimer.current);
      mouse.move(e.changeX, e.changeY);
    })
    .onFinalize(() => {
      clearTimeout(dragTimer.current);
      opacity.value = withTiming(0, { duration: 130 });
      if (holding.current) {
        holding.current = false;
        setDragging(false);
        mouse.leftUp();
      } else if (!moved.current) {
        mouse.leftClick();
        Haptics.selectionAsync();
      }
    });

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View className="flex-1 overflow-hidden rounded-3xl border border-border/60 bg-card">
        <Animated.View
          pointerEvents="none"
          className={cn(
            "absolute -left-7 -top-7 size-14 rounded-full border-2",
            dragging ? "border-primary bg-primary" : "border-border bg-muted",
          )}
          style={indicatorStyle}
        />
      </View>
    </GestureDetector>
  );
}
