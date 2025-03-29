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
import {
  BASE_URL,
  createApiInstance,
  toggleFavorite,
  checkFavorite,
  openWhatsAppChat,
  getPackages,
} from "@/data/api";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();
  const { auth } = useAuth();
  const [showTravelDocsForm, setShowTravelDocsForm] = useState(false);
  const [favLoadingStates, setFavLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  // Fetch packages from API
  const { data: packagesData, isLoading: isLoadingPackages } = useSWR(
    `/packages`,
    fetcher()
  );

  // Fetch sliders from API
  const { data: slidersData, isLoading: isLoadingSliders } = useSWR(
    `/sliders`,
    fetcher()
  );

  useEffect(() => {
    if (packagesData?.data) {
      const packageIds = packagesData.data.map((item: any) => item._id);
      checkFavorites(packageIds);
    }
  }, [packagesData, auth?.token]);

  // check if packages are in favorites
  const checkFavorites = async (packageIds: string[]) => {
    try {
      if (!auth?.token) return;
      const promises = packageIds.map((id) =>
        checkFavorite(id, "package", auth?.token)
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
      await toggleFavorite(packageId, "package", auth?.token);
      setFavorites((prev) => ({ ...prev, [packageId]: !prev[packageId] }));
    } catch (error) {
      console.error(error);
    } finally {
      setFavLoadingStates((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  // Process slider data for the carousel
  const carouselData =
    slidersData?.data?.map((slider: any) => ({
      title: slider.title,
      description: slider.description,
      ctaText: slider.ctaText,
      backgroundImage: slider.imageUrl,
      handleButtonPress: () => {
        // Handle different CTA links
        if (slider.ctaLink === "travel-docs") {
          setShowTravelDocsForm(true);
        } else if (slider.ctaLink === "bookings") {
          router.push("/book" as Href);
        } else if (slider.ctaLink.startsWith("/")) {
          router.push(slider.ctaLink as Href);
        }
      },
    })) || [];

  // Default carousel items to use when API data isn't available yet
  const defaultCarouselItems = [
    {
      title: "New Destinations",
      description: "Discover amazing new locations added to our collection",
      ctaText: "Explore Now",
      backgroundImage:
        "https://images.unsplash.com/photo-1505778276668-26b3ff7af103?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1286&q=80",
      handleButtonPress: () => router.push("/book?category=packages" as Href),
    },
    {
      title: "Summer Sale",
      description: "Enjoy 30% off on selected destinations this summer",
      ctaText: "Book Now",
      backgroundImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
      handleButtonPress: () => router.push("/book" as Href),
    },
    {
      title: "Premium Packages",
      description: "Experience luxury with our premium travel packages",
      ctaText: "View Packages",
      backgroundImage:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      handleButtonPress: () => router.push("/book?category=packages" as Href),
    },
  ];

  // Trip essentials data
  const tripEssentials = [
    {
      title: "Travel Documents",
      description: "We help with passports, visas and other travel documents",
      ctaText: "Chat Now",
      backgroundImage:
        "https://images.unsplash.com/photo-1544177889-75fc080ce58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      handleButtonPress: () =>
        openWhatsAppChat(
          "+233245678901",
          "Hello, I need assistance with travel documents."
        ),
    },
    {
      title: "Visa Application",
      description: "Expert assistance with visa applications for any country",
      ctaText: "Get Help",
      backgroundImage:
        "https://images.unsplash.com/photo-1587047237441-78e3787153d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1289&q=80",
      handleButtonPress: () =>
        openWhatsAppChat(
          "+233245678901",
          "Hello, I need help with visa application."
        ),
    },
    {
      title: "Airport Transport",
      description: "Reliable transportation from and to the airport",
      ctaText: "Book Now",
      backgroundImage:
        "https://images.unsplash.com/photo-1560624657-a818340054e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      handleButtonPress: () =>
        openWhatsAppChat(
          "+233245678901",
          "Hello, I would like to book airport transportation."
        ),
    },
    {
      title: "Tour Planning",
      description: "Customized tour planning tailored to your preferences",
      ctaText: "Plan Now",
      backgroundImage:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80",
      handleButtonPress: () =>
        openWhatsAppChat(
          "+233245678901",
          "Hello, I need help planning a tour."
        ),
    },
    {
      title: "Accommodation",
      description: "Find the perfect place to stay during your travels",
      ctaText: "Find Places",
      backgroundImage:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      handleButtonPress: () =>
        openWhatsAppChat(
          "+233245678901",
          "Hello, I need help finding accommodation."
        ),
    },
  ];

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
                onPress={() => router.push("notifications" as Href)}
              >
                <MaterialCommunityIcons
                  name="bell-badge"
                  size={30}
                  color={colorScheme == "dark" ? "white" : "#475569"}
                />
              </TouchableOpacity>
            </View>

            <View className="mt-5 px-4">
              <ThemedText
                type="title"
                className="font-bold text-slate-800 dark:text-white"
              >
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
          {/* JUST IN Section - Promotional sliders */}
          <View className="pt-6 px-4 mb-8">
            <ThemedText className="font-semibold text-2xl">JUST IN</ThemedText>

            {isLoadingSliders ? (
              <View className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ) : (
              <HeroCarousel
                carouselData={
                  carouselData.length > 0 ? carouselData : defaultCarouselItems
                }
              />
            )}
          </View>

          {/* LETS TRIP Section - Tour packages */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center px-4">
              <ThemedText className="text-2xl font-semibold">
                LETS TRIP
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push("/book?category=packages" as Href)}
              >
                <ThemedText className="text-yellow-500">See all</ThemedText>
              </TouchableOpacity>
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
                <View className="items-center mb-4 px-4">
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
                    No tour packages found yet...
                  </Text>
                </View>
              )}
          </View>

          {/* TRIP ESSENTIALS Section - Services with WhatsApp */}
          <View className="pt-4 px-4 mb-10">
            <ThemedText className="font-semibold text-2xl">
              TRIP ESSENTIALS
            </ThemedText>

            <HeroCarousel carouselData={tripEssentials} />
          </View>

          <View className="px-4 mb-8">
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
