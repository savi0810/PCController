import { ScrollView, View } from "react-native";
import * as Haptics from "expo-haptics";

import { ACTION_GROUPS, run } from "@/features/actions/actions";
import { PressBox } from "@/shared/PressBox";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActionsMenu({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full">
        <ScrollView horizontal contentContainerClassName="items-start gap-4">
          {ACTION_GROUPS.map((group) => (
            <View key={group.title} className="w-[164px] gap-1">
              <Text className="text-xs text-muted-foreground">{group.title}</Text>
              <View className="flex-row flex-wrap gap-1">
                {group.actions.map((action) => (
                  <PressBox
                    key={action.label}
                    variant="raised"
                    className="h-16 w-20 items-center justify-center rounded-xl border border-border"
                    onPress={() => run(action)}
                    onPressStart={Haptics.selectionAsync}
                  >
                    <Icon as={action.icon} size={22} />
                    <Text className="mt-0.5 text-[9px] text-muted-foreground">{action.label}</Text>
                  </PressBox>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
