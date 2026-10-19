import { ActivityIndicator, Pressable } from "react-native";
import { ChevronRight, Monitor } from "lucide-react-native";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";

import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";
import { cn } from "@/core/utils";

type Props = {
  name: string;
  connecting: boolean;
  onPress: () => void;
};

export function DeviceCard({ name, connecting, onPress }: Props) {
  return (
    <Animated.View entering={FadeInLeft.duration(2500).easing(Easing.out(Easing.cubic))}>
      <Pressable
        onPress={onPress}
        className={cn(
          "h-16 w-full flex-row items-center gap-3 rounded-xl border border-border bg-card px-3 active:bg-accent",
          connecting && "bg-accent",
        )}
      >
        <Icon as={Monitor} size={22} className="text-muted-foreground" />
        <Text className="flex-1 text-sm font-medium" numberOfLines={1}>
          {name}
        </Text>
        {connecting ? (
          <ActivityIndicator className="text-primary" />
        ) : (
          <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
        )}
      </Pressable>
    </Animated.View>
  );
}
