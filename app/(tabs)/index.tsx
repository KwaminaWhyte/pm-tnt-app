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

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  // fetch destinations
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { isLoading, data, error } = useSWR(`${baseUrl}/packages`, fetcher());
  const packagesAPI = useSWR(`${baseUrl}/packages`, fetcher());

  const { top } = useSafeAreaInsets();

  if (data) console.log(JSON.stringify(data, null, 2));

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
                  : data?.destinations
              }
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) =>
                isLoading ? (
                  <DestinationCardSkeleton />
                ) : (
                  <TripPackageCard
                    image={item.images[0] || ""}
                    title={item.name}
                    price={item.price}
                    location={item.location}
                    path={`/trips/${item._id}`}
                    data={item}
                  />
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
                  : packagesAPI.data?.packages
              }
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) =>
                packagesAPI.isLoading ? (
                  <DestinationCardSkeleton />
                ) : (
                  <TripPackageCard
                    image={item.images[0]}
                    title={item.name}
                    price={`GH ${item.price.toString()}`}
                    location={item.transportation}
                    path={`/packages/${item._id}`}
                    data={item}
                  />
                )
              }
            />

            {(packagesAPI.data?.packages?.length === 0 || !packagesAPI.data) &&
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
