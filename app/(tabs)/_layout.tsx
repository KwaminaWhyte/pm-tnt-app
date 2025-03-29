import { Tabs, usePathname } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  CardBroken,
  CardFilled,
  HomeBroken,
  HomeFilled,
  SettingsBroken,
  SettingsFilled,
} from "@/components/icons/tabs";
import { MapPin, Plane, PlaneTakeoff } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F5A524",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused ? (
                <HomeFilled color={color} />
              ) : (
                <HomeBroken color={color} />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused ? (
                <CardFilled color={color} />
              ) : (
                <CardBroken color={color} />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: "Trip",
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused ? (
                <MapPin color={color} />
              ) : (
                <PlaneTakeoff color={color} />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused ? (
                <SettingsFilled color={color} />
              ) : (
                <SettingsBroken color={color} />
              )}
            </>
          ),
        }}
      />
    </Tabs>
  );
}
