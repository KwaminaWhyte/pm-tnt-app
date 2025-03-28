import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  View,
  ScrollView,
  Pressable,
  useColorScheme,
  TextInput,
  Image,
  FlatList,
  LogBox,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ReactNode, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/data/fetcher";
import { Href, router, useGlobalSearchParams, usePathname } from "expo-router";
import CustomSkeleton from "@/components/ui/skeleton";
import {
  BedDuotoneIcon,
  CarFilledIcon,
  MapFlagFilled,
} from "@/components/icons/solar";
import { BookingSkeleton } from "@/components/skeletons/bookings";
import { TabItem } from "@/components/ui/tabs";
import { VehicleListingCard } from "@/components/pressable-cards/vehicle";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";

LogBox.ignoreAllLogs();

export default function BookingScreen() {
  const { category } = useGlobalSearchParams();
  const colorScheme = useColorScheme();
  const pathName = usePathname();
  const { top } = useSafeAreaInsets();
  const { auth } = useAuth();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [favLoadingStates, setFavLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (pathName !== "/book") {
      return;
    }
    if (!category) {
      router.navigate(`/book?category=hotels` as Href);
    }
  }, []);

  // Fetch available options based on selected type
  const baseUrl =
    "http://i48g4kck48ksow4ssowws4go.138.68.103.18.sslip.io/api/v1";
  const { data, isLoading } = useSWR(
    category === "packages"
      ? `${baseUrl}/packages?searchTerm=${searchTerm || ""}`
      : category === "vehicles"
      ? `${baseUrl}/vehicles/public?searchTerm=${searchTerm || ""}`
      : `${baseUrl}/hotels/public?searchTerm=${searchTerm || ""}`,
    fetcher()
  );

  useEffect(() => {
    if (data?.data) {
      const itemIds = data.data.map((item: any) => item._id);
      checkFavorites(itemIds);
    }
  }, [data, auth?.token, category]);

  // check if items are in favorites
  const checkFavorites = async (itemIds: string[]) => {
    try {
      if (!auth?.token) return;
      const promises = itemIds.map((id) =>
        axios.get(`${baseUrl}/favorites/check/${category.slice(0, -1)}/${id}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        })
      );
      const responses = await Promise.all(promises);
      const newFavorites = responses.reduce((acc, response, index) => {
        acc[itemIds[index]] = response.data?.isFavorite || false;
        return acc;
      }, {} as { [key: string]: boolean });
      setFavorites(newFavorites);
    } catch (error) {
      console.error(error);
    }
  };

  // handle favorite toggle
  const handleFavoriteToggle = async (itemId: string, e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    if (!auth?.token) {
      alert("Please login to add to favourites!");
      return;
    }
    setFavLoadingStates((prev) => ({ ...prev, [itemId]: true }));
    try {
      await axios.post(
        `${baseUrl}/favorites/${category.slice(0, -1)}/${itemId}`,
        {},
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setFavorites((prev) => {
        const newState = { ...prev, [itemId]: !prev[itemId] };
        return newState;
      });
      toast.show(
        favorites[itemId] ? "Removed from favorites" : "Added to favorites",
        {
          type: "success",
        }
      );
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.show("Failed to update favorites", { type: "error" });
    } finally {
      setFavLoadingStates((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const tabs = [
    {
      path: "hotels",
      endpoint: "hotels",
      label: "Hotels",
      icon: (
        <BedDuotoneIcon
          className={`${
            category === "hotels" ? "text-yellow-500" : "text-slate-500"
          } w-5 h-5`}
        />
      ),
    },
    {
      path: "vehicles",
      endpoint: "vehicles",
      label: "Rides",
      icon: (
        <CarFilledIcon
          className={`${
            category === "vehicles" ? "text-yellow-500" : "text-slate-500"
          } w-5 h-5`}
        />
      ),
    },
    {
      path: "packages",
      endpoint: "packages",
      label: "Packages",
      icon: (
        <MapFlagFilled
          className={`${
            category === "packages" ? "text-yellow-500" : "text-slate-500"
          } w-5 h-5`}
        />
      ),
    },
  ];

  return (
    <ScrollView
      style={{ paddingTop: top }}
      className="flex-1 bg-slate-200/20 dark:bg-slate-900"
    >
      <View className="px-4 py-4">
        <ThemedText className="text-3xl font-lexend-bold mb-2">
          Book Your Next Adventure
        </ThemedText>
        <ThemedText className="font-lexend-light">
          Find and book the perfect option for your journey
        </ThemedText>
      </View>

      {/* Booking Type Selector */}
      <View className="px-4 my-4">
        <View className="border-b border-slate-300/30 dark:border-white/10">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {tabs.map((tab) => (
              <TabItem
                key={tab.path}
                label={tab.label}
                icon={tab.icon}
                path={tab.path}
                isActive={tab.path === category}
                onPress={() =>
                  router.navigate(`/book?category=${tab.path}` as Href)
                }
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Search and Filter Section */}
      <View className="flex-row justify-between items-center px-4 mb-6">
        <View className="flex-1 mr-4 h-12 bg-white dark:bg-slate-800 rounded-xl flex-row items-center px-4">
          <MaterialIcons
            name="search"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={`Search ${
              tabs.find((tab) => tab.path === category)?.label
            }...`}
            placeholderTextColor={
              colorScheme === "dark" ? "#9ca3af" : "#6b7280"
            }
            className="flex-1 ml-2 font-lexend text-black dark:text-white"
          />
        </View>
        <Pressable className="h-12 w-12 bg-yellow-500/50 rounded-xl items-center justify-center">
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="#000"
          />
        </Pressable>
      </View>

      {/* Content Area */}
      <View className="flex-1 px-4 mb-12">
        {isLoading ? (
          <>
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </>
        ) : (
          <View>
            {/* start:: Hotels listing */}
            {category === "hotels" && data?.data?.length > 0 && (
              <FlatList
                data={
                  isLoading
                    ? [{ _id: "1" }, { _id: "2" }, { _id: "3" }, { _id: "4" }]
                    : data?.data
                }
                keyExtractor={(item) => item?._id}
                renderItem={({ item }) =>
                  isLoading ? (
                    <BookingSkeleton />
                  ) : (
                    <Pressable
                      className="mb-6 p-3 py-4 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden w-full relative"
                      onPress={() =>
                        router.push({
                          pathname: "/details",
                          params: item,
                        })
                      }
                    >
                      <View className="relative">
                        <Image
                          source={{ uri: item?.images[0] || "" }}
                          className="w-full h-44 border border-slate-200 dark:border-slate-700 rounded-xl"
                          resizeMode="cover"
                        />
                        {/* Favorite Button */}
                        <Pressable
                          onPress={(e) => handleFavoriteToggle(item._id, e)}
                          className="absolute top-2 right-2 w-10 h-10 bg-white/80 dark:bg-slate-800/80 rounded-full items-center justify-center"
                        >
                          {favLoadingStates[item._id] ? (
                            <ActivityIndicator size="small" color="#eab308" />
                          ) : (
                            <MaterialCommunityIcons
                              name={
                                favorites[item._id] ? "heart" : "heart-outline"
                              }
                              size={20}
                              color={
                                favorites[item._id] ? "#ef4444" : "#64748b"
                              }
                            />
                          )}
                        </Pressable>
                      </View>
                      <View className="">
                        <ThemedText className="text-lg font-lexend-medium mb-2">
                          {item?.name}
                        </ThemedText>
                        <View className="flex-row justify-between items-center">
                          <View className="flex-row items-center">
                            <MaterialIcons
                              name={"location-on"}
                              size={16}
                              color="#6b7280"
                            />
                            <ThemedText className="ml-1 text-sm text-slate-500">
                              {item?.location?.city +
                                ", " +
                                item?.location?.country}
                            </ThemedText>
                          </View>
                          <ThemedText className="font-lexend-medium text-yellow-500">
                            {item?.price}
                          </ThemedText>
                        </View>
                      </View>
                    </Pressable>
                  )
                }
              />
            )}
            {/* end:: Hotels listing */}

            {/* start:: Vehicles listing */}
            {category === "vehicles" && data?.data?.length > 0 && (
              <FlatList
                data={
                  isLoading
                    ? [{ _id: "1" }, { _id: "2" }, { _id: "3" }, { _id: "4" }]
                    : data?.data
                }
                keyExtractor={(item) => item?._id}
                renderItem={({ item }) =>
                  isLoading ? (
                    <BookingSkeleton />
                  ) : (
                    <View className="relative">
                      <Pressable
                        onPress={() =>
                          router.push(
                            `/vehicle-details?vehicle=${JSON.stringify(
                              item
                            )}` as Href
                          )
                        }
                        className="mb-6 p-3 py-4 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden w-full"
                      >
                        <View className="relative">
                          {item.images && item.images.length > 0 ? (
                            <Image
                              source={{ uri: item.images[0] }}
                              className="w-full h-44 border border-slate-200 dark:border-slate-700 rounded-xl"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="w-full h-44 border border-slate-200 dark:border-slate-700 rounded-xl items-center justify-center bg-slate-100 dark:bg-slate-800">
                              <MaterialCommunityIcons
                                name="car"
                                size={48}
                                color="#94a3b8"
                              />
                            </View>
                          )}
                          {/* Favorite Button */}
                          <Pressable
                            onPress={(e) => handleFavoriteToggle(item._id, e)}
                            className="absolute top-2 right-2 w-10 h-10 bg-white/80 dark:bg-slate-800/80 rounded-full items-center justify-center"
                          >
                            {favLoadingStates[item._id] ? (
                              <ActivityIndicator size="small" color="#eab308" />
                            ) : (
                              <MaterialCommunityIcons
                                name={
                                  favorites[item._id]
                                    ? "heart"
                                    : "heart-outline"
                                }
                                size={20}
                                color={
                                  favorites[item._id] ? "#ef4444" : "#64748b"
                                }
                              />
                            )}
                          </Pressable>
                        </View>

                        <View className="mt-3">
                          <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                              <ThemedText className="text-lg font-lexend-medium">
                                {item.make} {item.model}
                              </ThemedText>
                              <ThemedText className="text-sm text-slate-500">
                                {item.year} • {item.vehicleType}
                              </ThemedText>
                            </View>
                            <View className="items-end">
                              <ThemedText className="text-lg font-lexend-medium text-yellow-500">
                                ${item.pricePerDay}
                              </ThemedText>
                              <ThemedText className="text-sm text-slate-500">
                                per day
                              </ThemedText>
                            </View>
                          </View>

                          {/* Location */}
                          <View className="flex-row items-center mt-2">
                            <MaterialIcons
                              name="location-on"
                              size={16}
                              color="#6b7280"
                            />
                            <ThemedText className="ml-1 text-sm text-slate-500">
                              {item.availability?.location?.city},{" "}
                              {item.availability?.location?.country}
                            </ThemedText>
                          </View>

                          {/* Features */}
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mt-3 -mx-1"
                          >
                            {/* Availability Status */}
                            <View
                              className={`px-3 py-1 rounded-full mx-1 ${
                                item.availability?.isAvailable
                                  ? "bg-green-100 dark:bg-green-900/30"
                                  : "bg-red-100 dark:bg-red-900/30"
                              }`}
                            >
                              <ThemedText
                                className={`text-sm ${
                                  item.availability?.isAvailable
                                    ? "text-green-700 dark:text-green-400"
                                    : "text-red-700 dark:text-red-400"
                                }`}
                              >
                                <MaterialCommunityIcons
                                  name={
                                    item.availability?.isAvailable
                                      ? "check-circle"
                                      : "close-circle"
                                  }
                                  size={14}
                                />{" "}
                                {item.availability?.isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </ThemedText>
                            </View>

                            {/* Capacity */}
                            <View className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mx-1">
                              <ThemedText className="text-sm">
                                <MaterialCommunityIcons
                                  name="account-group"
                                  size={14}
                                />{" "}
                                {item.capacity} seats
                              </ThemedText>
                            </View>

                            {/* Transmission */}
                            {item.details?.transmission && (
                              <View className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mx-1">
                                <ThemedText className="text-sm">
                                  <MaterialCommunityIcons
                                    name="car-shift-pattern"
                                    size={14}
                                  />{" "}
                                  {item.details.transmission}
                                </ThemedText>
                              </View>
                            )}

                            {/* Fuel Type */}
                            {item.details?.fuelType && (
                              <View className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mx-1">
                                <ThemedText className="text-sm">
                                  <MaterialCommunityIcons
                                    name="gas-station"
                                    size={14}
                                  />{" "}
                                  {item.details.fuelType}
                                </ThemedText>
                              </View>
                            )}

                            {/* Features */}
                            {item.features &&
                              item.features.map(
                                (feature: any, index: number) => (
                                  <View
                                    key={index}
                                    className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mx-1"
                                  >
                                    <ThemedText className="text-sm">
                                      {feature}
                                    </ThemedText>
                                  </View>
                                )
                              )}
                          </ScrollView>
                        </View>
                      </Pressable>
                    </View>
                  )
                }
              />
            )}

            {/* start:: Packages listing */}
            {category === "packages" && (
              <View>
                {isLoading ? (
                  <View className="">
                    {[1, 2].map((item) => (
                      <View
                        key={item}
                        className="mb-6 p-2 bg-white dark:bg-slate-900 rounded-3xl border-[2px] border-slate-200 dark:border-slate-700"
                      >
                        <View className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                        <View className="p-3 pb-2">
                          <View className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 mb-2 animate-pulse" />
                          <View className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-full mb-2 animate-pulse" />
                          <View className="flex-row justify-between items-center">
                            <View className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/3 animate-pulse" />
                            <View className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/4 animate-pulse" />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="">
                    {data?.data?.map((item: any) => (
                      <Pressable
                        key={item._id}
                        onPress={() =>
                          router.push(`/package-details?id=${item._id}` as Href)
                        }
                        className="mb-6 p-2 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border-[2px] border-slate-200 dark:border-slate-700"
                      >
                        <View className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl">
                          {item.images && item.images.length > 0 ? (
                            <Image
                              source={{ uri: item.images[0] }}
                              className="w-full h-full rounded-2xl"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="w-full h-full items-center justify-center rounded-2xl">
                              <MaterialCommunityIcons
                                name="image-off"
                                size={48}
                                color="#94a3b8"
                              />
                            </View>
                          )}
                          {/* Favorite Button */}
                          <Pressable
                            onPress={(e) => handleFavoriteToggle(item._id, e)}
                            className="absolute top-2 right-2 w-10 h-10 bg-white/80 dark:bg-slate-800/80 rounded-full items-center justify-center"
                          >
                            {favLoadingStates[item._id] ? (
                              <ActivityIndicator size="small" color="#eab308" />
                            ) : (
                              <MaterialCommunityIcons
                                name={
                                  favorites[item._id]
                                    ? "heart"
                                    : "heart-outline"
                                }
                                size={20}
                                color={
                                  favorites[item._id] ? "#ef4444" : "#64748b"
                                }
                              />
                            )}
                          </Pressable>
                        </View>
                        <View className="p-3 pb-2">
                          <ThemedText className="text-lg font-semibold mb-1">
                            {item.name}
                          </ThemedText>
                          <ThemedText
                            className="text-slate-600 dark:text-slate-400 text-sm mb-2"
                            numberOfLines={2}
                          >
                            {item.description}
                          </ThemedText>
                          <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                              <MaterialCommunityIcons
                                name="clock-outline"
                                size={20}
                                color="#eab308"
                              />
                              <ThemedText className="ml-1 text-sm">
                                {item.duration?.days}D/{item.duration?.nights}N
                              </ThemedText>
                            </View>
                            <ThemedText className="font-bold text-yellow-500">
                              ${item.price}
                            </ThemedText>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}
            {/* end:: Packages listing */}

            {/* start:: Loading skeleton */}
            {!isLoading && data?.data?.length === 0 && (
              <View className="items-center mb-4">
                {colorScheme === "dark" ? (
                  <Image
                    source={require("@/assets/images/dark-no-globe.png")}
                    className="w-1/2 h-36"
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/no-globe.png")}
                    className="w-1/2 h-36"
                  />
                )}
                <View className="items-center">
                  <Text className="text-slate-600 dark:text-slate-400 font-light text-base">
                    No {category} found yet...
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-500 font-light text-sm mt-1">
                    Try adjusting your search
                  </Text>
                </View>
              </View>
            )}
            {/* end:: Loading skeleton */}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
