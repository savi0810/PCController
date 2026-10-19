import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colorScheme } from "nativewind";

import "@/global.css";
import { THEME } from "@/core/theme";
export { ErrorBoundary } from "expo-router";

colorScheme.set("dark");

export default function RootLayout() {
  useEffect(() => {
    const hide = () => NavigationBar.setVisibilityAsync("hidden");
    hide();
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active") hide();
    });
    return () => appState.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: THEME.background }}>
        <StatusBar hidden />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: THEME.background },
          }}
        />
        <PortalHost />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
