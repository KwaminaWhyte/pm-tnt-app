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
  Button,
  ImageBackground,
  Pressable,
  Text,
} from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from "@/components/ui/input";
import { TextInput } from "react-native-gesture-handler";
import moment from "moment";
import { bookHotelRoom } from "@/data/api";

export default function BookDetails() {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { id } = useGlobalSearchParams();
  const { auth } = useAuth();

  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [guests, setGuests] = useState("1");
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
                  data?.data?._id,
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
        snapPoints: [0.5],
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
    data?.data?.images[0] || undefined
  );

  useEffect(() => {
    setSelectedImage(data?.data?.images[0] || undefined);
  }, [data]);

  // handle favourite
  const [favIsLoading, setFavIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // check if added to favourites
  const checkIfAddedToFavorite = async () => {
    try {
      // check if user is logged in
      if (!auth?.token) {
        return;
      }

      // make API call
      const response = await axios.get(
        `${baseUrl}/favorites/check/hotel/${data?.data?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      console.log(response.data?.isFavorite);

      setIsFavorite(response.data?.isFavorite);
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
    }
  };
  useEffect(() => {
    if (data) {
      checkIfAddedToFavorite();
    }
  }, []);

  // handle add to favorite
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
        `${baseUrl}/favorites/hotel/${data?.data?._id}`,
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
              <AntDesign
                name={isFavorite ? "heart" : "hearto"}
                size={32}
                color="#eab308"
              />
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

      {!isLoading && (error || !data) && (
        <View className="flex-1 items-center justify-center">
          <ThemedText className="text-red-500 text-3xl">
            Error {error?.message}
          </ThemedText>
          <Button title="Go Back" onPress={() => router.back()} />
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
