import { ErrorScreen } from "@/components/screens/error";
import { WishlistsSkeleton } from "@/components/skeletons/wishlists";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/data/fetcher";
import { BASE_URL, getMyBookings, openWhatsAppChat } from "@/data/api";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import useSWR from "swr";
import { CustomTabs } from "@/components/ui/CustomTabs";
import { FilterButton, FilterModal } from "@/components/ui/FilterModal";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  CreditCard,
  Users,
  AlertCircle,
} from "lucide-react-native";
import { CustomBottomSheet } from "@/components/ui/bottom-sheet";
import { useColorScheme } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Href, router } from "expo-router";
import { useToast } from "react-native-toast-notifications";

type BookingType = "hotel" | "vehicle" | "package";
type BookingStatusType =
  | "Draft"
  | "Pending"
  | "Confirmed"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "";
type PaymentStatusType =
  | "Pending"
  | "Paid"
  | "Partially Paid"
  | "Unpaid"
  | "Refunded"
  | "";

// Status filtering by tabs - similar to trip.tsx
type StatusFilter = "upcoming" | "active" | "completed" | "cancelled" | "all";

const bookingTabs = [
  { id: "hotel", label: "Hotels", icon: "hotel" },
  { id: "vehicle", label: "Vehicles", icon: "vehicle" },
  { id: "package", label: "Packages", icon: "package" },
] as const;

const bookingStatusOptions = [
  { label: "All", value: "" },
  { label: "Draft", value: "Draft" },
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "In Progress", value: "InProgress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const paymentStatusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Partially Paid", value: "Partially Paid" },
  { label: "Unpaid", value: "Unpaid" },
  { label: "Refunded", value: "Refunded" },
];

