import { ErrorScreen } from "@/components/screens/error";
import { WishlistsSkeleton } from "@/components/skeletons/wishlists";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/data/fetcher";
import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import useSWR from "swr";
import { CustomTabs } from "@/components/ui/CustomTabs";
import { FilterButton, FilterModal } from "@/components/ui/FilterModal";

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
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType>("hotel");
  const [selectedBookingStatus, setSelectedBookingStatus] =
    useState<BookingStatus>("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus>("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    `${baseUrl}/bookings/my-bookings?bookingType=${selectedBookingType}&status=${selectedBookingStatus}&paymentStatus=${selectedPaymentStatus}`,
    fetcher(auth?.token)
  );

  if (data) console.log(JSON.stringify(data, null, 2));

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

  return (
    <View className="flex-1 p-4 px-3">
      <View className="flex-row items-center space-x-8 mb-4">
        <View className="flex-1">
          <CustomTabs
            tabs={bookingTabs}
            selectedTab={selectedBookingType}
            onTabChange={(tab) => setSelectedBookingType(tab as BookingType)}
          />
        </View>
        <FilterButton onPress={() => setIsFilterModalVisible(true)} />
      </View>

      {isLoading && <WishlistsSkeleton />}
      {error && <ErrorScreen />}
      {data && data?.data?.bookings.length > 0 && (
        <FlatList
          data={data?.data?.bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable className="flex-row mb-2 bg-white dark:bg-slate-900 p-4 rounded-2xl">
              <Text className="dark:text-white">{item.bookingReference}</Text>
            </Pressable>
          )}
        />
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        bookingStatusOptions={bookingStatusOptions}
        paymentStatusOptions={paymentStatusOptions}
        selectedBookingStatus={selectedBookingStatus}
        selectedPaymentStatus={selectedPaymentStatus}
        onBookingStatusChange={(status) =>
          setSelectedBookingStatus(status as BookingStatus)
        }
        onPaymentStatusChange={(status) =>
          setSelectedPaymentStatus(status as PaymentStatus)
        }
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </View>
  );
}
