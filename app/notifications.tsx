import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { router, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/data/api";
import { useToast } from "react-native-toast-notifications";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function Notifications() {
  const { auth } = useAuth();
  const colorScheme = useColorScheme();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (auth?.token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setIsLoading(false);
    }
  }, [auth?.token]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await getMyNotifications(auth?.token);

      if (response.data?.data) {
        setNotifications(response.data.data);
      } else {
        // If API isn't implemented yet, use sample data
        setNotifications(getSampleNotifications());
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // If API fails, use sample data as fallback
      setNotifications(getSampleNotifications());
      toast.show("Failed to fetch notifications", { type: "error" });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Sample data function for fallback if API isn't implemented
  const getSampleNotifications = (): Notification[] => {
    return [
      {
        _id: "1",
        type: "booking_confirmed",
        title: "Booking Confirmed",
        message: "Your hotel booking at Sunset Resort has been confirmed.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
      },
      {
        _id: "2",
        type: "payment_success",
        title: "Payment Successful",
        message:
          "Your payment of $245 for the Accra City Tour package was successful.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        read: true,
      },
      {
        _id: "3",
        type: "booking_reminder",
        title: "Trip Tomorrow",
        message:
          "Reminder: Your trip to Cape Coast Castle is scheduled for tomorrow at 9:00 AM.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: false,
      },
      {
        _id: "4",
        type: "special_offer",
        title: "Special Offer",
        message:
          "Limited time offer: 25% off on all beach resort bookings this weekend!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        read: true,
      },
      {
        _id: "5",
        type: "vehicle_ready",
        title: "Vehicle Ready",
        message:
          "Your rental car (Toyota Camry, GR-2453-21) is ready for pickup.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        read: true,
      },
      {
        _id: "6",
        type: "booking_canceled",
        title: "Booking Canceled",
        message:
          "Your booking for Elmina Beach Resort has been canceled as requested.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        read: true,
      },
      {
        _id: "7",
        type: "welcome",
        title: "Welcome to TNT Travel",
        message:
          "Thank you for choosing TNT Travel. Explore our services and find your next adventure!",
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 10
        ).toISOString(),
        read: true,
      },
    ];
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id, auth?.token);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);

      // Optimistic UI update even if the API fails
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(auth?.token);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
      toast.show("All notifications marked as read", { type: "success" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);

      // Optimistic UI update even if the API fails
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!auth?.token) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center p-6">
        <MaterialCommunityIcons
          name="bell-off"
          size={64}
          color={colorScheme === "dark" ? "#64748b" : "#94a3b8"}
        />
        <ThemedText className="text-xl font-lexend-medium text-center mt-6">
          Sign in to view notifications
        </ThemedText>
        <ThemedText className="text-slate-500 text-center mt-2 mb-6">
          Stay updated with booking confirmations and special offers
        </ThemedText>
        <Pressable
          onPress={() => router.push("/sign-in")}
          className="bg-yellow-500 w-full py-3 rounded-xl items-center"
        >
          <ThemedText className="text-white font-lexend-medium">
            Sign In
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <Stack.Screen
        options={{
          title: "Notifications",
          headerRight: () =>
            unreadCount > 0 ? (
              <Pressable
                onPress={handleMarkAllAsRead}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full mr-4"
              >
                <ThemedText className="text-xs">Mark all as read</ThemedText>
              </Pressable>
            ) : null,
        }}
      />

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
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleMarkAsRead(item._id)}
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
                      {formatDate(item.createdAt)}
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
