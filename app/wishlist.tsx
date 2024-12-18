import { ErrorScreen } from "@/components/screens/error";
import { WishlistsSkeleton } from "@/components/skeletons/wishlists";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/data/fetcher";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, View, Text } from "moti";
import { FlatList, Pressable } from "react-native";
import { useColorScheme } from "react-native";
import useSWR from "swr";

export default function UserWishlist() {
  const colorScheme = useColorScheme();
  const { auth } = useAuth();

  console.log(auth?.token);

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { data, isLoading, error } = useSWR(
    `${baseUrl}/favorites`,
    fetcher(auth?.token)
  );

  return (
    <View className="flex-1 p-4 px-3 bg-white/50 dark:bg-slate-950">
      {isLoading && <WishlistsSkeleton />}

      {/* list of hotel favorites */}
      {!isLoading && data?.hotels.length > 0 && (
        <View className="mb-5">
          <Text className="text-2xl font-bold dark:text-white">Hotels</Text>
          <FlatList
            data={data?.hotels}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/details?id=${item._id}`)}
                className="flex-row mb-2 bg-white dark:bg-slate-900 p-2 rounded-2xl"
              >
                <Image
                  source={{ uri: item.images[0] }}
                  className="w-24 h-full rounded-xl"
                  resizeMode="cover"
                />

                <View className="flex-1 ml-3">
                  {/* name and rating */}

                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-semibold text-lg dark:text-white">
                      {item.name}
                    </Text>
                    <View className="flex-row items-center">
                      <StarRating stars={item.stars} />
                      <Text className="-ml-1 font-medium dark:text-white">
                        {item.starRating}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-end">
                    <View className="flex-1">
                      {/* location */}
                      <View className="flex-row items-center mb-1">
                        <Fontisto
                          name="map-marker-alt"
                          size={14}
                          color={colorScheme === "dark" ? "#fff" : "black"}
                        />
                        <Text className="ml-1 text-xs dark:text-white">
                          {item.location.city},{" "}
                        </Text>
                        <Text className="text-xs dark:text-white">
                          {item.location.country}
                        </Text>
                      </View>

                      {/* phone */}
                      <View className="flex-row items-center mb-1">
                        <Fontisto
                          name="mobile-alt"
                          size={14}
                          color={colorScheme === "dark" ? "#fff" : "black"}
                        />
                        <Text className="ml-1 text-xs dark:text-white">
                          {item.contactInfo.phone}
                        </Text>
                      </View>

                      {/* amenities */}
                      <View className="flex-row">
                        <Fontisto
                          name="room"
                          size={14}
                          color={colorScheme === "dark" ? "#fff" : "black"}
                        />
                        <Text className="ml-1 text-xs dark:text-white">
                          {item.amenities.slice(0, 2).join(", ")}
                          {item.amenities.length > 2 ? " ..." : ""}
                        </Text>
                      </View>
                    </View>

                    <Pressable className="flex-row items-center px-3 bg-yellow-500 rounded-xl h-10 ml-2">
                      <AntDesign name="hearto" size={14} color="#fff" />
                      <Text className="ml-1 text-sm text-white">
                        Unfavorite
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}

      {error && <ErrorScreen />}
    </View>
  );
}
