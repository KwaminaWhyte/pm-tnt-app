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
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <AuthProvider>
          <ToastProvider
            offsetTop={60}
            duration={2000}
            animationDuration={250}
            placement="top"
          >
            <AlertModalProvider>
              <BottomSheetProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />

                  {/* Protected Routes */}
                  <Stack.Screen
                    name="wishlist"
                    options={{
                      title: "My Favorites",
                    }}
                  />
                  <Stack.Screen
                    name="notifications"
                    options={{
                      title: "Notifications",
                    }}
                  />
                  <Stack.Screen
                    name="personal-info"
                    options={{
                      title: "Personal Information",
                    }}
                  />
                  <Stack.Screen
                    name="bookings"
                    options={{
                      title: "My Bookings",
                    }}
                  />
                  <Stack.Screen
                    name="package-template/[id]"
                    options={{ headerShown: true }}
                  />

                  {/* Public Routes */}
                  <Stack.Screen
                    name="hotels/[id]"
                    options={{
                      title: "Hotel Details",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="vehicles/[id]"
                    options={{
                      title: "Vehicle Details",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="packages/[id]"
                    options={{
                      title: "Vehicle Details",
                      headerShown: false,
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
              </BottomSheetProvider>
            </AlertModalProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
