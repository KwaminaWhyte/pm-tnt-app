import { ErrorScreen } from "@/components/screens/error";
import { WishlistsSkeleton } from "@/components/skeletons/wishlists";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/data/fetcher";
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ScrollView,
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
} from "lucide-react-native";
import { CustomBottomSheet } from "@/components/ui/bottom-sheet";
import { useColorScheme } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Href, router } from "expo-router";

type BookingType = "hotel" | "vehicle" | "package";
type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "";
type PaymentStatus = "Pending" | "Paid" | "Unpaid" | "";

const bookingTabs = [
  { id: "hotel", label: "Hotels", icon: "hotel" },
  { id: "vehicle", label: "Vehicles", icon: "vehicle" },
  { id: "package", label: "Packages", icon: "package" },
] as const;

const bookingStatusOptions = [
  { label: "All", value: "" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Pending", value: "Pending" },
  { label: "Cancelled", value: "Cancelled" },
];

const paymentStatusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Unpaid", value: "Unpaid" },
];

export default function Bookings() {
  const { auth } = useAuth();
  const baseUrl =
    "http://i48g4kck48ksow4ssowws4go.138.68.103.18.sslip.io/api/v1";

  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType>("hotel");
  const [selectedBookingStatus, setSelectedBookingStatus] =
    useState<BookingStatus>("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus>("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const colorScheme = useColorScheme();

  const { data, error, isLoading, mutate } = useSWR(
    `${baseUrl}/bookings/my-bookings?bookingType=${selectedBookingType}&status=${selectedBookingStatus}&paymentStatus=${selectedPaymentStatus}`,
    fetcher(auth?.token)
  );

  const handleApplyFilters = () => {
    setIsFilterModalVisible(false);
    mutate();
  };

  const handleResetFilters = () => {
    setSelectedBookingStatus("");
    setSelectedPaymentStatus("");
    setIsFilterModalVisible(false);
    mutate();
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
          <Text className="font-medium">Browse {selectedBookingType}s</Text>
        </Pressable>
      </View>
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
              onTabChange={(tab) => setSelectedBookingType(tab as BookingType)}
            />
          </View>
          <FilterButton onPress={() => setIsFilterModalVisible(true)} />
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <ScrollView className="flex-1 px-4">
          <WishlistsSkeleton />
        </ScrollView>
      )}

      {/* Error State */}
      {error && <ErrorScreen />}

      {/* Hotel Bookings List */}
      {data && selectedBookingType === "hotel" && (
        <>
          {data?.data?.bookings?.length > 0 ? (
            <FlatList
              data={data?.data?.bookings}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              className="flex-1"
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row mb-2 bg-white dark:bg-slate-900 p-2 rounded-2xl"
                  onPress={() => {
                    setSelectedBooking(item);
                    setIsBottomSheetOpen(true);
                  }}
                >
                  <Image
                    source={{ uri: item.hotelBooking.hotelId.images[0] }}
                    className="w-24 h-full rounded-xl"
                    resizeMode="cover"
                  />

                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-semibold text-base dark:text-white">
                        {item.hotelBooking.hotelId.name}
                      </Text>
                      {/* <View
                        className={`px-2 py-1 rounded-full ${
                          item.status === "Confirmed"
                            ? "bg-green-100"
                            : item.status === "Pending"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs ${
                            item.status === "Confirmed"
                              ? "text-green-800"
                              : item.status === "Pending"
                              ? "text-yellow-800"
                              : "text-red-800"
                          }`}
                        >
                          {item.status}
                        </Text>
                      </View> */}
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

                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500">
                        #{item.bookingReference}
                      </Text>
                      <Text className="font-semibold text-base dark:text-white">
                        $ {item.pricing.totalPrice.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          ) : (
            renderNoDataState()
          )}
        </>
      )}

      {/* Vehicle Bookings List */}
      {data && selectedBookingType === "vehicle" && (
        <>
          {data?.data?.bookings?.length > 0 ? (
            <FlatList
              data={data?.data?.bookings}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              className="flex-1"
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row mb-2 bg-white dark:bg-slate-900 p-2 rounded-2xl"
                  onPress={() => {
                    setSelectedBooking(item);
                    setIsBottomSheetOpen(true);
                  }}
                >
                  <Image
                    source={{ uri: item.vehicleBooking.vehicleId.images[0] }}
                    className="w-24 h-full rounded-xl"
                    resizeMode="cover"
                  />

                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-semibold text-lg dark:text-white">
                        {item.vehicleBooking.vehicleId.name}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${
                          item.status === "Confirmed"
                            ? "bg-green-100"
                            : item.status === "Pending"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs ${
                            item.status === "Confirmed"
                              ? "text-green-800"
                              : item.status === "Pending"
                              ? "text-yellow-800"
                              : "text-red-800"
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

                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500">
                        #{item.bookingReference}
                      </Text>
                      <Text className="font-semibold text-base dark:text-white">
                        $ {item.pricing.totalPrice.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          ) : (
            renderNoDataState()
          )}
        </>
      )}

      {/* Package Bookings List */}
      {data && selectedBookingType === "package" && (
        <>
          {data?.data?.bookings?.length > 0 ? (
            <FlatList
              data={data?.data?.bookings}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              className="flex-1"
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row mb-2 bg-white dark:bg-slate-900 p-2 rounded-2xl"
                  onPress={() => {
                    setSelectedBooking(item);
                    setIsBottomSheetOpen(true);
                  }}
                >
                  <Image
                    source={{ uri: item.packageBooking.packageId.images[0] }}
                    className="w-24 h-full rounded-xl"
                    resizeMode="cover"
                  />

                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-semibold text-lg dark:text-white">
                        {item.packageBooking.packageId.name}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${
                          item.status === "Confirmed"
                            ? "bg-green-100"
                            : item.status === "Pending"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs ${
                            item.status === "Confirmed"
                              ? "text-green-800"
                              : item.status === "Pending"
                              ? "text-yellow-800"
                              : "text-red-800"
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

                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-gray-500">
                        #{item.bookingReference}
                      </Text>
                      <Text className="font-semibold text-base dark:text-white">
                        $ {item.pricing.totalPrice.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
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
        selectedBookingStatus={selectedBookingStatus}
        selectedPaymentStatus={selectedPaymentStatus}
        onBookingStatusChange={setSelectedBookingStatus}
        onPaymentStatusChange={setSelectedPaymentStatus}
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
            {/* Header Image */}
            {/* <Image
              source={{ uri: selectedBooking.hotelBooking.hotelId.images[0] }}
              className="w-full h-48 rounded-xl mb-4"
              resizeMode="cover"
            /> */}

            {/* Hotel Name and Status */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold dark:text-white mb-1">
                  {selectedBooking.hotelBooking.hotelId.name}
                </Text>
                <View className="flex-row items-center">
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
              </View>
              <View
                className={`px-3 py-2 rounded-full ${
                  selectedBooking.status === "Confirmed"
                    ? "bg-green-100"
                    : selectedBooking.status === "Pending"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedBooking.status === "Confirmed"
                      ? "text-green-800"
                      : selectedBooking.status === "Pending"
                      ? "text-yellow-800"
                      : "text-red-800"
                  }`}
                >
                  {selectedBooking.status}
                </Text>
              </View>
            </View>

            {/* Booking Details */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <Text className="text-lg font-semibold dark:text-white mb-3">
                Booking Details
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Calendar
                    size={18}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <View className="ml-3">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      Check-in - Check-out
                    </Text>
                    <Text className="text-base font-medium dark:text-white">
                      {new Date(selectedBooking.startDate).toLocaleDateString()}{" "}
                      - {new Date(selectedBooking.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

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
                      {selectedBooking.payment.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <Text className="text-lg font-semibold dark:text-white mb-3">
                Contact Information
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Phone
                    size={18}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <Text className="ml-3 dark:text-white">
                    {selectedBooking.hotelBooking.hotelId.contactInfo.phone}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Mail
                    size={18}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <Text className="ml-3 dark:text-white">
                    {selectedBooking.hotelBooking.hotelId.contactInfo.email}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Globe
                    size={18}
                    color={colorScheme === "dark" ? "#fff" : "#6B7280"}
                  />
                  <Text className="ml-3 dark:text-white">
                    {selectedBooking.hotelBooking.hotelId.contactInfo.website}
                  </Text>
                </View>
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
                    ${selectedBooking.pricing.basePrice}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-300">
                    Taxes
                  </Text>
                  <Text className="dark:text-white">
                    ${selectedBooking.pricing.taxes}
                  </Text>
                </View>
                <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-2" />
                <View className="flex-row justify-between">
                  <Text className="font-semibold dark:text-white">Total</Text>
                  <Text className="font-semibold dark:text-white">
                    ${selectedBooking.pricing.totalPrice}
                  </Text>
                </View>
              </View>
            </View>

            {/* Booking Reference */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8">
              <Text className="text-lg font-semibold dark:text-white mb-1">
                Booking Reference
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                #{selectedBooking.bookingReference}
              </Text>
            </View>
          </ScrollView>
        )}
      </CustomBottomSheet>
    </View>
  );
}
