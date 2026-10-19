import { Text as RNText } from "react-native";

import { cn } from "@/core/utils";

export function Text({ className, ...props }: React.ComponentProps<typeof RNText>) {
  return <RNText className={cn("text-base text-foreground", className)} {...props} />;
}
