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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";

export default function UserWishlist() {
  const colorScheme = useColorScheme();
  const { auth } = useAuth();

  console.log(auth?.token);

  const baseUrl =
    "http://i48g4kck48ksow4ssowws4go.138.68.103.18.sslip.io/api/v1";

  const { data, isLoading, error, mutate } = useSWR(
    `${baseUrl}/favorites`,
    fetcher(auth?.token)
  );

  const handleUnfavorite = async (
    type: "hotel" | "vehicle",
    itemId: string
  ) => {
    try {
      if (!auth?.token) {
        alert("Please login to manage favourites!");
        return;
      }
      await axios.post(
        `${baseUrl}/favorites/${type}/${itemId}`,
        {},
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

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

                    <Pressable
                      onPress={() => handleUnfavorite("hotel", item._id)}
                      className="flex-row items-center justify-center bg-yellow-500 rounded-xl h-10 w-10 ml-2"
                    >
                      <AntDesign name="heart" size={24} color="#fff" />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* list of vehicle favorites */}
      {!isLoading && data?.vehicles && data?.vehicles.length > 0 && (
        <View className="px-3">
          <Text className="text-lg font-semibold mb-3 dark:text-white">
            Favorite Vehicles
          </Text>
          <View className="space-y-3">
            {data?.vehicles.map((vehicle: any) => (
              <Pressable
                key={vehicle._id}
                onPress={() =>
                  router.push(
                    `/vehicle-details?vehicle=${JSON.stringify(vehicle)}`
                  )
                }
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden"
              >
                <View className="flex-row">
                  {vehicle?.images?.length > 0 ? (
                    <Image
                      source={{ uri: vehicle.images[0] }}
                      className="w-28 h-28 rounded-2xl mr-3"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl mr-3 items-center justify-center">
                      <MaterialCommunityIcons
                        name="car"
                        size={48}
                        color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                    </View>
                  )}
                  <View className="flex-1 py-2 pr-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-medium text-base dark:text-white">
                        {vehicle.make} {vehicle.model}
                      </Text>
                    </View>
                    <Text className="text-gray-600 dark:text-gray-300 mb-1">
                      {vehicle.vehicleType} • {vehicle.year} •{" "}
                      {vehicle.capacity} Seats
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center space-x-1">
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={16}
                          color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
                        />
                        <Text className="text-gray-600 dark:text-gray-300">
                          {vehicle.availability?.location?.city}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <View className="flex-row items-center space-x-2">
                          <Text className="text-lg font-bold dark:text-white">
                            ${vehicle.pricePerDay}
                          </Text>
                          <View
                            className={`px-2 py-1 rounded-full ${
                              vehicle.availability?.isAvailable
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                            }`}
                          >
                            <Text
                              className={`text-xs font-medium ${
                                vehicle.availability?.isAvailable
                                  ? "text-green-700 dark:text-green-300"
                                  : "text-red-700 dark:text-red-300"
                              }`}
                            >
                              {vehicle.availability?.isAvailable
                                ? "Available"
                                : "Not Available"}
                            </Text>
                          </View>
                        </View>
                        <Pressable
                          onPress={() =>
                            handleUnfavorite("vehicle", vehicle._id)
                          }
                          className="flex-row items-center justify-center bg-yellow-500 rounded-xl h-10 w-10 ml-2"
                        >
                          <AntDesign name="heart" size={24} color="#fff" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {error && <ErrorScreen />}
    </View>
  );
}
