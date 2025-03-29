import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Notifications() {
  const { auth } = useAuth();
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);

  // Sample notifications data - would be fetched from API in a real app
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message: "Your hotel booking at Sunset Resort has been confirmed.",
      date: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: "2",
      type: "payment_success",
      title: "Payment Successful",
      message:
        "Your payment of $245 for the Accra City Tour package was successful.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true,
    },
    {
      id: "3",
      type: "booking_reminder",
      title: "Trip Tomorrow",
      message:
        "Reminder: Your trip to Cape Coast Castle is scheduled for tomorrow at 9:00 AM.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: false,
    },
    {
      id: "4",
      type: "special_offer",
      title: "Special Offer",
      message:
        "Limited time offer: 25% off on all beach resort bookings this weekend!",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
    },
    {
      id: "5",
      type: "vehicle_ready",
      title: "Vehicle Ready",
      message:
        "Your rental car (Toyota Camry, GR-2453-21) is ready for pickup.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      read: true,
    },
    {
      id: "6",
      type: "booking_canceled",
      title: "Booking Canceled",
      message:
        "Your booking for Elmina Beach Resort has been canceled as requested.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      read: true,
    },
    {
      id: "7",
      type: "welcome",
      title: "Welcome to TNT Travel",
      message:
        "Thank you for choosing TNT Travel. Explore our services and find your next adventure!",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "booking_confirmed":
        return (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#22c55e"
          />
        );
      case "payment_success":
        return (
          <MaterialCommunityIcons
            name="credit-card-check"
            size={24}
            color="#0ea5e9"
          />
        );
      case "booking_reminder":
        return (
          <MaterialCommunityIcons
            name="clock-alert"
            size={24}
            color="#eab308"
          />
        );
      case "special_offer":
        return <MaterialCommunityIcons name="tag" size={24} color="#ec4899" />;
      case "vehicle_ready":
        return <MaterialCommunityIcons name="car" size={24} color="#8b5cf6" />;
      case "booking_canceled":
        return (
          <MaterialCommunityIcons
            name="calendar-remove"
            size={24}
            color="#ef4444"
          />
        );
      case "welcome":
        return (
          <MaterialCommunityIcons name="hand-wave" size={24} color="#eab308" />
        );
      default:
        return <MaterialCommunityIcons name="bell" size={24} color="#94a3b8" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      {/* Header */}
      {/* <View className="px-4 py-3 flex-row justify-between items-center border-b border-slate-200 dark:border-slate-800">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <FontAwesome6
              name="chevron-left"
              size={18}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </Pressable>
          <ThemedText className="text-xl font-lexend-medium">
            Notifications
          </ThemedText>
        </View>

        {unreadCount > 0 && (
          <Pressable
            onPress={markAllAsRead}
            className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
          >
            <ThemedText className="text-xs">Mark all as read</ThemedText>
          </Pressable>
        )}
      </View> */}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#eab308" />
          <ThemedText className="mt-4">Loading notifications...</ThemedText>
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <MaterialCommunityIcons
            name="bell-off"
            size={64}
            color={colorScheme === "dark" ? "#64748b" : "#94a3b8"}
          />
          <ThemedText className="text-lg mt-4 text-center">
            You don't have any notifications yet
          </ThemedText>
          <ThemedText className="text-slate-500 text-center mt-2">
            We'll notify you when there are updates on your bookings or special
            offers
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => markAsRead(item.id)}
              className={`p-4 rounded-xl ${
                item.read
                  ? "bg-white dark:bg-slate-800"
                  : "bg-yellow-50 dark:bg-slate-800/60"
              }`}
            >
              <View className="flex-row">
                <View className="mr-3 mt-1">{getTypeIcon(item.type)}</View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <ThemedText className="font-lexend-medium text-base flex-1 mr-2">
                      {item.title}
                    </ThemedText>
                    <ThemedText className="text-xs text-slate-500">
                      {formatDate(item.date)}
                    </ThemedText>
                  </View>
                  <ThemedText className="mt-1 text-slate-600 dark:text-slate-400">
                    {item.message}
                  </ThemedText>
                  {!item.read && (
                    <View className="mt-2 self-start bg-blue-500 w-2 h-2 rounded-full" />
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
