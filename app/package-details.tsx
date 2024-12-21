import { View, ScrollView, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useGlobalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSWR from "swr";
import { fetcher } from "@/data/fetcher";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import moment from "moment";

export default function PackageDetailsScreen() {
  const { id } = useGlobalSearchParams();
  const { top } = useSafeAreaInsets();
  const baseUrl = process.env.PM_TNT_API_BASE_URL;

  const { data, isLoading } = useSWR(`${baseUrl}/packages/${id}`, fetcher());

  const package_data = data?.data;

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
        <Pressable className="bg-yellow-500 py-4 rounded-lg items-center">
          <ThemedText className="font-semibold">Book Now</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}
