import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from "react-native";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import { ChevronRight } from "lucide-react-native";

import { DeviceCard } from "@/features/connection/DeviceCard";
import { useConnect } from "@/features/connection/useConnect";
import { useDiscovery } from "@/features/connection/useDiscovery";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";
import { THEME } from "@/core/theme";
import { cn } from "@/core/utils";

export function DeviceSearch({ lost, onConnected }: { lost: boolean; onConnected: () => void }) {
  const { services, rescan } = useDiscovery();
  const { error, connecting, connect } = useConnect(onConnected, rescan);
  const [manualIp, setManualIp] = useState("");
  const ip = manualIp
    .trim()
    .replace(/^\w+:\/\//, "")
    .replace(/:\d+$/, "");
  const message = error ?? (lost ? "Соединение с компьютером потеряно" : null);
  const devices = services.flatMap((service) => {
    const address = service.addresses?.find((a) => !a.includes(":"));
    return address ? [{ name: service.name, address }] : [];
  });

  const submitManual = () => {
    if (ip) connect(ip, "manual");
  };

  return (
    <Animated.View
      layout={LinearTransition.duration(400).easing(Easing.out(Easing.cubic))}
      className="w-2/5 gap-3"
    >
      <Text className="text-lg font-semibold">Устройства</Text>

      {message && (
        <View className="rounded-xl border border-destructive/30 bg-destructive/15 p-2.5">
          <Text className="text-xs text-destructive">{message}</Text>
        </View>
      )}

      <View className="flex-row items-center gap-2">
        <TextInput
          className="h-12 flex-1 rounded-xl border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground/50"
          value={manualIp}
          onChangeText={setManualIp}
          placeholder="IP компьютера"
          cursorColor={THEME.primary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="decimal-pad"
          onSubmitEditing={submitManual}
        />
        <Pressable
          onPress={submitManual}
          disabled={!ip}
          className={cn(
            "size-12 items-center justify-center rounded-xl border border-border bg-card active:bg-accent",
            !ip && "opacity-50",
          )}
        >
          {connecting === "manual" ? (
            <ActivityIndicator className="text-primary" />
          ) : (
            <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
          )}
        </Pressable>
      </View>

      {devices.length === 0 ? (
        <View className="items-center gap-2 py-4">
          <ActivityIndicator className="text-primary" />
          <Text className="text-xs text-muted-foreground">Поиск устройств…</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-2.5"
          showsVerticalScrollIndicator={false}
        >
          {devices.map((device) => (
            <DeviceCard
              key={device.name}
              name={device.name}
              connecting={connecting === device.name}
              onPress={() => connect(device.address, device.name)}
            />
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}
