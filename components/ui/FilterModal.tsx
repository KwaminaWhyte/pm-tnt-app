import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { FilterIcon, RotateCcw } from "lucide-react-native";

interface FilterOption {
  label: string;
  value: string;
}

type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "";
type PaymentStatus = "Pending" | "Paid" | "Unpaid" | "";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  bookingStatusOptions: FilterOption[];
  paymentStatusOptions: FilterOption[];
  selectedBookingStatus: BookingStatus;
  selectedPaymentStatus: PaymentStatus;
  onBookingStatusChange: (status: BookingStatus) => void;
  onPaymentStatusChange: (status: PaymentStatus) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export function FilterButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="ml-3 py-2.5 px-3 bg-yellow-500 rounded-xl flex-row items-center justify-center"
    >
      <FilterIcon stroke="#FFF" size={20} strokeWidth={2} />
    </Pressable>
  );
}

export function FilterModal({
  visible,
  onClose,
  bookingStatusOptions,
  paymentStatusOptions,
  selectedBookingStatus,
  selectedPaymentStatus,
  onBookingStatusChange,
  onPaymentStatusChange,
  onApplyFilters,
  onResetFilters,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable onPress={onClose} className="flex-1 bg-black/50">
          <View className="flex-1 justify-end">
            <Pressable onPress={(e) => e.stopPropagation()} className="w-full">
              <View className="w-full bg-white dark:bg-slate-900 rounded-t-3xl p-6">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-lg font-semibold dark:text-white">
                    Filters
                  </Text>
                  <Pressable onPress={onClose}>
                    <Text className="text-gray-500 dark:text-gray-400">
                      Close
                    </Text>
                  </Pressable>
                </View>

                <View className="mb-6">
                  <Text className="text-sm font-medium mb-2 dark:text-white">
                    Booking Status
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {bookingStatusOptions.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => onBookingStatusChange(option.value as BookingStatus)}
                        className={`py-2.5 px-4 rounded-xl border ${
                          selectedBookingStatus === option.value
                            ? "bg-yellow-500/30 border-yellow-500"
                            : "bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700"
                        }`}
                      >
                        <Text
                          className={`${
                            selectedBookingStatus === option.value
                              ? "text-yellow-700 dark:text-yellow-300 font-medium"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-sm font-medium mb-2 dark:text-white">
                    Payment Status
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {paymentStatusOptions.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => onPaymentStatusChange(option.value as PaymentStatus)}
                        className={`py-2.5 px-4 rounded-xl border ${
                          selectedPaymentStatus === option.value
                            ? "bg-yellow-500/30 border-yellow-500"
                            : "bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700"
                        }`}
                      >
                        <Text
                          className={`${
                            selectedPaymentStatus === option.value
                              ? "text-yellow-700 dark:text-yellow-300 font-medium"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="flex-row justify-end">
                  <Pressable
                    onPress={onResetFilters}
                    className="py-3.5 px-6 flex-row items-center gap-2 border border-gray-200 dark:border-slate-700 rounded-xl"
                  >
                    <RotateCcw
                      size={18}
                      className="text-gray-600 dark:text-gray-300"
                    />
                    <Text className="text-center text-gray-600 dark:text-gray-300 font-medium">
                      Reset Filters
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
