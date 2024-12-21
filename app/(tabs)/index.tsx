import ParallaxScrollView from "@/components/ParallaxScrollView";
import { BenefitsCard, TripPackageCard } from "@/components/ui/cards";
import { benefits } from "@/data/constant-data";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
import { CustomBottomSheet } from "@/components/ui/bottom-sheet";
import { TravelDocsForm } from "@/components/ui/travel-docs-form";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();
  const { auth } = useAuth();
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const [showTravelDocsForm, setShowTravelDocsForm] = useState(false);
  const [favLoadingStates, setFavLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  // Fetch hotels from API
  const { data: hotelsData, isLoading: isLoadingHotels } = useSWR(
    `${baseUrl}/hotels/public?limit=4`,
    fetcher()
  );

  // Fetch packages from API
  const { data: packagesData, isLoading: isLoadingPackages } = useSWR(
    `${baseUrl}/packages`,
    fetcher()
  );

  useEffect(() => {
    if (hotelsData?.data) {
      const itemIds = hotelsData.data.map((item: any) => item._id);
      checkHotelFavorites(itemIds);
    }
  }, [hotelsData, auth?.token]);

  // check if hotels are in favorites
  const checkHotelFavorites = async (itemIds: string[]) => {
    try {
      if (!auth?.token) return;
      const promises = itemIds.map((id) =>
        axios.get(`${baseUrl}/favorites/check/hotel/${id}`, {
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

  // handle favorite toggle for hotels
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
        `${baseUrl}/favorites/hotel/${itemId}`,
        {},
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setFavorites((prev) => {
        const newState = { ...prev, [itemId]: !prev[itemId] };
        return newState;
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setFavLoadingStates((prev) => ({ ...prev, [itemId]: false }));
    }
  };

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
  const handleFavoriteTogglePackage = async (packageId: string) => {
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
    if (packagesData?.data) {
      const packageIds = packagesData.data.map((item: any) => item._id);
      checkFavorites(packageIds);
    }
  }, [packagesData, auth?.token]);

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
              <ThemedText className="font-semibold text-2xl">
                Featured Destinations
              </ThemedText>
            </View>

            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ paddingLeft: 8 }}
              data={
                isLoadingPackages
                  ? [{ _id: "1" }, { _id: "2" }, { _id: "3" }]
                  : packagesData?.data
              }
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) =>
                isLoadingPackages ? (
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
                        onPress={() => handleFavoriteTogglePackage(item._id)}
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

            {(packagesData?.data?.length === 0 || !packagesData) &&
              !isLoadingPackages && (
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

          {/* Popular Hotels */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4 px-4">
              <ThemedText className="text-2xl font-semibold">
                Popular Hotels
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push("/book?category=hotels" as Href)}
              >
                <ThemedText className="text-yellow-500">See all</ThemedText>
              </TouchableOpacity>
            </View>

            {isLoadingHotels ? (
              <View className="px-4">
                <DestinationCardSkeleton />
              </View>
            ) : (
              <FlatList
                data={hotelsData?.data || []}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/details",
                        params: { id: item._id },
                      } as Href)
                    }
                    className="mb-6 p-2 py-3 pt-2 border-[1.5px] border-slate-300/30 dark:border-white/10 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden w-80 relative mr-4"
                  >
                    <View className="relative">
                      <Image
                        source={{ uri: item.images?.[0] }}
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
                            color={favorites[item._id] ? "#ef4444" : "#64748b"}
                          />
                        )}
                      </Pressable>
                    </View>
                    <View className="p-2">
                      <ThemedText className="text-lg font-semibold mb-1">
                        {item.name}
                      </ThemedText>
                      <View className="flex-row items-center mb-2">
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={16}
                          color="#eab308"
                        />
                        <ThemedText className="text-slate-600 dark:text-slate-400 text-sm ml-1">
                          {item.location?.city}, {item.location?.country}
                        </ThemedText>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <MaterialCommunityIcons
                            name="star"
                            size={16}
                            color="#eab308"
                          />
                          <ThemedText className="ml-1 text-sm">
                            {item.rating} ({item.number_of_reviews || 0})
                          </ThemedText>
                        </View>
                        <ThemedText className="font-bold text-yellow-500">
                          ${item.price_per_night}/night
                        </ThemedText>
                      </View>
                    </View>
                  </Pressable>
                )}
                keyExtractor={(item) => item._id.toString()}
              />
            )}
          </View>

          {/* extra services */}
          <View className="pt-4 px-4 mb-10">
            <ThemedText className="font-semibold text-2xl mb-2">
              Quick Find
            </ThemedText>

            <HeroCarousel
              carouselData={[
                {
                  title: "Travel Documents",
                  description:
                    "Let's assist you to acquire any travel documents you may need",
                  ctaText: "Apply Now",
                  backgroundImage:
                    "https://img.freepik.com/free-photo/woman-credit-shopping-smartphone-manager_1262-2761.jpg",
                  handleButtonPress: () => setShowTravelDocsForm(true),
                },
                {
                  title: "Express Bookings",
                  description:
                    "Easily book for a flight, hotel or rides with us",
                  ctaText: "Book Now",
                  backgroundImage:
                    "https://img.freepik.com/free-photo/woman-credit-shopping-smartphone-manager_1262-2761.jpg",
                  handleButtonPress: () => router.push("/book" as Href),
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

          <View className="px-4">
            <ThemedText className="font-semibold text-2xl mb-2">
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

      {/* Travel Documents Form Bottom Sheet */}
      <CustomBottomSheet
        isOpen={showTravelDocsForm}
        onClose={() => setShowTravelDocsForm(false)}
        snapPoints={[0.9]}
        initialSnap={0}
      >
        <TravelDocsForm onClose={() => setShowTravelDocsForm(false)} />
      </CustomBottomSheet>
    </KeyboardAvoidingView>
  );
}
