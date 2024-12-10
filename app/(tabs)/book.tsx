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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function BookingScreen() {
  const { category } = useGlobalSearchParams();
  const colorScheme = useColorScheme();
  const pathName = usePathname();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (pathName !== "/book") {
      return;
    }
    if (!category) {
      router.navigate(`/book?category=hotels` as Href);
    }
    console.log(category);
  }, []);

  // Fetch available options based on selected type
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { data, isLoading } = useSWR(
    category === "packages"
      ? `${baseUrl}/packages/public?searchTerm=${searchTerm || ""}`
      : category === "vehicles"
      ? `${baseUrl}/vehicles/public?searchTerm=${searchTerm || ""}`
      : `${baseUrl}/hotels/public?searchTerm=${searchTerm || ""}`,
    fetcher()
  );

  // useEffect(() => {
  //   if (data) {
  //     console.log(JSON.stringify(data, null, 2));
  //   }
  // }, [data]);

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
      label: "Vehicles",
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
    <SafeAreaView className="flex-1 bg-slate-200/20 dark:bg-slate-900">
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
      <View className="flex-1 px-4">
        {isLoading ? (
          <>
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </>
        ) : (
          <View>
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
                      className="mb-6 p-3 py-4 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden w-full"
                      onPress={() => router.push(`/details?id=${item?._id}`)}
                    >
                      <Image
                        source={{ uri: item?.images[0] || "" }}
                        className="w-full h-44 border border-slate-200 dark:border-slate-700 rounded-xl"
                        resizeMode="cover"
                      />
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
                <Text className="text-slate-600 dark:text-slate-400 font-lexend-light text-base">
                  No hotels found
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
