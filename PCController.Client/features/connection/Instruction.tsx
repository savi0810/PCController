import { Pressable, ScrollView } from "react-native";
import Animated, { Easing, SlideInRight, SlideOutRight } from "react-native-reanimated";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { Step } from "@/features/connection/Step";
import { CopyBlock } from "@/shared/CopyBlock";
import { Icon } from "@/shared/ui/icon";
import { Text } from "@/shared/ui/text";

const REPO_URL = "https://github.com/savi0810/PCController";

export function Instruction({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <>
      {open && (
        <Animated.View
          entering={SlideInRight.duration(400).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutRight.duration(300)}
          className="absolute bottom-0 right-0 top-0 w-[60%] rounded-l-2xl border-l border-border bg-card py-3 pl-3 pr-10"
        >
          <ScrollView contentContainerClassName="gap-3">
            <Step number={1}>
              <Text className="text-sm">Установите программу на компьютер. Прочитайте о ней по ссылке:</Text>
              <CopyBlock value={REPO_URL} />
              <Text className="text-xs text-muted-foreground">
                Найдите на странице раздел{" "}
                <Text className="text-xs font-semibold text-foreground">«Как установить»</Text>
              </Text>
            </Step>
            <Step number={2}>
              <Text className="text-sm">Телефон и компьютер должны быть в одной сети Wi-Fi</Text>
            </Step>
            <Step number={3}>
              <Text className="text-sm">
                Подождите несколько секунд: компьютер появится в списке слева. Нажмите на него, чтобы подключиться
              </Text>
            </Step>
            <Step number={4}>
              <Text className="text-sm">
                Если компьютер не нашёлся, введите его IP-адрес в поле слева
              </Text>
              <Text className="text-xs text-muted-foreground">
                IP-адрес можно узнать в свойствах Wi-Fi на компьютере, в строке «IPv4-адрес»
              </Text>
            </Step>
          </ScrollView>
        </Animated.View>
      )}

      <Pressable
        onPress={onToggle}
        className="absolute right-0 top-1/2 -mt-7 h-14 w-8 items-center justify-center rounded-l-xl border border-r-0 border-border bg-muted active:bg-accent"
      >
        <Icon as={open ? ChevronRight : ChevronLeft} size={20} className="text-muted-foreground" />
      </Pressable>
    </>
  );
}
