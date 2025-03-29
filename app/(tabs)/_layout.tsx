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
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

function TabBarIcon(props: { name: string; color: string }) {
  const { name } = props;

  switch (name) {
    case "home":
      return <HomeFilled color={props.color} />;
    case "book":
      return <CardFilled color={props.color} />;
    case "calendar":
      return <MapPin color={props.color} />;
    case "cube":
      return <CardBroken color={props.color} />;
    case "person":
      return <SettingsFilled color={props.color} />;
    default:
      return null;
  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <ThemedView>
        <ThemedText>Loading</ThemedText>
      </ThemedView>
    );
  }

  if (status === "unauthenticated") {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
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
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: "My Trips",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="template"
        options={{
          title: "Templates",
          tabBarIcon: ({ color }) => <TabBarIcon name="cube" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
