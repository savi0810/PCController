import { useState } from "react";
import { Pressable, View } from "react-native";
import {
  ChevronsUpDown,
  CircleQuestionMark,
  Crosshair,
  Keyboard,
  Languages,
  MousePointerClick,
  Pointer,
  Power,
  Zap,
  type LucideIcon,
} from "lucide-react-native";

import { PressBox } from "@/shared/PressBox";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";

const GUIDE: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Pointer, title: "Тачпад", text: "Касание — левый клик, удержание — перетаскивание" },
  { icon: Keyboard, title: "Мышь / Клавиатура", text: "Переключает режим управления" },
  { icon: Zap, title: "Быстрые команды", text: "Копировать, вставить, окна, браузер, VS Code" },
  { icon: Languages, title: "Язык", text: "Раскладка экранной клавиатуры EN / RU" },
  { icon: ChevronsUpDown, title: "Прокрутка", text: "Удерживайте для непрерывной прокрутки" },
  { icon: Crosshair, title: "Точное наведение", text: "Замедляет курсор для мелких движений" },
  { icon: MousePointerClick, title: "ПКМ", text: "Правая кнопка мыши" },
  { icon: Power, title: "Отключиться", text: "Вернуться к выбору ПК" },
];

export function Help() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        className="absolute right-2 top-2 size-8 items-center justify-center rounded-full border border-border bg-muted/80 active:bg-accent"
      >
        <Icon as={CircleQuestionMark} size={18} className="text-muted-foreground" />
      </Pressable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[600px] max-w-full gap-3">
          <Text className="text-base font-semibold">Руководство</Text>
          <View className="flex-row flex-wrap">
            {GUIDE.map((item) => (
              <View key={item.title} className="w-1/2 flex-row items-center gap-3 p-1.5">
                <View className="size-9 items-center justify-center rounded-xl bg-muted">
                  <Icon as={item.icon} size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium">{item.title}</Text>
                  <Text className="text-xs text-muted-foreground">{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
          <PressBox
            variant="primary"
            className="h-11 items-center justify-center rounded-xl"
            onPress={() => setOpen(false)}
          >
            <Text className="font-semibold text-primary-foreground">OK</Text>
          </PressBox>
        </DialogContent>
      </Dialog>
    </>
  );
}