export default function Bookings() {
  const { auth } = useAuth();
  const toast = useToast();
  const colorScheme = useColorScheme();

  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType>("hotel");
  const [selectedBookingStatus, setSelectedBookingStatus] =
    useState<BookingStatusType>("");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<StatusFilter>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatusType>("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Use direct API call instead of SWR
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Map the UI status filter to backend status values
  const getStatusesForFilter = (filter: StatusFilter): string => {
    switch (filter) {
      case "upcoming":
        return "Confirmed,Pending";
      case "active":
        return "InProgress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "all":
      default:
        // If specific booking status is selected, use that instead
        return selectedBookingStatus || "";
    }
  };

  const loadBookings = useCallback(async () => {
    if (!auth?.token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the correct statuses for the API call
      const statusParam = getStatusesForFilter(selectedStatusFilter);

      // Make API call with current filters
      const response = await getMyBookings(
        statusParam,
        undefined,
        undefined,
        auth.token,
        selectedBookingType
      );

      if (response?.data?.data?.bookings) {
        let filteredBookings = response.data.data.bookings;

        // Apply payment status filter if selected
        if (selectedPaymentStatus) {
          filteredBookings = filteredBookings.filter(
            (booking: any) => booking.payment?.status === selectedPaymentStatus
          );
        }

        setBookings(filteredBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError(err as Error);
      toast.show("Failed to load bookings", { type: "error" });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [
    auth?.token,
    selectedBookingType,
    selectedStatusFilter,
    selectedBookingStatus,
    selectedPaymentStatus,
  ]);

  // Load bookings when component mounts or when important filters change
  useEffect(() => {
    if (auth?.token) {
      loadBookings();
    }
  }, [auth?.token, selectedBookingType, selectedStatusFilter]);

  // Only reload when payment status changes if we're using custom filters
  useEffect(() => {
    if (
      auth?.token &&
      selectedPaymentStatus &&
      selectedStatusFilter === "all"
    ) {
      loadBookings();
    }
  }, [auth?.token, selectedPaymentStatus, selectedStatusFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, [loadBookings]);

  const handleBookingTypeChange = (type: BookingType) => {
    setSelectedBookingType(type);
    // Reset other filters when changing booking type for a cleaner experience
    setSelectedStatusFilter("all");
    setSelectedBookingStatus("");
    setSelectedPaymentStatus("");
  };

  const handleApplyFilters = () => {
    setIsFilterModalVisible(false);
    // When applying custom filters, set status filter to "all" so we use the selectedBookingStatus
    setSelectedStatusFilter("all");
    loadBookings();
  };

  const handleResetFilters = () => {
    setSelectedBookingStatus("");
    setSelectedPaymentStatus("");
    setSelectedStatusFilter("all");
    setIsFilterModalVisible(false);
    loadBookings();
  };

  const renderNoDataState = () => {
    const illustrations = {
      hotel: require("@/assets/images/illustrations/hotel-booking.png"),
      vehicle: require("@/assets/images/illustrations/journey.png"),
      package: require("@/assets/images/no-globe.png"),
    };

    const messages = {
      hotel: "No hotel bookings yet",
      vehicle: "No vehicle bookings yet",
      package: "No package bookings yet",
    };

    const descriptions = {
      hotel: "Start exploring and book your perfect stay",
      vehicle: "Book a vehicle for your next adventure",
      package: "Discover amazing travel packages",
    };

    return (
      <View className="flex-1 justify-center items-center px-4">
        <Image
          source={illustrations[selectedBookingType]}
          className="w-64 h-48 mb-4"
          resizeMode="contain"
        />
        <ThemedText className="text-xl font-semibold mb-2">
          {messages[selectedBookingType]}
        </ThemedText>
        <ThemedText className="text-gray-500 dark:text-gray-400 text-center mb-6">
          {descriptions[selectedBookingType]}
        </ThemedText>
        <Pressable
          onPress={() => {
            if (selectedBookingType === "hotel") {
              router.push("/book?category=hotels" as Href);
            } else if (selectedBookingType === "vehicle") {
              router.push("/book?category=vehicles" as Href);
            } else {
              router.push("/book?category=packages" as Href);
            }
          }}
          className="bg-yellow-500 py-3 px-6 rounded-xl"
        >
          <Text className="font-medium text-white">
            Browse {selectedBookingType}s
          </Text>
        </Pressable>
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "InProgress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-indigo-100 text-indigo-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderBookingItem = (item: any) => {
    let image = "";
    let name = "";
    let locationText = "";

    if (selectedBookingType === "hotel" && item.hotelBooking?.hotelId) {
      image = item.hotelBooking.hotelId.images?.[0] || "";
      name = item.hotelBooking.hotelId.name || "Hotel Booking";
      locationText =
        item.hotelBooking.hotelId.location?.city || "Not specified";
    } else if (
      selectedBookingType === "vehicle" &&
      item.vehicleBooking?.vehicleId
    ) {
      image = item.vehicleBooking.vehicleId.images?.[0] || "";
      name =
        `${item.vehicleBooking.vehicleId.make || ""} ${
          item.vehicleBooking.vehicleId.model || ""
        }`.trim() || "Vehicle Booking";
      locationText =
        item.vehicleBooking.pickupLocation?.city || "Not specified";
    } else if (
      selectedBookingType === "package" &&
      item.packageBooking?.packageId
    ) {
      image = item.packageBooking.packageId.images?.[0] || "";
      name = item.packageBooking.packageId.name || "Package Booking";
      locationText =
        item.packageBooking.packageId.location?.city || "Not specified";
    }

    // Use a placeholder image if none available
    if (!image) {
      image = "https://via.placeholder.com/150?text=No+Image";
    }

    return (
      <Pressable
        className="flex-row mb-4 bg-white dark:bg-slate-900 p-3 rounded-2xl"
        onPress={() => {
          setSelectedBooking(item);
          setIsBottomSheetOpen(true);
        }}
      >
        <Image
          source={{ uri: image }}
          className="w-24 h-full rounded-xl"
          resizeMode="cover"
        />

        <View className="flex-1 ml-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className="font-semibold text-base dark:text-white"
              numberOfLines={1}
            >
              {name}
            </Text>
            <View
              className={`px-2 py-1 rounded-full ${
                getStatusColor(item.status).split(" ")[0]
              }`}
            >
              <Text
                className={`text-xs ${
                  getStatusColor(item.status).split(" ")[1]
                }`}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-1">
            <Calendar
              size={14}
              color={colorScheme === "dark" ? "#fff" : "black"}
            />
            <Text className="ml-1 text-xs dark:text-white">
              {new Date(item.startDate).toLocaleDateString()} -{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center mb-1">
            <MapPin
              size={14}
              color={colorScheme === "dark" ? "#fff" : "black"}
            />
            <Text className="ml-1 text-xs dark:text-white" numberOfLines={1}>
              {locationText}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-gray-500">
              #{item.bookingReference}
            </Text>
            <Text className="font-semibold text-base dark:text-white">
              $ {item.pricing?.totalPrice?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <View className="px-4 py-2">
        <View className="flex-row items-center space-x-8">
          <View className="flex-1">
            <CustomTabs
              tabs={bookingTabs as any}
              selectedTab={selectedBookingType}
              onTabChange={(tab) => handleBookingTypeChange(tab as BookingType)}
            />
          </View>
          <FilterButton onPress={() => setIsFilterModalVisible(true)} />
        </View>
      </View>

      {/* Status Filter Bar */}
      <View className="px-4 mt-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <Pressable
            onPress={() => setSelectedStatusFilter("all")}
            className={`mr-4 px-4 py-2 rounded-full ${
              selectedStatusFilter === "all"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                selectedStatusFilter === "all"
                  ? "text-white font-medium"
                  : "font-light"
              }
            >
              All
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSelectedStatusFilter("upcoming")}
            className={`mr-4 px-4 py-2 rounded-full ${
              selectedStatusFilter === "upcoming"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                selectedStatusFilter === "upcoming"
                  ? "text-white font-medium"
                  : "font-light"
              }
            >
              Upcoming
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSelectedStatusFilter("active")}
            className={`mr-4 px-4 py-2 rounded-full ${
              selectedStatusFilter === "active"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                selectedStatusFilter === "active"
                  ? "text-white font-medium"
                  : "font-light"
              }
            >
              Active
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSelectedStatusFilter("completed")}
            className={`mr-4 px-4 py-2 rounded-full ${
              selectedStatusFilter === "completed"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                selectedStatusFilter === "completed"
                  ? "text-white font-medium"
                  : "font-light"
              }
            >
              Completed
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSelectedStatusFilter("cancelled")}
            className={`mr-4 px-4 py-2 rounded-full ${
              selectedStatusFilter === "cancelled"
                ? "bg-yellow-500"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <ThemedText
              className={
                selectedStatusFilter === "cancelled"
                  ? "text-white font-medium"
                  : "font-light"
              }
            >
              Cancelled
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EAB308" />
          <ThemedText className="mt-3">Loading bookings...</ThemedText>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View className="flex-1 justify-center items-center p-4">
          <View className="bg-red-100 dark:bg-red-900/30 p-6 rounded-xl items-center max-w-xs">
            <AlertCircle
              size={40}
              color={colorScheme === "dark" ? "#FCA5A5" : "#EF4444"}
            />
            <ThemedText className="text-lg font-semibold mt-4 mb-2 text-center">
              Something went wrong
            </ThemedText>
            <ThemedText className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
              We couldn't load your bookings. Please try again.
            </ThemedText>
            <Pressable
              onPress={onRefresh}
              className="bg-yellow-500 py-2 px-6 rounded-xl"
            >
              <Text className="font-medium text-white">Retry</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Bookings List */}
      {!isLoading && !error && (
        <>
          {bookings.length > 0 ? (
            <FlatList
              data={bookings}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              className="flex-1"
              renderItem={({ item }) => renderBookingItem(item)}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View className="py-8 flex items-center justify-center">
                  <ThemedText>
                    No bookings found with the selected filters.
                  </ThemedText>
                </View>
              }
            />
          ) : (
            renderNoDataState()
          )}
        </>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        bookingStatusOptions={bookingStatusOptions}
        paymentStatusOptions={paymentStatusOptions}
        selectedBookingStatus={
          selectedBookingStatus as "Confirmed" | "Pending" | "Cancelled" | ""
        }
        selectedPaymentStatus={
          selectedPaymentStatus as "Pending" | "Paid" | "Unpaid" | ""
        }
        onBookingStatusChange={(status) =>
          setSelectedBookingStatus(status as BookingStatusType)
        }
        onPaymentStatusChange={(status) =>
          setSelectedPaymentStatus(status as PaymentStatusType)
        }
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Booking Details Bottom Sheet */}
      <CustomBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => {
          setIsBottomSheetOpen(false);
          setSelectedBooking(null);
        }}
        snapPoints={[0.9]}
      >
        {selectedBooking && (
          <ScrollView className="flex-1 px-4">
            {/* Header with booking type and status */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <ThemedText className="text-lg text-gray-500 mb-1">
                  {selectedBookingType.charAt(0).toUpperCase() +
                    selectedBookingType.slice(1)}{" "}
                  Booking
                </ThemedText>

                {selectedBookingType === "hotel" &&
                  selectedBooking.hotelBooking && (
                    <Text className="text-2xl font-bold dark:text-white mb-1">
                      {selectedBooking.hotelBooking.hotelId?.name ||
                        "Hotel Booking"}
                    </Text>
                  )}

                {selectedBookingType === "vehicle" &&
                  selectedBooking.vehicleBooking && (
                    <Text className="text-2xl font-bold dark:text-white mb-1">
                      {`${
                        selectedBooking.vehicleBooking.vehicleId?.make || ""
                      } ${
                        selectedBooking.vehicleBooking.vehicleId?.model || ""
                      }`.trim() || "Vehicle Booking"}
                    </Text>
                  )}

                {selectedBookingType === "package" &&
                  selectedBooking.packageBooking && (
                    <Text className="text-2xl font-bold dark:text-white mb-1">
                      {selectedBooking.packageBooking.packageId?.name ||
                        "Package Booking"}
                    </Text>
                  )}
              </View>

              <View
                className={`px-3 py-2 rounded-full ${
                  getStatusColor(selectedBooking.status).split(" ")[0]
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    getStatusColor(selectedBooking.status).split(" ")[1]
                  }`}
                >
                  {selectedBooking.status}
                </Text>
              </View>
            </View>

            {/* Location if available */}
            {selectedBookingType === "hotel" &&
              selectedBooking.hotelBooking?.hotelId?.location && (
                <View className="flex-row items-center mb-4">
                  <MapPin
                    size={16}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <Text className="ml-1 text-gray-600 dark:text-gray-300">
                    {selectedBooking.hotelBooking.hotelId.location.address},{" "}
                    {selectedBooking.hotelBooking.hotelId.location.city},{" "}
                    {selectedBooking.hotelBooking.hotelId.location.country}
                  </Text>
                </View>
              )}

            {/* Booking Details */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <Text className="text-lg font-semibold dark:text-white mb-3">
                Booking Details
              </Text>

              <View className="space-y-3">
                {/* Dates */}
                <View className="flex-row items-center">
                  <Calendar
                    size={18}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <View className="ml-3">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedBookingType === "vehicle"
                        ? "Pickup - Return"
                        : "Check-in - Check-out"}
                    </Text>
                    <Text className="text-base font-medium dark:text-white">
                      {new Date(selectedBooking.startDate).toLocaleDateString()}{" "}
                      - {new Date(selectedBooking.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Booking Reference */}
                <View className="flex-row items-center">
                  <CreditCard
                    size={18}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <View className="ml-3">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      Booking Reference
                    </Text>
                    <Text className="text-base font-medium dark:text-white">
                      #{selectedBooking.bookingReference}
                    </Text>
                  </View>
                </View>

                {/* Payment Status */}
                <View className="flex-row items-center">
                  <CreditCard
                    size={18}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <View className="ml-3">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      Payment Status
                    </Text>
                    <Text className="text-base font-medium dark:text-white">
                      {selectedBooking.payment?.status || "Unknown"}
                    </Text>
                  </View>
                </View>

                {/* Type-specific details */}
                {selectedBookingType === "hotel" &&
                  selectedBooking.hotelBooking && (
                    <View className="flex-row items-center">
                      <Users
                        size={18}
                        color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                      />
                      <View className="ml-3">
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                          Guests
                        </Text>
                        <Text className="text-base font-medium dark:text-white">
                          {selectedBooking.hotelBooking.numberOfGuests}{" "}
                          {selectedBooking.hotelBooking.numberOfGuests === 1
                            ? "Guest"
                            : "Guests"}
                        </Text>
                      </View>
                    </View>
                  )}
              </View>
            </View>

            {/* Price Breakdown */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <Text className="text-lg font-semibold dark:text-white mb-3">
                Price Breakdown
              </Text>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-300">
                    Base Price
                  </Text>
                  <Text className="dark:text-white">
                    ${selectedBooking.pricing?.basePrice?.toFixed(2) || "0.00"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-300">
                    Taxes
                  </Text>
                  <Text className="dark:text-white">
                    ${selectedBooking.pricing?.taxes?.toFixed(2) || "0.00"}
                  </Text>
                </View>

                {/* Show fees if any */}
                {selectedBooking.pricing?.fees?.length > 0 &&
                  selectedBooking.pricing.fees.map(
                    (fee: any, index: number) => (
                      <View key={index} className="flex-row justify-between">
                        <Text className="text-gray-600 dark:text-gray-300">
                          {fee.name}
                        </Text>
                        <Text className="dark:text-white">
                          ${fee.amount?.toFixed(2) || "0.00"}
                        </Text>
                      </View>
                    )
                  )}

                {/* Show discounts if any */}
                {selectedBooking.pricing?.discounts?.length > 0 &&
                  selectedBooking.pricing.discounts.map(
                    (discount: any, index: number) => (
                      <View key={index} className="flex-row justify-between">
                        <Text className="text-gray-600 dark:text-gray-300">
                          Discount ({discount.type})
                        </Text>
                        <Text className="text-green-600 dark:text-green-400">
                          -${discount.amount?.toFixed(2) || "0.00"}
                        </Text>
                      </View>
                    )
                  )}

                <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-2" />
                <View className="flex-row justify-between">
                  <Text className="font-semibold dark:text-white">Total</Text>
                  <Text className="font-semibold dark:text-white">
                    ${selectedBooking.pricing?.totalPrice?.toFixed(2) || "0.00"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Cancellation information if cancelled */}
            {selectedBooking.status === "Cancelled" &&
              selectedBooking.cancellation && (
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                  <Text className="text-lg font-semibold dark:text-white mb-3">
                    Cancellation Details
                  </Text>

                  <View className="space-y-2">
                    {selectedBooking.cancellation.reason && (
                      <View>
                        <Text className="text-gray-600 dark:text-gray-300">
                          Reason:
                        </Text>
                        <Text className="dark:text-white">
                          {selectedBooking.cancellation.reason}
                        </Text>
                      </View>
                    )}

                    {selectedBooking.cancellation.cancelledAt && (
                      <View>
                        <Text className="text-gray-600 dark:text-gray-300">
                          Cancelled on:
                        </Text>
                        <Text className="dark:text-white">
                          {new Date(
                            selectedBooking.cancellation.cancelledAt
                          ).toLocaleString()}
                        </Text>
                      </View>
                    )}

                    {selectedBooking.cancellation.refundAmount > 0 && (
                      <View>
                        <Text className="text-gray-600 dark:text-gray-300">
                          Refund amount:
                        </Text>
                        <Text className="dark:text-white">
                          $
                          {selectedBooking.cancellation.refundAmount.toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

            {/* Actions buttons */}
            <View className="mb-8 flex-row justify-center space-x-4">
              <Pressable
                onPress={() => {
                  setIsBottomSheetOpen(false);
                  setSelectedBooking(null);
                }}
                className="bg-gray-200 dark:bg-gray-700 px-6 py-3 rounded-xl"
              >
                <Text className="font-medium dark:text-white">Close</Text>
              </Pressable>

              {selectedBooking.status !== "Cancelled" &&
                selectedBooking.status !== "Completed" && (
                  <Pressable
                    onPress={() => {
                      // Contact support or manage booking
                      openWhatsAppChat(
                        "+233245678901",
                        `Hello, I need support for my booking #${selectedBooking.bookingReference}`
                      );
                    }}
                    className="bg-yellow-500 px-6 py-3 rounded-xl"
                  >
                    <Text className="font-medium text-white">
                      Contact Support
                    </Text>
                  </Pressable>
                )}
            </View>
          </ScrollView>
        )}
      </CustomBottomSheet>
    </View>
  );
}
