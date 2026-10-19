import * as DialogPrimitive from "@rn-primitives/dialog";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "@/core/utils";

export const Dialog = DialogPrimitive.Root;

export function DialogContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="absolute inset-0 items-center justify-center bg-black/60 p-2">
        <Animated.View
          className="max-w-full"
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <DialogPrimitive.Content
            className={cn("rounded-2xl border border-border bg-popover p-3", className)}
            {...props}
          />
        </Animated.View>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}
