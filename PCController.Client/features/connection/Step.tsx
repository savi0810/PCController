import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/shared/ui/text";

export function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
    <View className="flex-row gap-3">
      <View className="size-6 items-center justify-center rounded-full bg-primary">
        <Text className="text-xs font-semibold text-primary-foreground">{number}</Text>
      </View>
      <View className="flex-1 gap-2">{children}</View>
    </View>
  );
}
