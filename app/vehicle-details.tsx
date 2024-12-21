import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  ImageBackground,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useColorScheme } from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleDetails() {
  const { auth } = useAuth();
  const colorScheme = useColorScheme();
  const { vehicle } = useLocalSearchParams();
  const toast = useToast();

  const [favIsLoading, setFavIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const vehicleData = JSON.parse(vehicle as string);
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (vehicleData.images?.[0]) {
      setSelectedImage(vehicleData.images[0]);
    }
  }, [vehicleData]);

  const checkIfAddedToFavorite = async () => {
    try {
      if (!auth?.token) return;
      const response = await axios.get(
        `${baseUrl}/favorites/check/vehicle/${vehicleData?._id}`,
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
    if (vehicleData) {
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
        `${baseUrl}/favorites/vehicle/${vehicleData?._id}`,
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
    Linking.openURL(`tel:${vehicleData.contactInfo?.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${vehicleData.contactInfo?.email}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-200/20 dark:bg-slate-900">
      <ScrollView className="flex-1">
        {/* Main Image */}
        <ImageBackground
          source={{ uri: selectedImage }}
          className="h-56"
          resizeMode="cover"
        >
          <View className="flex-row h-full bg-black/20 px-3 py-3">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center flex-row flex bg-white rounded-full"
            >
              <FontAwesome6 name="chevron-left" size={24} color="#eab308" />
            </Pressable>
          </View>
        </ImageBackground>

        {/* Image Gallery */}
        {vehicleData.images?.length > 1 && (
          <ScrollView
            horizontal
            className="px-3 py-2"
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
          >
            {vehicleData.images.map((image: string, index: number) => (
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

        {/* Title and Price */}
        <View className="mb-6">
          <Text className="font-semibold text-3xl px-3 dark:text-white">
            {vehicleData.make} {vehicleData.model}
          </Text>
          <View className="flex-row items-center justify-between px-3 pt-2">
            <Text className="text-gray-600 dark:text-gray-300 text-lg">
              {vehicleData.year} • {vehicleData.vehicleType}
            </Text>
            <Text className="text-xl font-bold text-yellow-500">
              ${vehicleData.pricePerDay}/day
            </Text>
          </View>
        </View>

        {/* Quick Info */}
        <View className="px-3 mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">
            Quick Info
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-blue-500/10 px-4 py-2 rounded-xl">
              <Text className="text-blue-700 dark:text-blue-300">
                {vehicleData.details?.transmission}
              </Text>
            </View>
            <View className="bg-green-500/10 px-4 py-2 rounded-xl">
              <Text className="text-green-700 dark:text-green-300">
                {vehicleData.details?.fuelType}
              </Text>
            </View>
            <View className="bg-red-500/10 px-4 py-2 rounded-xl">
              <Text className="text-red-700 dark:text-red-300">
                {vehicleData.details?.color}
              </Text>
            </View>
            <View className="bg-purple-500/10 px-4 py-2 rounded-xl">
              <Text className="text-purple-700 dark:text-purple-300">
                {vehicleData.details?.licensePlate}
              </Text>
            </View>
          </View>
        </View>

        {/* Availability Status */}
        <View className="px-3 mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">
            Status
          </Text>
          <View className="flex-row items-center space-x-2">
            <View
              className={`px-3 py-1.5 rounded-full ${
                vehicleData.availability?.isAvailable
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <Text
                className={`${
                  vehicleData.availability?.isAvailable
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {vehicleData.availability?.isAvailable
                  ? "Available"
                  : "Not Available"}
              </Text>
            </View>
            <View
              className={`px-3 py-1.5 rounded-full ${
                vehicleData.maintenanceStatus === "Overdue"
                  ? "bg-red-500/20"
                  : vehicleData.maintenanceStatus === "Due Soon"
                  ? "bg-yellow-500/20"
                  : "bg-green-500/20"
              }`}
            >
              <Text
                className={`${
                  vehicleData.maintenanceStatus === "Overdue"
                    ? "text-red-700 dark:text-red-300"
                    : vehicleData.maintenanceStatus === "Due Soon"
                    ? "text-yellow-700 dark:text-yellow-300"
                    : "text-green-700 dark:text-green-300"
                }`}
              >
                Maintenance: {vehicleData.maintenanceStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Vehicle Details */}
        <View className="px-3 mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">
            Vehicle Details
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="speedometer"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Mileage: {vehicleData.details?.mileage.toLocaleString()} km
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="car-info"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                VIN: {vehicleData.details?.vin}
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Capacity: {vehicleData.capacity} persons
              </Text>
            </View>
          </View>
        </View>

        {/* Insurance */}
        <View className="px-3 mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">
            Insurance
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Provider: {vehicleData.details?.insurance?.provider}
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Expires:{" "}
                {new Date(
                  vehicleData.details?.insurance?.expiryDate
                ).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Maintenance */}
        <View className="px-3 mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">
            Maintenance
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="wrench"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Last Service:{" "}
                {new Date(
                  vehicleData.maintenance?.lastService
                ).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Next Service:{" "}
                {new Date(
                  vehicleData.maintenance?.nextService
                ).toLocaleDateString()}
              </Text>
            </View>
            {vehicleData.maintenance?.history?.map(
              (record: any, index: number) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <MaterialCommunityIcons
                    name="history"
                    size={20}
                    color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                  <Text className="text-gray-600 dark:text-gray-300">
                    {new Date(record.date).toLocaleDateString()}:{" "}
                    {record.details}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Features */}
        {vehicleData.features && vehicleData.features.length > 0 && (
          <View className="px-3 mb-6">
            <Text className="text-lg font-semibold mb-3 dark:text-white">
              Features
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {vehicleData.features.map((feature: string, index: number) => (
                <View
                  key={index}
                  className="bg-yellow-500/10 px-3 py-1.5 rounded-full"
                >
                  <Text className="text-yellow-700 dark:text-yellow-300">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rental Terms */}
        <View className="px-3 mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">
            Rental Terms
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Minimum Age: {vehicleData.rentalTerms?.minimumAge}+
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="cash"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Security Deposit: ${vehicleData.rentalTerms?.securityDeposit}
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="road"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Mileage Limit: {vehicleData.rentalTerms?.mileageLimit}km/day
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="account-multiple"
                size={20}
                color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-gray-600 dark:text-gray-300">
                Additional Drivers:{" "}
                {vehicleData.rentalTerms?.additionalDrivers
                  ? "Allowed"
                  : "Not Allowed"}
              </Text>
            </View>
            {vehicleData.rentalTerms?.insuranceOptions?.map(
              (option: any, index: number) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <MaterialCommunityIcons
                    name="shield"
                    size={20}
                    color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                  <Text className="text-gray-600 dark:text-gray-300">
                    {option.name}: ${option.price}/day
                  </Text>
                </View>
              )
            )}
            {vehicleData.rentalTerms?.requiredDocuments.map(
              (doc: string, index: number) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <MaterialCommunityIcons
                    name="file-document"
                    size={20}
                    color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                  <Text className="text-gray-600 dark:text-gray-300">
                    {doc}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Ratings */}
        {vehicleData.ratings && vehicleData.ratings.length > 0 && (
          <View className="px-3 mb-6">
            <Text className="text-lg font-semibold mb-3 dark:text-white">
              Reviews
            </Text>
            {vehicleData.ratings.map((rating: any, index: number) => (
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
                          color={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
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
            ))}
          </View>
        )}

        {/* Policies */}
        {vehicleData.policies && (
          <View className="px-3 mb-6">
            <Text className="text-lg font-semibold mb-3 dark:text-white">
              Policies
            </Text>
            <Text className="text-gray-600 dark:text-gray-300">
              {vehicleData.policies}
            </Text>
          </View>
        )}
      </ScrollView>

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
                ? "Unfavorite"
                : "Favorite"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
