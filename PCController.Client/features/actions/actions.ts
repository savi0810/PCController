import {
  AlignLeft,
  ArrowLeft,
  ArrowLeftRight,
  Camera,
  ClipboardPaste,
  Command,
  Copy,
  FileSearch,
  LayoutGrid,
  MessageSquareCode,
  Monitor,
  Plus,
  Save,
  Scissors,
  Search,
  SquareTerminal,
  SquareX,
  TextSelect,
  Undo2,
  X,
  type LucideIcon,
} from "lucide-react-native";

import { keyboardChar, keyboardKey, type ClientMessage } from "@/core/protocol";
import { webSocketService } from "@/services/webSocketService";

export type QuickAction = { label: string; icon: LucideIcon; message: ClientMessage };
export type ActionGroup = { title: string; actions: QuickAction[] };

export const ACTION_GROUPS: ActionGroup[] = [
  {
    title: "Правка",
    actions: [
      { label: "Копировать", icon: Copy, message: keyboardChar("c", ["Ctrl"]) },
      { label: "Вставить", icon: ClipboardPaste, message: keyboardChar("v", ["Ctrl"]) },
      { label: "Вырезать", icon: Scissors, message: keyboardChar("x", ["Ctrl"]) },
      { label: "Отменить", icon: Undo2, message: keyboardChar("z", ["Ctrl"]) },
      { label: "Сохранить", icon: Save, message: keyboardChar("s", ["Ctrl"]) },
      { label: "Выделить всё", icon: TextSelect, message: keyboardChar("a", ["Ctrl"]) },
      { label: "Найти", icon: Search, message: keyboardChar("f", ["Ctrl"]) },
    ],
  },
  {
    title: "Окна",
    actions: [
      { label: "Окна", icon: LayoutGrid, message: keyboardKey("Tab", ["Win"]) },
      { label: "Пред. окно", icon: ArrowLeftRight, message: keyboardKey("Tab", ["Alt"]) },
      { label: "Раб. стол", icon: Monitor, message: keyboardChar("d", ["Win"]) },
      { label: "Скриншот", icon: Camera, message: keyboardChar("s", ["Win", "Shift"]) },
      { label: "Закрыть", icon: X, message: keyboardKey("F4", ["Alt"]) },
    ],
  },
  {
    title: "Браузер",
    actions: [
      { label: "Вкладка", icon: Plus, message: keyboardChar("t", ["Ctrl"]) },
      { label: "Закр. вкладку", icon: SquareX, message: keyboardChar("w", ["Ctrl"]) },
      { label: "Назад", icon: ArrowLeft, message: keyboardKey("ArrowLeft", ["Alt"]) },
    ],
  },
  {
    title: "VS Code",
    actions: [
      { label: "Команды", icon: Command, message: keyboardChar("p", ["Ctrl", "Shift"]) },
      { label: "Файл", icon: FileSearch, message: keyboardChar("p", ["Ctrl"]) },
      { label: "Терминал", icon: SquareTerminal, message: keyboardChar("`", ["Ctrl"]) },
      { label: "Коммент.", icon: MessageSquareCode, message: keyboardChar("/", ["Ctrl"]) },
      { label: "Формат", icon: AlignLeft, message: keyboardChar("f", ["Shift", "Alt"]) },
    ],
  },
];

export const run = (action: QuickAction) => webSocketService.send(action.message);
