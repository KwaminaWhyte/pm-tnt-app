import { EntypoCheck } from "@/components/icons/entypo";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { HotelSection } from "@/components/ui/sections";
import { StarRating } from "@/components/ui/star-rating";
import { useAuth } from "@/context/AuthContext";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { fetcher } from "@/data/fetcher";
import {
  AntDesign,
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { router, useGlobalSearchParams } from "expo-router";
import { ScrollView, View } from "moti";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  Text,
} from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";

export default function BookDetails() {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { id } = useGlobalSearchParams();
  const { auth } = useAuth();

  const { showBottomSheet } = useBottomSheet();
  const handleShowBottomSheet = () => {
    showBottomSheet(
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Book Your Stay</Text>
        <View className="space-y-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg">Check-in Date</Text>
            <Pressable className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
              <Text>Select Date</Text>
            </Pressable>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-lg">Check-out Date</Text>
            <Pressable className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
              <Text>Select Date</Text>
            </Pressable>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-lg">Guests</Text>
            <View className="flex-row items-center space-x-4">
              <Pressable className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
                <AntDesign name="minus" size={20} />
              </Pressable>
              <Text className="text-lg">2</Text>
              <Pressable className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
                <AntDesign name="plus" size={20} />
              </Pressable>
            </View>
          </View>
          <Pressable className="bg-yellow-500 h-12 items-center justify-center rounded-2xl mt-4">
            <Text className="text-xl font-semibold text-white">
              Confirm Booking
            </Text>
          </Pressable>
        </View>
      </View>,
      {
        snapPoints: [0.4],
        initialSnap: 0,
      }
    );
  };

  const { isLoading, data, error } = useSWR(
    `${baseUrl}/hotels/public/${id}`,
    fetcher()
  );

  // if (data) console.log(JSON.stringify(data, null, 2));

  const [selectedImage, setSelectedImage] = useState(
    data?.data?.images[0] || undefined
  );

  useEffect(() => {
    setSelectedImage(data?.data?.images[0] || undefined);
  }, [data]);

  // handle favourite
  const [favIsLoading, setFavIsLoading] = useState(false);
  const handleAddToFavorite = async () => {
    setFavIsLoading(true);

    try {
      // check if user is logged in
      if (!auth?.token) {
        alert("Please login to add to favourites!");
        return;
      }

      // make API call
      const response = await axios.post(
        `hotels/public/${data?.data?._id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      alert("Added to Favourites successfully!");
      console.log(JSON.stringify(response.data));
    } catch (error: any) {
      console.error(
        JSON.stringify(
          {
            response: error.response,
            message: error.message,
            error: error,
          },
          null,
          2
        )
      );
    } finally {
      setFavIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-200/20 dark:bg-slate-900">
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#eab308" />
          <ThemedText className="font-semibold text-4xl">Loading...</ThemedText>
        </View>
      )}

      {data && (
        <ScrollView className="flex-1">
          <ImageBackground
            source={{ uri: selectedImage }}
            className="h-56"
            resizeMode="cover"
          >
            <View className="flex-row h-full bg-black/20 px-3 py-3">
              {/* press to go back */}
              <Pressable
                onPress={() => router.back()}
                className="w-10 h-10 items-center justify-center flex-row flex bg-white rounded-full"
              >
                <FontAwesome6 name="chevron-left" size={24} color="#eab308" />
              </Pressable>
            </View>
          </ImageBackground>

          {/* selectable images */}
          {data?.data?.images?.length > 1 && (
            <ScrollView
              horizontal
              className="px-3 py-2"
              contentContainerStyle={{ gap: 8 }}
              showsHorizontalScrollIndicator={false}
            >
              {data?.data?.images?.map((image: string, index: number) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedImage(image)}
                  className="h-10 w-10 rounded-md overflow-hidden"
                >
                  <ImageBackground
                    source={{ uri: image }}
                    className="h-full w-full"
                    resizeMode="cover"
                  >
                    {selectedImage !== image && (
                      <View className="w-full h-full bg-slate-300/70" />
                    )}
                  </ImageBackground>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* title */}
          <View className="mb-6">
            <ThemedText className="font-semibold text-3xl px-3">
              {data?.data?.name}
            </ThemedText>

            <View className="flex-row items-center justify-between px-3 pt-3">
              <View className="flex-row gap-x-2">
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={32}
                  color="black"
                />
                <View>
                  <Text className="text-sm">
                    {data?.data?.location?.address}
                  </Text>
                  <Text className="text-sm">
                    {data?.data?.location?.city},{" "}
                    {data?.data?.location?.country}
                  </Text>
                </View>
              </View>

              <StarRating
                stars={data?.data?.averageRating}
                reviewCount={data?.data?.ratings?.length}
              />
            </View>
          </View>

          {/* description */}
          <HotelSection title="About">
            <Text className="text-slate-600 dark:text-slate-400">
              {data?.data?.description}
            </Text>
          </HotelSection>

          {/* rooms */}
          <HotelSection title="Rooms">
            <View>
              {data?.data?.rooms?.map((room: any, index: number) => (
                <View
                  key={index}
                  className="flex-row mb-2 bg-white dark:bg-slate-900 rounded-2xl p-2"
                >
                  <View className="w-32 bg-slate-300 h-full rounded-2xl mr-2"></View>

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between h-6 mb-1">
                      <Text className="font-medium text-base">
                        Room {room.roomNumber}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full h-6 justify-center items-center  ${
                          room.isAvailable ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      >
                        <Text
                          className={`text-center text-xs font-medium ${
                            room.isAvailable ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {room.isAvailable ? "Available" : "Unavailable"}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-slate-600 dark:text-slate-400 mb-1">
                      Capacity: {room.capacity}
                    </Text>
                    {room.features?.length > 0 && (
                      <Text className="text-slate-600 dark:text-slate-400">
                        Features: {room.features?.join(", ")}
                      </Text>
                    )}

                    <Text className="font-bold text-xl mt-1">
                      ${room.pricePerNight}{" "}
                      <Text className="text-sm font-normal">/night</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </HotelSection>

          {/* amenities */}
          <HotelSection title="Amenities">
            <View>
              {data?.data?.amenities?.map((amenity: any, index: number) => (
                <View key={index} className="flex-row items-center mb-1">
                  <EntypoCheck className="mr-2 w-4 h-4 text-green-500" />
                  <Text className="">{amenity}</Text>
                </View>
              ))}
            </View>
          </HotelSection>

          {/* contact info */}
          <HotelSection title="Contact Info">
            <View>
              <View className="flex-row items-center mb-2 gap-x-2">
                <MaterialCommunityIcons
                  name="phone-in-talk"
                  size={24}
                  color="black"
                />
                <Text className="">{data?.data?.contactInfo?.phone}</Text>
              </View>
              <View className="flex-row items-center mb-2 gap-x-2">
                <MaterialCommunityIcons
                  name="email-open-multiple-outline"
                  size={24}
                  color="black"
                />
                <Text className="">{data?.data?.contactInfo?.email}</Text>
              </View>
              <View className="flex-row items-center mb-2 gap-x-2">
                <MaterialCommunityIcons name="web" size={24} color="black" />
                <Text className="">{data?.data?.contactInfo?.website}</Text>
              </View>
            </View>
          </HotelSection>

          {/* map */}
          <HotelSection title="Location">
            <View className="rounded-2xl overflow-hidden h-56 mt-2">
              <MapView
                initialRegion={{
                  latitude: data?.data?.location?.geo?.coordinates[1],
                  longitude: data?.data?.location?.geo?.coordinates[0],
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
              />
            </View>
          </HotelSection>
        </ScrollView>
      )}

      {data && (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900">
          <Pressable className="mr-10" onPress={handleAddToFavorite}>
            {favIsLoading ? (
              <ActivityIndicator size={"large"} color={"#eab308"} />
            ) : (
              <AntDesign name="hearto" size={32} color="#eab308" />
            )}
          </Pressable>

          <Pressable
            onPress={handleShowBottomSheet}
            className="bg-yellow-500 h-12 px-12 items-center justify-center rounded-2xl"
          >
            <Text className="text-xl font-semibold text-white">Book Now</Text>
          </Pressable>
        </View>
      )}

      {error && (
        <View className="flex-1 items-center justify-center">
          <ThemedText className="text-red-500 text-3xl">Error</ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}
