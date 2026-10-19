import { useState } from "react";
import { View } from "react-native";

import { DeviceSearch } from "@/features/connection/DeviceSearch";
import { Instruction } from "@/features/connection/Instruction";
import { cn } from "@/core/utils";

export function ConnectionScreen({ lost, onConnected }: { lost: boolean; onConnected: () => void }) {
  const [instructionOpen, setInstructionOpen] = useState(false);

  return (
    <View className={cn("flex-1 flex-row bg-background p-safe-or-3", !instructionOpen && "justify-center")}>
      <DeviceSearch lost={lost} onConnected={onConnected} />
      <Instruction open={instructionOpen} onToggle={() => setInstructionOpen(!instructionOpen)} />
    </View>
  );
}
