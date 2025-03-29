import {
  View,
  ScrollView,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useGlobalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSWR from "swr";
import { fetcher } from "@/data/fetcher";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import moment from "moment";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL, bookPackage } from "@/data/api";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function PackageDetailsScreen() {
  const { id } = useGlobalSearchParams();
  const { top } = useSafeAreaInsets();
  const { auth } = useAuth();
  const toast = useToast();

  const [isBooking, setIsBooking] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/packages/${id}`,
    fetcher(auth?.token)
  );

  const package_data = data?.data;

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum booking is tomorrow
    return today;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6); // Maximum booking is 6 months ahead
    return maxDate;
  };

  const handleIncrementParticipants = () => {
    if (
      package_data?.maxParticipants &&
      participants >= package_data.maxParticipants
    ) {
      toast.show(
        `Maximum ${package_data.maxParticipants} participants allowed`,
        { type: "warning" }
      );
      return;
    }
    setParticipants((prev) => prev + 1);
  };

  const handleDecrementParticipants = () => {
    if (
      package_data?.minParticipants &&
      participants <= package_data.minParticipants
    ) {
      toast.show(
        `Minimum ${package_data.minParticipants} participants required`,
        { type: "warning" }
      );
      return;
    }
    if (participants > 1) {
      setParticipants((prev) => prev - 1);
    }
  };

  const openBookingModal = () => {
    if (!auth?.token) {
      toast.show("Please sign in to book a package", { type: "warning" });
      router.push("/sign-in");
      return;
    }
    setBookingModalVisible(true);
  };

  const handleBookPackage = async () => {
    if (!selectedDate) {
      toast.show("Please select a date", { type: "warning" });
      return;
    }

    setProcessing(true);
    try {
      const bookingData = {
        packageId: String(id),
        startDate: selectedDate.toISOString(),
        participants,
        specialRequests:
          specialRequests.trim().length > 0 ? specialRequests : undefined,
      };

      const response = await bookPackage(bookingData, auth?.token);

      setBookingModalVisible(false);
      toast.show("Booking successful!", { type: "success" });
      router.push("/trip?category=upcoming");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.show(error.response?.data?.message || "Failed to book package", {
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!package_data) return 0;

    // Apply seasonal pricing if applicable
    let priceMultiplier = 1;
    if (
      selectedDate &&
      package_data.seasonalPricing &&
      package_data.seasonalPricing.length > 0
    ) {
      const applicableSeason = package_data.seasonalPricing.find(
        (season: any) => {
          const startDate = new Date(season.startDate);
          const endDate = new Date(season.endDate);
          return selectedDate >= startDate && selectedDate <= endDate;
        }
      );

      if (applicableSeason) {
        priceMultiplier = applicableSeason.priceMultiplier;
      }
    }

    return (package_data.price * participants * priceMultiplier).toFixed(2);
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#eab308" />
        <ThemedText className="mt-4">Loading package details...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !package_data) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
        <ThemedText className="mt-4 text-lg">
          Failed to load package details
        </ThemedText>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-yellow-500 px-6 py-3 rounded-xl"
        >
          <ThemedText className="text-white font-semibold">Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      style={{ paddingTop: top }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView className="flex-1">
        {/* Header Image with Back Button */}
        <View className="relative h-72 w-full bg-slate-200 dark:bg-slate-800">
          {package_data?.images && package_data.images.length > 0 ? (
            <Image
              source={{ uri: package_data.images[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <MaterialCommunityIcons
                name="image-off"
                size={48}
                color="#94a3b8"
              />
            </View>
          )}
          {/* Back Button */}
          <View className="absolute top-3 left-3">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center flex-row flex bg-white rounded-full"
            >
              <FontAwesome6 name="chevron-left" size={24} color="#eab308" />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <View className="p-4">
          <ThemedText className="text-2xl font-bold mb-2">
            {package_data?.name}
          </ThemedText>

          <ThemedText className="text-slate-600 dark:text-slate-400 mb-4">
            {package_data?.description}
          </ThemedText>

          {/* Duration and Price */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color="#eab308"
              />
              <ThemedText className="ml-2">
                {package_data?.duration?.days} Days,{" "}
                {package_data?.duration?.nights} Nights
              </ThemedText>
            </View>
            <ThemedText className="text-xl font-bold text-yellow-500">
              ${package_data?.price}
            </ThemedText>
          </View>

          {/* Budget Breakdown */}
          {package_data?.budget?.breakdown && (
            <View className="mb-6">
              <ThemedText className="text-lg font-semibold mb-3">
                Budget Breakdown
              </ThemedText>
              <View className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                {Object.entries(package_data.budget.breakdown).map(
                  ([key, value]: [string, any]) => (
                    <View
                      key={key}
                      className="flex-row justify-between items-center mb-2"
                    >
                      <ThemedText className="capitalize">{key}</ThemedText>
                      <ThemedText className="text-yellow-500 font-semibold">
                        ${value}
                      </ThemedText>
                    </View>
                  )
                )}
                <View className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <View className="flex-row justify-between items-center">
                    <ThemedText className="font-semibold">Total</ThemedText>
                    <ThemedText className="text-yellow-500 font-bold">
                      ${package_data.budget.estimatedTotal}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Transportation */}
          {package_data?.transportation?.details &&
            package_data.transportation.details.length > 0 && (
              <View className="mb-6">
                <ThemedText className="text-lg font-semibold mb-3">
                  Transportation
                </ThemedText>
                {package_data.transportation.details.map(
                  (transport: any, index: number) => (
                    <View
                      key={index}
                      className="bg-white dark:bg-slate-900 p-4 rounded-lg mb-2"
                    >
                      <View className="flex-row items-center mb-2">
                        <MaterialCommunityIcons
                          name="car"
                          size={20}
                          color="#eab308"
                        />
                        <ThemedText className="ml-2 font-semibold">
                          {transport.type}
                        </ThemedText>
                      </View>
                      <ThemedText className="text-slate-600 dark:text-slate-400">
                        From: {transport.from}
                      </ThemedText>
                      <ThemedText className="text-slate-600 dark:text-slate-400">
                        To: {transport.to}
                      </ThemedText>
                      <ThemedText className="text-slate-600 dark:text-slate-400">
                        Day: {transport.day}
                      </ThemedText>
                    </View>
                  )
                )}
              </View>
            )}

          {/* Itinerary */}
          <View className="mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Itinerary
            </ThemedText>
            {package_data?.itinerary?.map((day: any) => (
              <View
                key={day._id}
                className="mb-4 bg-white dark:bg-slate-900 p-4 rounded-lg"
              >
                <ThemedText className="font-semibold mb-1">
                  Day {day.day}: {day.title}
                </ThemedText>
                <ThemedText className="text-slate-600 dark:text-slate-400">
                  {day.description}
                </ThemedText>
                <View className="flex-row mt-2">
                  {day.meals.breakfast && (
                    <View className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded mr-2">
                      <ThemedText className="text-xs">Breakfast</ThemedText>
                    </View>
                  )}
                  {day.meals.lunch && (
                    <View className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded mr-2">
                      <ThemedText className="text-xs">Lunch</ThemedText>
                    </View>
                  )}
                  {day.meals.dinner && (
                    <View className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                      <ThemedText className="text-xs">Dinner</ThemedText>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* What's Included */}
          <View className="mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              What's Included
            </ThemedText>
            {package_data?.included?.map((item: string, index: number) => (
              <View key={index} className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#eab308"
                />
                <ThemedText className="ml-2">{item}</ThemedText>
              </View>
            ))}
          </View>

          {/* What's Not Included */}
          <View className="mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              What's Not Included
            </ThemedText>
            {package_data?.excluded?.map((item: string, index: number) => (
              <View key={index} className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color="#ef4444"
                />
                <ThemedText className="ml-2">{item}</ThemedText>
              </View>
            ))}
          </View>

          {/* Terms and Conditions */}
          <View className="mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Terms and Conditions
            </ThemedText>
            {package_data?.terms?.map((term: string, index: number) => (
              <View key={index} className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="information"
                  size={20}
                  color="#0ea5e9"
                />
                <ThemedText className="ml-2">{term}</ThemedText>
              </View>
            ))}
          </View>

          {/* Available Start Dates */}
          {package_data?.startDates && package_data.startDates.length > 0 && (
            <View className="mb-6">
              <ThemedText className="text-lg font-semibold mb-3">
                Available Start Dates
              </ThemedText>
              <View className="flex-row flex-wrap">
                {package_data.startDates.map((date: string, index: number) => (
                  <View
                    key={index}
                    className="bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-lg mr-2 mb-2"
                  >
                    <ThemedText>
                      {moment(date).format("MMM D, YYYY")}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Seasonal Pricing */}
          {package_data?.seasonalPricing &&
            package_data.seasonalPricing.length > 0 && (
              <View className="mb-6">
                <ThemedText className="text-lg font-semibold mb-3">
                  Seasonal Pricing
                </ThemedText>
                {package_data.seasonalPricing.map(
                  (season: any, index: number) => (
                    <View
                      key={index}
                      className="bg-white dark:bg-slate-900 p-4 rounded-lg mb-2"
                    >
                      <View className="flex-row justify-between items-center">
                        <ThemedText>
                          {moment(season.startDate).format("MMM D")} -{" "}
                          {moment(season.endDate).format("MMM D, YYYY")}
                        </ThemedText>
                        <ThemedText className="text-yellow-500 font-semibold">
                          {season.priceMultiplier}x
                        </ThemedText>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}

          {/* Participants */}
          <View className="mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Participants
            </ThemedText>
            <View className="bg-white dark:bg-slate-900 p-4 rounded-lg">
              <View className="flex-row justify-between items-center mb-2">
                <ThemedText>Minimum</ThemedText>
                <ThemedText className="font-semibold">
                  {package_data?.minParticipants}
                </ThemedText>
              </View>
              <View className="flex-row justify-between items-center">
                <ThemedText>Maximum</ThemedText>
                <ThemedText className="font-semibold">
                  {package_data?.maxParticipants}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Pressable
          className="bg-yellow-500 py-4 rounded-lg items-center"
          onPress={openBookingModal}
          disabled={isBooking}
        >
          {isBooking ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText className="font-semibold text-white">
              Book Now
            </ThemedText>
          )}
        </Pressable>
      </View>

      {/* Booking Modal */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-6">
              <ThemedText className="text-xl font-semibold">
                Book Package
              </ThemedText>
              <Pressable onPress={() => setBookingModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#64748b"
                />
              </Pressable>
            </View>

            {/* Package Name */}
            <ThemedText className="text-lg font-bold mb-4">
              {package_data.name}
            </ThemedText>

            {/* Date Selection */}
            <View className="mb-4">
              <ThemedText className="mb-2 font-medium">Start Date</ThemedText>
              <Pressable
                onPress={showDatePicker}
                className="p-3 border border-slate-300 dark:border-slate-700 rounded-lg flex-row justify-between items-center"
              >
                <ThemedText>
                  {selectedDate
                    ? moment(selectedDate).format("MMM D, YYYY")
                    : "Select a date"}
                </ThemedText>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#64748b"
                />
              </Pressable>
            </View>

            {/* Participants Selection */}
            <View className="mb-4">
              <ThemedText className="mb-2 font-medium">
                Number of Participants
              </ThemedText>
              <View className="flex-row items-center">
                <Pressable
                  onPress={handleDecrementParticipants}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg items-center justify-center"
                >
                  <MaterialCommunityIcons
                    name="minus"
                    size={24}
                    color="#64748b"
                  />
                </Pressable>
                <ThemedText className="mx-4 text-lg font-semibold">
                  {participants}
                </ThemedText>
                <Pressable
                  onPress={handleIncrementParticipants}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg items-center justify-center"
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            {/* Special Requests */}
            <View className="mb-6">
              <ThemedText className="mb-2 font-medium">
                Special Requests (optional)
              </ThemedText>
              <TextInput
                multiline
                numberOfLines={3}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="Any special requirements or preferences..."
                placeholderTextColor="#9ca3af"
                className="p-3 border border-slate-300 dark:border-slate-700 text-black dark:text-white rounded-lg"
                style={{ textAlignVertical: "top" }}
              />
            </View>

            {/* Price Summary */}
            <View className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <View className="flex-row justify-between mb-2">
                <ThemedText>Base Price</ThemedText>
                <ThemedText>${package_data.price}</ThemedText>
              </View>
              <View className="flex-row justify-between mb-2">
                <ThemedText>Participants</ThemedText>
                <ThemedText>× {participants}</ThemedText>
              </View>
              {selectedDate &&
                package_data.seasonalPricing &&
                package_data.seasonalPricing.length > 0 &&
                (() => {
                  const applicableSeason = package_data.seasonalPricing.find(
                    (season: any) => {
                      const startDate = new Date(season.startDate);
                      const endDate = new Date(season.endDate);
                      return (
                        selectedDate >= startDate && selectedDate <= endDate
                      );
                    }
                  );

                  if (applicableSeason) {
                    return (
                      <View className="flex-row justify-between mb-2">
                        <ThemedText>Seasonal Price</ThemedText>
                        <ThemedText>
                          × {applicableSeason.priceMultiplier}
                        </ThemedText>
                      </View>
                    );
                  }
                  return null;
                })()}
              <View className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <View className="flex-row justify-between">
                  <ThemedText className="font-semibold">Total</ThemedText>
                  <ThemedText className="font-bold text-yellow-500">
                    ${calculateTotalPrice()}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Book Button */}
            <Pressable
              className="bg-yellow-500 py-4 rounded-lg items-center"
              onPress={handleBookPackage}
              disabled={processing || !selectedDate}
            >
              {processing ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText className="font-semibold text-white">
                  Confirm & Pay ${calculateTotalPrice()}
                </ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={getMinDate()}
        maximumDate={getMaxDate()}
      />
    </ThemedView>
  );
}
