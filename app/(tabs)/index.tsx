import ParallaxScrollView from "@/components/ParallaxScrollView";
import { BenefitsCard, TripPackageCard } from "@/components/ui/cards";
import { benefits } from "@/data/constant-data";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
} from "react-native";
import logo from "@/assets/images/image.png";
import { Href, router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import useSWR from "swr";
import { fetcher } from "@/data/fetcher";
import { DestinationCardSkeleton } from "@/components/skeletons/destinations";
import HeroCarousel from "@/components/ui/hero-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { auth } = useAuth();
  const [favLoadingStates, setFavLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  // fetch destinations
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { isLoading, data, error } = useSWR(`${baseUrl}/packages`, fetcher());
  const packagesAPI = useSWR(`${baseUrl}/packages`, fetcher());

  const { top } = useSafeAreaInsets();

  // if (data) console.log(JSON.stringify(data, null, 2));

  // check if packages are in favorites
  const checkFavorites = async (packageIds: string[]) => {
    try {
      if (!auth?.token) return;
      const promises = packageIds.map((id) =>
        axios.get(`${baseUrl}/favorites/check/package/${id}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        })
      );
      const responses = await Promise.all(promises);
      const newFavorites = responses.reduce((acc, response, index) => {
        acc[packageIds[index]] = response.data?.isFavorite;
        return acc;
      }, {} as { [key: string]: boolean });
      setFavorites(newFavorites);
    } catch (error) {
      console.error(error);
    }
  };

  // handle favorite toggle
  const handleFavoriteToggle = async (packageId: string) => {
    if (!auth?.token) {
      alert("Please login to manage favourites!");
      return;
    }
    setFavLoadingStates((prev) => ({ ...prev, [packageId]: true }));
    try {
      await axios.post(
        `${baseUrl}/favorites/package/${packageId}`,
        {},
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setFavorites((prev) => ({ ...prev, [packageId]: !prev[packageId] }));
    } catch (error) {
      console.error(error);
    } finally {
      setFavLoadingStates((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  useEffect(() => {
    if (data?.data) {
      const packageIds = data.data.map((item: any) => item._id);
      checkFavorites(packageIds);
    }
  }, [data, auth?.token]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={100}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ paddingTop: top }}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ dark: "#0f172a", light: "#f1f5f9" }}
        header={
          <ThemedView className="w-full bg-slate-100 dark:bg-slate-900 flex-1">
            <View className="flex-row justify-between h-16 items-center pr-4">
              <Image source={logo} className="h-24 w-24" />
              <TouchableOpacity
                onPress={() => router.push("notification" as Href)}
              >
                <MaterialCommunityIcons
                  name="bell-badge"
                  size={30}
                  color={colorScheme == "dark" ? "white" : "#475569"}
                />
              </TouchableOpacity>
            </View>

            <View className="mt-5 px-4">
              <ThemedText className="text-4xl font-bold text-slate-800 dark:text-white">
                Hello, Peter
              </ThemedText>
              <ThemedText className="font-light text-base">
                You have{" "}
                <Text className="font-semibold text-yellow-500"> 3, 145</Text>{" "}
                trippers points!
              </ThemedText>
            </View>
          </ThemedView>
        }
      >
        <ThemedView className="flex-1 bg-white dark:bg-slate-950">
          {/* featured destinations */}
          <View className="py-8 pb-4 ">
            <View className="flex-row px-4 justify-between items-center mb-2">
              <ThemedText className="font-semibold text-xl">
                Featured Destinations
              </ThemedText>

              <Pressable className="bg-yellow-500 flex justify-center items-center rounded-xl py-1 px-3 h-10">
                <ThemedText className="font">View All</ThemedText>
              </Pressable>
            </View>

            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ paddingLeft: 8 }}
              data={
                isLoading
                  ? [{ _id: "1" }, { _id: "2" }, { _id: "3" }]
                  : data?.data
              }
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) =>
                isLoading ? (
                  <DestinationCardSkeleton />
                ) : (
                  <Pressable
                    onPress={() =>
                      router.push(`/package-details?id=${item._id}` as Href)
                    }
                    className="bg-white dark:bg-slate-900 mr-4 rounded-3xl overflow-hidden shadow-sm w-80 p-2 border-[2px] border-slate-200 dark:border-slate-700"
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
                        onPress={() => handleFavoriteToggle(item._id)}
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
                            color={favorites[item._id] ? "#ef4444" : "#64748b"}
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
                            {item.duration.days}D/{item.duration.nights}N
                          </ThemedText>
                        </View>
                        <ThemedText className="font-bold text-yellow-500">
                          ${item.price}
                        </ThemedText>
                      </View>
                    </View>
                  </Pressable>
                )
              }
            />

            {(data?.destinations?.length === 0 || !data) && !isLoading && (
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
                <Text className="text-slate-600 dark:text-slate-400 font-light text-base">
                  No destinations found yet...
                </Text>
              </View>
            )}
          </View>

          {/* extra services */}
          <View className="pt-4 px-4">
            <ThemedText className="font-semibold text-xl mb-2">
              Quick Find
            </ThemedText>

            <HeroCarousel
              carouselData={[
                {
                  title: "Travel Documents",
                  description:
                    "Let's assist you to acquire any travel documents you may need",
                  ctaText: "Learn More",
                  backgroundImage:
                    "https://img.freepik.com/free-photo/woman-credit-shopping-smartphone-manager_1262-2761.jpg",
                },
                {
                  title: "Express Bookings",
                  description:
                    "Easily book for a flight, hotel or rides with us",
                  ctaText: "Book Now",
                  backgroundImage:
                    "https://img.freepik.com/free-photo/woman-credit-shopping-smartphone-manager_1262-2761.jpg",
                  handleButtonPress: () => router.push("/(home)/book" as Href),
                },
                {
                  title: "VISA Acquisition",
                  description:
                    "We simplify your VISA applications to all major destinations",
                  ctaText: "Get Started",
                  backgroundImage:
                    "https://img.freepik.com/free-photo/woman-credit-shopping-smartphone-manager_1262-2761.jpg",
                },
              ]}
            />
          </View>

          {/* weekend getaways */}
          <View className="py-8 pb-4">
            <View className="flex-row justify-between mb-2 px-4 items-center">
              <View className="w-2/3">
                <ThemedText className="font-semibold text-xl">
                  Weekend Getaways
                </ThemedText>
              </View>
              <Pressable className="bg-yellow-500 flex justify-center items-center rounded-xl py-1 px-3 h-10">
                <ThemedText className="font">View All</ThemedText>
              </Pressable>
            </View>

            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ paddingLeft: 8 }}
              data={
                packagesAPI.isLoading
                  ? [{ _id: "1" }, { _id: "2" }, { _id: "3" }]
                  : packagesAPI.data?.data
              }
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) =>
                packagesAPI.isLoading ? (
                  <DestinationCardSkeleton />
                ) : (
                  <Pressable
                    onPress={() =>
                      router.push(`/package-details?id=${item._id}` as Href)
                    }
                    className="bg-white dark:bg-slate-900 mr-4 rounded-xl overflow-hidden shadow-sm w-72"
                  >
                    <View className="h-40 bg-slate-200 dark:bg-slate-800">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          source={{ uri: item.images[0] }}
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
                      {/* Favorite Button */}
                      <Pressable
                        onPress={() => handleFavoriteToggle(item._id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 dark:bg-slate-800/80 rounded-full items-center justify-center"
                      >
                        {favLoadingStates[item._id] ? (
                          <ActivityIndicator size="small" color="#eab308" />
                        ) : (
                          <MaterialCommunityIcons
                            name={
                              favorites[item._id] ? "heart" : "heart-outline"
                            }
                            size={20}
                            color={favorites[item._id] ? "#ef4444" : "#64748b"}
                          />
                        )}
                      </Pressable>
                    </View>
                    <View className="p-3">
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
                            {item.duration.days}D/{item.duration.nights}N
                          </ThemedText>
                        </View>
                        <ThemedText className="font-bold text-yellow-500">
                          ${item.price}
                        </ThemedText>
                      </View>
                    </View>
                  </Pressable>
                )
              }
            />

            {(packagesAPI.data?.data?.length === 0 || !packagesAPI.data) &&
              !packagesAPI.isLoading && (
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
                  <Text className="text-slate-600 dark:text-slate-400 font-light text-base">
                    No packages found yet...
                  </Text>
                </View>
              )}
          </View>

          <View className="px-4">
            <ThemedText className="font-semibold text-xl mb-2">
              Why Choose Us
            </ThemedText>
            {benefits.map((item, index) => (
              <BenefitsCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                key={index}
              />
            ))}
          </View>
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}
