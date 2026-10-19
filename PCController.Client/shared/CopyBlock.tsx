import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Check, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";

export function CopyBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(value);
    Haptics.selectionAsync();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View className="flex-row items-center gap-2 rounded-xl border border-border bg-muted py-2.5 pl-3 pr-2.5">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
        <Pressable onPress={copy}>
          <Text className="font-mono text-xs">{value}</Text>
        </Pressable>
      </ScrollView>
      <Pressable onPress={copy} hitSlop={8}>
        <Icon as={copied ? Check : Copy} size={16} className="text-muted-foreground" />
      </Pressable>
    </View>
  );
}
