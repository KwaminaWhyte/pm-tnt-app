import { EntypoCheck } from "@/components/icons/entypo";
import { ThemedText } from "@/components/ThemedText";
import { CustomAlertModal } from "@/components/ui/modal";
import { HotelSection } from "@/components/ui/sections";
import { StarRating } from "@/components/ui/star-rating";
import { useAuth } from "@/context/AuthContext";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { fetcher } from "@/data/fetcher";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { router, useGlobalSearchParams } from "expo-router";
import { ScrollView, View } from "moti";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  Text,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from "@/components/ui/input";
import { TextInput } from "react-native-gesture-handler";
import moment from "moment";
import { bookHotelRoom } from "@/data/api";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";

export default function BookDetails() {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { id } = useGlobalSearchParams();
  const { auth } = useAuth();

  const toast = useToast();

  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [guests, setGuests] = useState("1");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [checkInDatePickerVisible, setCheckInDatePickerVisible] =
    useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkOutDatePickerVisible, setCheckOutDatePickerVisible] =
    useState(false);
  const handleCheckIn = (date: any) => {
    console.log(date);
    setCheckInDatePickerVisible(false);
    setCheckInDate(date);
  };

  const handleCheckOut = (date: any) => {
    console.log(date);
    setCheckOutDatePickerVisible(false);
    setCheckOutDate(date);
  };

  const { showBottomSheet } = useBottomSheet();
  const handleShowBottomSheet = () => {
    showBottomSheet(
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Book Your Stay</Text>
        <View className="space-y-4">
          <View className="">
            <Text className="text-lg">Check-in</Text>
            <View className="flex-row items-center space-x-5">
              <View className="flex-1 border border-gray-200 dark:border-gray-700 p-2 rounded-xl h-12 justify-center">
                <Text className="">
                  {checkInDate
                    ? moment(checkInDate).format("DD-MMM-YYYY hh:mm A")
                    : "Select Date"}
                </Text>
              </View>
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-xl bg-yellow-500"
                onPress={() => setCheckInDatePickerVisible(true)}
              >
                <AntDesign name="calendar" size={24} color={"#fff"} />
              </Pressable>
            </View>
          </View>
          <View className="">
            <Text className="text-lg">Check-out</Text>
            <View className="flex-row items-center space-x-5">
              <View className="flex-1 border border-gray-200 dark:border-gray-700 p-2 rounded-xl h-12 justify-center">
                <Text className="">
                  {checkOutDate
                    ? moment(checkOutDate).format("DD-MMM-YYYY hh:mm A")
                    : "Select Date"}
                </Text>
              </View>
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-xl bg-yellow-500"
                onPress={() => setCheckOutDatePickerVisible(true)}
              >
                <AntDesign name="calendar" size={24} color={"#fff"} />
              </Pressable>
            </View>
          </View>
          <View className="">
            <Text className="text-lg">Guests</Text>
            <View className="flex-row items-center space-x-5">
              <TextInput
                className="flex-1 border border-gray-200 dark:border-gray-700 p-2 rounded-xl h-12 justify-center"
                placeholder="1"
                keyboardType="numeric"
              />
              <View className="h-12 w-12" />
            </View>
          </View>
          <Pressable
            onPress={async () => {
              setBookingIsLoading(true);
              try {
                const response = await bookHotelRoom(
                  selectedRoomId,
                  data?.data?.hotel?._id as string,
                  checkInDate,
                  checkOutDate,
                  parseInt(guests),
                  auth?.token as string
                );
                console.log(response);
              } catch (error: any) {
              } finally {
                setBookingIsLoading(false);
              }
            }}
            className="bg-yellow-500 h-12 items-center justify-center rounded-2xl mt-4"
          >
            {bookingIsLoading && (
              <ActivityIndicator size="small" color="#fff" />
            )}
            <Text className="text-xl font-semibold text-white">
              Confirm Booking
            </Text>
          </Pressable>
        </View>
      </View>,
      {
        snapPoints: [0.5, 0.6, 0.7, 0.8, 0.9],
        initialSnap: 0,
      }
    );
  };

  useEffect(() => {
    if (checkInDate || checkOutDate) {
      handleShowBottomSheet();
    }
  }, [checkInDate, checkOutDate]);

  const { isLoading, data, error } = useSWR(
    `${baseUrl}/hotels/public/${id}`,
    fetcher()
  );

  // if (data) console.log(JSON.stringify(data, null, 2));

  const [selectedImage, setSelectedImage] = useState(
    data?.data?.hotel?.images[0] || undefined
  );

  useEffect(() => {
    setSelectedImage(data?.data?.hotel?.images[0] || undefined);
  }, [data]);

  // handle favourite
  const [favIsLoading, setFavIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // check if added to favourites
  const checkIfAddedToFavorite = async () => {
    try {
      if (!auth?.token) return;
      const response = await axios.get(
        `${baseUrl}/favorites/check/hotel/${data?.data?.hotel?._id}`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      setIsFavorite(response.data?.isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data) {
      checkIfAddedToFavorite();
    }
  }, []);

  const handleAddToFavorite = async () => {
    setFavIsLoading(true);
    try {
      if (!auth?.token) {
        alert("Please login to add to favourites!");
        return;
      }
      await axios.post(
        `${baseUrl}/favorites/hotel/${data?.data?.hotel?._id}`,
        {},
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setIsFavorite(!isFavorite);
      toast.show(isFavorite ? "Removed from favorites" : "Added to favorites", {
        type: "success",
      });
    } catch (error) {
      console.error(error);
      toast.show("Failed to update favorites", { type: "error" });
    } finally {
      setFavIsLoading(false);
    }
  };

  const handleCall = () => {
    if (data?.data?.hotel?.contactInfo?.phone) {
      Linking.openURL(`tel:${data.data.hotel.contactInfo?.phone}`);
    } else {
      toast.show("No phone number available", { type: "error" });
    }
  };

  const handleEmail = () => {
    if (data?.data?.hotel?.contactInfo?.email) {
      Linking.openURL(`mailto:${data.data.hotel.contactInfo?.email}`);
    } else {
      toast.show("No email address available", { type: "error" });
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
          {data?.data?.hotel?.images?.length > 1 && (
            <ScrollView
              horizontal
              className="px-3 py-2"
              contentContainerStyle={{ gap: 8 }}
              showsHorizontalScrollIndicator={false}
            >
              {data?.data?.hotel?.images?.map(
                (image: string, index: number) => (
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
                )
              )}
            </ScrollView>
          )}

          {/* title */}
          <View className="mb-6">
            <ThemedText className="font-semibold text-3xl px-3">
              {data?.data?.hotel?.name}
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
                    {data?.data?.hotel?.location?.address}
                  </Text>
                  <Text className="text-sm">
                    {data?.data?.hotel?.location?.city},{" "}
                    {data?.data?.hotel?.location?.country}
                  </Text>
                </View>
              </View>

              <StarRating
                stars={data?.data?.hotel?.averageRating}
                reviewCount={data?.data?.hotel?.ratings?.length}
              />
            </View>
          </View>

          {/* Hotel Info */}
          <View className="px-3 mb-6">
            <Text className="text-lg font-semibold mb-3 dark:text-white">
              Hotel Information
            </Text>
            <View className="space-y-2">
              <Text className="text-gray-600 dark:text-gray-300">
                {data?.data?.hotel?.description}
              </Text>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={
                    data?.data?.hotel?.location?.geo?.coordinates[1] === 0
                      ? "#9ca3af"
                      : "#6b7280"
                  }
                />
                <Text className="text-gray-600 dark:text-gray-300">
                  {data?.data?.hotel?.location?.address}
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={
                    data?.data?.hotel?.contactInfo?.phone === ""
                      ? "#9ca3af"
                      : "#6b7280"
                  }
                />
                <Text className="text-gray-600 dark:text-gray-300">
                  {data?.data?.hotel?.contactInfo?.phone}
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={
                    data?.data?.hotel?.contactInfo?.email === ""
                      ? "#9ca3af"
                      : "#6b7280"
                  }
                />
                <Text className="text-gray-600 dark:text-gray-300">
                  {data?.data?.hotel?.contactInfo?.email}
                </Text>
              </View>
            </View>
          </View>

          {/* description */}
          <HotelSection title="About">
            <Text className="text-slate-600 dark:text-slate-400">
              {data?.data?.hotel?.description}
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
                  {room?.images?.length > 0 ? (
                    <Image
                      source={{ uri: room?.images[0] }}
                      className="w-28 h-28 rounded-2xl mr-3"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-28 bg-slate-300 h-full rounded-2xl mr-2"></View>
                  )}

                  <View className="flex-1 ">
                    <View className="flex-row items-center justify-between h-6 mb-1">
                      <Text className="font-medium text-base dark:text-white">
                        Room {room.roomNumber}
                      </Text>
                      <Text className="font-medium text-base dark:text-white">
                        ${room.pricePerNight}
                      </Text>
                    </View>

                    <Text className="text-gray-600 dark:text-gray-300 mb-1">
                      Capacity: {room.capacity}
                    </Text>
                    {room.features?.length > 0 && (
                      <Text className="text-gray-600 dark:text-gray-300">
                        Features: {room.features?.join(", ")}
                      </Text>
                    )}

                    <View className="flex-row items-center space-x-2 mt-1">
                      {room?.isAvailable && (
                        <Pressable
                          onPress={() => {
                            setSelectedRoomId(room._id);
                            handleShowBottomSheet();
                          }}
                          className="bg-yellow-500 px-4 py-2 rounded-md"
                        >
                          <Text>Book Now</Text>
                        </Pressable>
                      )}
                      <Text
                        className={`${
                          room.isAvailable
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {room.isAvailable ? "Available" : "Unavailable"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </HotelSection>

          {/* reviews */}
          {data?.data?.hotel?.ratings &&
            data?.data?.hotel?.ratings.length > 0 && (
              <View className="px-3 mb-6">
                <Text className="text-lg font-semibold mb-3 dark:text-white">
                  Reviews
                </Text>
                {data?.data?.hotel?.ratings.map(
                  (rating: any, index: number) => (
                    <View
                      key={index}
                      className="mb-4 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center space-x-3">
                          {rating.userImage ? (
                            <Image
                              source={{ uri: rating.userImage }}
                              className="w-10 h-10 rounded-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <View className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center">
                              <MaterialCommunityIcons
                                name="account"
                                size={24}
                                color={"#6b7280"}
                              />
                            </View>
                          )}
                          <View>
                            <Text className="font-medium dark:text-white">
                              {rating.user}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row items-center">
                          {[...Array(5)].map((_, i) => (
                            <MaterialCommunityIcons
                              key={i}
                              name={i < rating.rating ? "star" : "star-outline"}
                              size={16}
                              color="#eab308"
                            />
                          ))}
                        </View>
                      </View>
                      <Text className="text-gray-600 dark:text-gray-300 mt-2">
                        {rating.review}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}

          {/* amenities */}
          <HotelSection title="Amenities">
            <View>
              {data?.data?.hotel?.amenities?.map(
                (amenity: any, index: number) => (
                  <View key={index} className="flex-row items-center mb-1">
                    <EntypoCheck className="mr-2 w-4 h-4 text-green-500" />
                    <Text className="">{amenity}</Text>
                  </View>
                )
              )}
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
                <Text className="text-gray-600 dark:text-gray-300">
                  {data?.data?.hotel?.contactInfo?.phone}
                </Text>
              </View>
              <View className="flex-row items-center mb-2 gap-x-2">
                <MaterialCommunityIcons
                  name="email-open-multiple-outline"
                  size={24}
                  color="black"
                />
                <Text className="text-gray-600 dark:text-gray-300">
                  {data?.data?.hotel?.contactInfo?.email}
                </Text>
              </View>
              <View className="flex-row items-center mb-2 gap-x-2">
                <MaterialCommunityIcons name="web" size={24} color="black" />
                <Text className="text-gray-600 dark:text-gray-300">
                  {data?.data?.hotel?.contactInfo?.website}
                </Text>
              </View>
            </View>
          </HotelSection>

          {/* map */}
          <HotelSection title="Location">
            <View className="rounded-2xl overflow-hidden h-56 mt-2">
              <MapView
                initialRegion={{
                  latitude: data?.data?.hotel?.location?.geo?.coordinates[1],
                  longitude: data?.data?.hotel?.location?.geo?.coordinates[0],
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
              />
            </View>
          </HotelSection>
        </ScrollView>
      )}

      {/* Bottom Actions */}
      <View className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-slate-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row space-x-3">
            <Pressable
              onPress={handleCall}
              className="bg-green-500 p-3 rounded-full"
            >
              <Ionicons name="call" size={24} color="white" />
            </Pressable>
            <Pressable
              onPress={handleEmail}
              className="bg-blue-500 p-3 rounded-full"
            >
              <MaterialCommunityIcons name="email" size={24} color="white" />
            </Pressable>
          </View>
          <Pressable
            onPress={handleAddToFavorite}
            disabled={favIsLoading}
            className="bg-yellow-500 px-6 py-3 rounded-xl flex-row items-center"
          >
            {favIsLoading ? (
              <MaterialCommunityIcons
                name="loading"
                size={20}
                color="white"
                className="animate-spin"
              />
            ) : (
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color="white"
              />
            )}
            <Text className="text-white font-semibold ml-2">
              {favIsLoading
                ? "Updating..."
                : isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </Text>
          </Pressable>
        </View>
      </View>

      {!isLoading && (error || !data) && (
        <View className="flex-1 items-center justify-center">
          <ThemedText className="text-red-500 text-3xl">
            Error {error?.message}
          </ThemedText>
          <Button
            label="Go Back"
            onClick={() => router.back()}
            startIcon={<AntDesign name="arrowleft" size={24} color="white" />}
          />
        </View>
      )}

      {/* check-in date */}
      <DateTimePickerModal
        isVisible={checkInDatePickerVisible}
        mode="datetime"
        onConfirm={handleCheckIn}
        onCancel={() => {
          setCheckInDate("");
          setCheckInDatePickerVisible(false);
        }}
      />
      <DateTimePickerModal
        isVisible={checkOutDatePickerVisible}
        mode="datetime"
        onConfirm={handleCheckOut}
        onCancel={() => setCheckOutDatePickerVisible(false)}
      />
    </SafeAreaView>
  );
}
