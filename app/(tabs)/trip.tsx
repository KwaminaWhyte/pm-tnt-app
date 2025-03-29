import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useColorScheme,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getMyBookings, openWhatsAppChat } from "@/data/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export default function TripScreen() {
  const { auth, authLoading } = useAuth();
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);

  // Sample trips data - would be fetched from API in a real app
  const sampleTrips = {
    upcoming: [
      {
        id: "up1",
        type: "hotel",
        name: "Labadi Beach Hotel",
        location: "Accra, Ghana",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
        status: "confirmed",
        paymentStatus: "paid",
        bookingNumber: "HTL-2023-5692",
        price: 350,
        guests: 2,
        roomType: "Deluxe Ocean View",
      },
      {
        id: "up2",
        type: "package",
        name: "Kakum National Park Adventure",
        location: "Cape Coast, Ghana",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFmcmljYW4lMjBwYXJrfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        status: "pending",
        paymentStatus: "partial",
        bookingNumber: "PKG-2023-3421",
        price: 220,
        participants: 4,
        packageDetails: "Canopy walkway, hiking, and wildlife safari",
      },
      {
        id: "up3",
        type: "vehicle",
        name: "Toyota Land Cruiser",
        location: "Kumasi, Ghana",
        image:
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG95b3RhJTIwbGFuZCUyMGNydWlzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
        status: "confirmed",
        paymentStatus: "pending",
        bookingNumber: "VEH-2023-7812",
        price: 475,
        vehicleDetails: "4x4, 7 Seater, Automatic",
        licensePlate: "GR-5241-21",
      },
    ],
    past: [
      {
        id: "past1",
        type: "hotel",
        name: "Kempinski Hotel",
        location: "Accra, Ghana",
        image:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
        status: "completed",
        paymentStatus: "paid",
        bookingNumber: "HTL-2023-4502",
        price: 540,
        guests: 2,
        roomType: "Executive Suite",
      },
      {
        id: "past2",
        type: "vehicle",
        name: "Hyundai Tucson",
        location: "Accra, Ghana",
        image:
          "https://images.unsplash.com/photo-1630490067641-969a68cf05d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHl1bmRhaSUyMHR1Y3NvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 32),
        status: "completed",
        paymentStatus: "paid",
        bookingNumber: "VEH-2023-6325",
        price: 280,
        vehicleDetails: "SUV, 5 Seater, Automatic",
        licensePlate: "GE-7834-20",
      },
      {
        id: "past3",
        type: "package",
        name: "Mole National Park Safari",
        location: "Northern Region, Ghana",
        image:
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMHNhZmFyaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 57),
        status: "completed",
        paymentStatus: "paid",
        bookingNumber: "PKG-2023-2198",
        price: 650,
        participants: 2,
        packageDetails:
          "Wildlife safari, guided tours, and premium accommodations",
      },
      {
        id: "past4",
        type: "hotel",
        name: "Royal Senchi Resort",
        location: "Akosombo, Ghana",
        image:
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzb3J0JTIwcG9vbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 87),
        status: "completed",
        paymentStatus: "paid",
        bookingNumber: "HTL-2023-3325",
        price: 420,
        guests: 3,
        roomType: "River View Suite",
      },
    ],
    canceled: [
      {
        id: "can1",
        type: "hotel",
        name: "Elmina Beach Resort",
        location: "Elmina, Ghana",
        image:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJlYWNoJTIwcmVzb3J0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
        status: "canceled",
        paymentStatus: "refunded",
        bookingNumber: "HTL-2023-5284",
        price: 300,
        guests: 2,
        roomType: "Standard Ocean View",
        cancellationReason: "Weather conditions",
      },
      {
        id: "can2",
        type: "package",
        name: "Akosombo Dam Tour",
        location: "Akosombo, Ghana",
        image:
          "https://images.unsplash.com/photo-1657468133236-f50c0cebb28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFtfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 44),
        status: "canceled",
        paymentStatus: "refunded",
        bookingNumber: "PKG-2023-1854",
        price: 120,
        participants: 5,
        packageDetails: "Guided dam tour and boat cruise",
        cancellationReason: "Operational issues at the dam site",
      },
    ],
  };

  useEffect(() => {
    // In a real app, this would be fetching actual data from API
    if (auth?.token) {
      loadTrips();
    }
  }, [auth?.token, activeTab]);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would fetch from API like this:
      // const response = await getMyBookings(activeTab, "", "", auth?.token);
      // setTrips(response.data);

      // Using sample data for now
      setTimeout(() => {
        setTrips(sampleTrips[activeTab as keyof typeof sampleTrips]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading trips:", error);
      setTrips([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (status === "confirmed")
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (status === "pending")
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    if (status === "completed")
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    if (status === "canceled")
      return "bg-red-500/10 text-red-700 dark:text-red-400";
    return "bg-slate-500/10 text-slate-700 dark:text-slate-400";
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    if (paymentStatus === "paid")
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (paymentStatus === "pending")
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    if (paymentStatus === "partial")
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    if (paymentStatus === "refunded")
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    return "bg-slate-500/10 text-slate-700 dark:text-slate-400";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return <MaterialCommunityIcons name="bed" size={20} color="#eab308" />;
      case "vehicle":
        return <MaterialCommunityIcons name="car" size={20} color="#eab308" />;
      case "package":
        return (
          <MaterialCommunityIcons
            name="map-marker-path"
            size={20}
            color="#eab308"
          />
        );
      default:
        return (
          <MaterialCommunityIcons name="ticket" size={20} color="#eab308" />
        );
    }
  };

  const handleSupportChat = (bookingNumber: string) => {
    openWhatsAppChat(
      "+233245678901",
      `Hello, I need support for my booking ${bookingNumber}`
    );
  };

  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#eab308" />
        <ThemedText className="mt-4">Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  if (!auth?.token) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center p-6">
        <Image
          source={
            colorScheme === "dark"
              ? require("@/assets/images/dark-no-globe.png")
              : require("@/assets/images/no-globe.png")
          }
          className="w-40 h-40"
          resizeMode="contain"
        />
        <ThemedText className="text-xl font-lexend-medium text-center mt-6">
          Sign in to view your trips
        </ThemedText>
        <ThemedText className="text-slate-500 text-center mt-2 mb-6">
          Track all your bookings and travel history in one place
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
      {/* Header */}
      <View className="px-4 py-3">
        <ThemedText className="text-2xl font-lexend-bold">My Trips</ThemedText>
        <ThemedText className="text-slate-500 font-lexend-light">
          Manage your travel bookings
        </ThemedText>
      </View>

      {/* Tab Navigation */}
      <View className="px-4 mt-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <Pressable
            onPress={() => setActiveTab("upcoming")}
            className={`mr-4 px-4 py-2 rounded-full ${
              activeTab === "upcoming"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                activeTab === "upcoming"
                  ? "text-white font-lexend-medium"
                  : "font-lexend-light"
              }
            >
              Upcoming
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("past")}
            className={`mr-4 px-4 py-2 rounded-full ${
              activeTab === "past"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                activeTab === "past"
                  ? "text-white font-lexend-medium"
                  : "font-lexend-light"
              }
            >
              Past
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("canceled")}
            className={`mr-4 px-4 py-2 rounded-full ${
              activeTab === "canceled"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                activeTab === "canceled"
                  ? "text-white font-lexend-medium"
                  : "font-lexend-light"
              }
            >
              Canceled
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      {/* Trip List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#eab308" />
          <ThemedText className="mt-4">Loading your trips...</ThemedText>
        </View>
      ) : trips.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <MaterialCommunityIcons
            name={
              activeTab === "upcoming"
                ? "calendar-blank"
                : activeTab === "past"
                ? "calendar-check"
                : "calendar-remove"
            }
            size={64}
            color={colorScheme === "dark" ? "#64748b" : "#94a3b8"}
          />
          <ThemedText className="text-xl font-lexend-medium text-center mt-6">
            No {activeTab} trips
          </ThemedText>
          <ThemedText className="text-slate-500 text-center mt-2">
            {activeTab === "upcoming"
              ? "Start planning your next adventure"
              : activeTab === "past"
              ? "Your completed trips will appear here"
              : "Your canceled bookings will appear here"}
          </ThemedText>
          {activeTab === "upcoming" && (
            <Pressable
              onPress={() => router.push("/book?category=hotels")}
              className="mt-6 bg-yellow-500 px-6 py-3 rounded-xl"
            >
              <ThemedText className="text-white font-lexend-medium">
                Browse Hotels
              </ThemedText>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-4" />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                // Navigate to booking details
                // router.push(`/booking-details?id=${item.id}`);
              }}
              className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Image Header */}
              <Image
                source={{ uri: item.image }}
                className="w-full h-48"
                resizeMode="cover"
              />

              {/* Content */}
              <View className="p-4">
                {/* Title and Location */}
                <View className="flex-row items-center mb-1">
                  {getTypeIcon(item.type)}
                  <ThemedText className="ml-2 text-sm text-slate-500">
                    {item.type === "hotel"
                      ? "Hotel"
                      : item.type === "vehicle"
                      ? "Vehicle"
                      : "Package"}
                  </ThemedText>
                </View>
                <ThemedText className="text-lg font-lexend-medium mb-1">
                  {item.name}
                </ThemedText>
                <View className="flex-row items-center mb-3">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={16}
                    color="#64748b"
                  />
                  <ThemedText className="ml-1 text-sm text-slate-500">
                    {item.location}
                  </ThemedText>
                </View>

                {/* Dates */}
                <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <View>
                    <ThemedText className="text-sm text-slate-500 mb-1">
                      From
                    </ThemedText>
                    <ThemedText className="font-lexend-medium">
                      {formatDate(item.startDate)}
                    </ThemedText>
                  </View>
                  <View className="items-center">
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={20}
                      color="#64748b"
                    />
                  </View>
                  <View>
                    <ThemedText className="text-sm text-slate-500 mb-1">
                      To
                    </ThemedText>
                    <ThemedText className="font-lexend-medium">
                      {formatDate(item.endDate)}
                    </ThemedText>
                  </View>
                </View>

                {/* Details by Type */}
                <View className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  {item.type === "hotel" && (
                    <>
                      <View className="flex-row justify-between mb-2">
                        <ThemedText className="text-slate-500">Room</ThemedText>
                        <ThemedText>{item.roomType}</ThemedText>
                      </View>
                      <View className="flex-row justify-between">
                        <ThemedText className="text-slate-500">
                          Guests
                        </ThemedText>
                        <ThemedText>{item.guests}</ThemedText>
                      </View>
                    </>
                  )}

                  {item.type === "vehicle" && (
                    <>
                      <View className="flex-row justify-between mb-2">
                        <ThemedText className="text-slate-500">
                          Vehicle
                        </ThemedText>
                        <ThemedText>{item.vehicleDetails}</ThemedText>
                      </View>
                      <View className="flex-row justify-between">
                        <ThemedText className="text-slate-500">
                          License
                        </ThemedText>
                        <ThemedText>{item.licensePlate}</ThemedText>
                      </View>
                    </>
                  )}

                  {item.type === "package" && (
                    <>
                      <View className="flex-row justify-between mb-2">
                        <ThemedText className="text-slate-500">
                          Package
                        </ThemedText>
                        <ThemedText
                          numberOfLines={1}
                          className="flex-1 text-right"
                        >
                          {item.packageDetails}
                        </ThemedText>
                      </View>
                      <View className="flex-row justify-between">
                        <ThemedText className="text-slate-500">
                          Participants
                        </ThemedText>
                        <ThemedText>{item.participants}</ThemedText>
                      </View>
                    </>
                  )}
                </View>

                {/* Booking Info */}
                <View className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <View className="flex-row justify-between mb-2">
                    <ThemedText className="text-slate-500">
                      Booking #
                    </ThemedText>
                    <ThemedText>{item.bookingNumber}</ThemedText>
                  </View>
                  <View className="flex-row justify-between">
                    <ThemedText className="text-slate-500">
                      Total Price
                    </ThemedText>
                    <ThemedText className="font-lexend-medium text-yellow-500">
                      ${item.price}
                    </ThemedText>
                  </View>
                </View>

                {/* Status and Actions */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row space-x-2">
                    <View
                      className={`px-2 py-1 rounded-full ${
                        getStatusColor(item.status, item.paymentStatus).split(
                          " "
                        )[0]
                      }`}
                    >
                      <ThemedText
                        className={`text-xs ${getStatusColor(
                          item.status,
                          item.paymentStatus
                        )
                          .split(" ")
                          .slice(1)
                          .join(" ")}`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </ThemedText>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${
                        getPaymentStatusColor(item.paymentStatus).split(" ")[0]
                      }`}
                    >
                      <ThemedText
                        className={`text-xs ${getPaymentStatusColor(
                          item.paymentStatus
                        )
                          .split(" ")
                          .slice(1)
                          .join(" ")}`}
                      >
                        {item.paymentStatus.charAt(0).toUpperCase() +
                          item.paymentStatus.slice(1)}
                      </ThemedText>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => handleSupportChat(item.bookingNumber)}
                    className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full"
                  >
                    <MaterialCommunityIcons
                      name="chat-processing"
                      size={20}
                      color="#eab308"
                    />
                  </Pressable>
                </View>

                {/* Cancellation Reason (if applicable) */}
                {item.status === "canceled" && item.cancellationReason && (
                  <View className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <ThemedText className="text-sm text-slate-500">
                      Cancellation reason: {item.cancellationReason}
                    </ThemedText>
                  </View>
                )}
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
