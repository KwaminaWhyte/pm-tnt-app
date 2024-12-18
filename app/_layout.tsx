import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";

import { useColorScheme } from "@/hooks/useColorScheme";
import "@/global.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AlertModalProvider } from "@/context/AlertModalContext";
import { BottomSheetProvider } from "@/context/BottomSheetContext";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ToastProvider
          offsetTop={60}
          duration={2000}
          animationDuration={250}
          placement="top"
        >
          <BottomSheetProvider>
            <AlertModalProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="details"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="vehicle-details"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="wishlist"
                    options={{
                      title: "My Favorites",
                    }}
                  />
                  <Stack.Screen
                    name="bookings"
                    options={{
                      title: "My Bookings",
                    }}
                  />
                  <Stack.Screen
                    name="login"
                    options={{ presentation: "modal", headerShown: false }}
                  />
                  <Stack.Screen
                    name="register"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </AlertModalProvider>
          </BottomSheetProvider>
        </ToastProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
