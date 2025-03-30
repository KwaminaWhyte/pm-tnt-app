import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  ImageBackground,
  Image,
  ActivityIndicator,
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
import { useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BASE_URL,
  checkFavorite,
  toggleFavorite,
  getVehicleById,
} from "@/data/api";
import { ThemedText } from "@/components/ThemedText";

export default function VehicleDetails() {
  const { auth } = useAuth();
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [favIsLoading, setFavIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [vehicleData, setVehicleData] = useState<any>(null);

  // Fetch vehicle data using ID
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setIsLoading(true);
        const response = await getVehicleById(id as string, auth?.token);

        setVehicleData(response.data.vehicle);

        if (response.data?.images?.[0]) {
          setSelectedImage(response.data.images[0]);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        toast.show("Failed to load vehicle details", { type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [id]);

  const checkIfAddedToFavorite = async () => {
    try {
      if (!auth?.token || !vehicleData?._id) return;
      const response = await checkFavorite(
        vehicleData._id,
        "vehicle",
        auth.token
      );
      setIsFavorite(response.data?.isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (vehicleData?._id) {
      checkIfAddedToFavorite();
    }
  }, [vehicleData]);

  const handleAddToFavorite = async () => {
    setFavIsLoading(true);
    try {
      if (!auth?.token) {
        toast.show("Please login to add to favourites!", { type: "warning" });
        return;
      }

      await toggleFavorite(vehicleData._id, "vehicle", auth.token);
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
    Linking.openURL(`tel:${vehicleData?.contactInfo?.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${vehicleData?.contactInfo?.email}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-200/20 dark:bg-slate-900">
        <ActivityIndicator size="large" color="#eab308" />
        <ThemedText className="mt-4">Loading vehicle details...</ThemedText>
      </SafeAreaView>
    );
  }

  if (!vehicleData) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-200/20 dark:bg-slate-900">
        <MaterialCommunityIcons
          name="car-off"
          size={64}
          color={colorScheme === "dark" ? "#94a3b8" : "#64748b"}
        />
        <ThemedText className="mt-4 text-lg">Vehicle not found</ThemedText>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-yellow-500 px-6 py-3 rounded-xl"
        >
          <ThemedText className="text-white font-semibold">Go Back</ThemedText>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-200/20 dark:bg-slate-900">
      <ScrollView className="flex-1">
        {/* Main Image */}
        <ImageBackground
          source={{ uri: selectedImage || vehicleData?.images?.[0] }}
          className="h-60"
          resizeMode="cover"
        >
          <View className="flex-row justify-between h-full bg-black/20 px-3 py-3">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center flex-row flex bg-white/80 rounded-full"
            >
              <FontAwesome6 name="chevron-left" size={18} color="#eab308" />
            </Pressable>

            {/* Favorite Button on top right */}
            <Pressable
              onPress={handleAddToFavorite}
              disabled={favIsLoading}
              className="w-10 h-10 items-center justify-center flex-row flex bg-white/80 rounded-full"
            >
              {favIsLoading ? (
                <ActivityIndicator size="small" color="#eab308" />
              ) : (
                <MaterialCommunityIcons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={isFavorite ? "#ef4444" : "#64748b"}
                />
              )}
            </Pressable>
          </View>
        </ImageBackground>

        {/* Image Gallery */}
        {vehicleData.images?.length > 1 && (
          <ScrollView
            horizontal
            className="px-3 py-3"
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
          >
            {vehicleData.images.map((image: string, index: number) => (
              <Pressable
                key={index}
                onPress={() => setSelectedImage(image)}
                className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
                  selectedImage === image
                    ? "border-yellow-500"
                    : "border-transparent"
                }`}
              >
                <ImageBackground
                  source={{ uri: image }}
                  className="h-full w-full"
                  resizeMode="cover"
                >
                  {selectedImage !== image && (
                    <View className="w-full h-full bg-slate-300/40 dark:bg-slate-700/40" />
                  )}
                </ImageBackground>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Title and Price */}
        <View className="my-4">
          <ThemedText type="title" className="px-3">
            {vehicleData.make} {vehicleData.model}
          </ThemedText>
          <View className="flex-row items-center justify-between px-3 pt-2">
            <ThemedText className="text-slate-600 dark:text-slate-300 text-lg">
              {vehicleData.year} • {vehicleData.vehicleType}
            </ThemedText>
            <ThemedText className="text-xl font-bold text-yellow-500">
              ${vehicleData.pricePerDay}/day
            </ThemedText>
          </View>
        </View>

        {/* Availability Badge */}
        <View className="px-3 mb-4">
          <View
            className={`px-4 py-2 rounded-xl ${
              vehicleData.availability?.isAvailable
                ? "bg-green-500/10"
                : "bg-red-500/10"
            } self-start`}
          >
            <ThemedText
              className={`${
                vehicleData.availability?.isAvailable
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              } font-medium`}
            >
              <MaterialCommunityIcons
                name={
                  vehicleData.availability?.isAvailable
                    ? "check-circle"
                    : "close-circle"
                }
                size={16}
              />{" "}
              {vehicleData.availability?.isAvailable
                ? "Available Now"
                : "Not Available"}
            </ThemedText>
          </View>
        </View>

        {/* Quick Info */}
        <View className="px-3 mb-6">
          <ThemedText className="text-lg font-semibold mb-3">
            Quick Info
          </ThemedText>
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-blue-500/10 px-4 py-2 rounded-xl">
              <ThemedText className="text-blue-700 dark:text-blue-300">
                <MaterialCommunityIcons name="car-shift-pattern" size={16} />{" "}
                {vehicleData.details?.transmission || "N/A"}
              </ThemedText>
            </View>
            <View className="bg-green-500/10 px-4 py-2 rounded-xl">
              <ThemedText className="text-green-700 dark:text-green-300">
                <MaterialCommunityIcons name="gas-station" size={16} />{" "}
                {vehicleData.details?.fuelType || "N/A"}
              </ThemedText>
            </View>
            <View className="bg-red-500/10 px-4 py-2 rounded-xl">
              <ThemedText className="text-red-700 dark:text-red-300">
                <MaterialCommunityIcons name="palette" size={16} />{" "}
                {vehicleData.details?.color || "N/A"}
              </ThemedText>
            </View>
            <View className="bg-purple-500/10 px-4 py-2 rounded-xl">
              <ThemedText className="text-purple-700 dark:text-purple-300">
                <MaterialCommunityIcons name="car-info" size={16} />{" "}
                {vehicleData.details?.licensePlate || "N/A"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Location */}
        {vehicleData.availability?.location && (
          <View className="px-3 mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Location
            </ThemedText>
            <View className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl flex-row items-center">
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color="#eab308"
              />
              <ThemedText className="ml-2">
                {vehicleData.availability.location.address || ""},{" "}
                {vehicleData.availability.location.city},{" "}
                {vehicleData.availability.location.country}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Vehicle Details */}
        <View className="px-3 mb-6">
          <ThemedText className="text-lg font-semibold mb-3">
            Vehicle Details
          </ThemedText>
          <View className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="speedometer"
                size={20}
                color="#eab308"
              />
              <ThemedText className="text-gray-600 dark:text-gray-300">
                Mileage:{" "}
                {vehicleData.details?.mileage?.toLocaleString() || "N/A"} km
              </ThemedText>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="car-info"
                size={20}
                color="#eab308"
              />
              <ThemedText className="text-gray-600 dark:text-gray-300">
                VIN: {vehicleData.details?.vin || "N/A"}
              </ThemedText>
            </View>
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color="#eab308"
              />
              <ThemedText className="text-gray-600 dark:text-gray-300">
                Capacity: {vehicleData.capacity || "N/A"} persons
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Insurance */}
        {vehicleData.details?.insurance && (
          <View className="px-3 mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Insurance
            </ThemedText>
            <View className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="shield-check"
                  size={20}
                  color="#eab308"
                />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Provider: {vehicleData.details?.insurance?.provider || "N/A"}
                </ThemedText>
              </View>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#eab308"
                />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Expires:{" "}
                  {vehicleData.details?.insurance?.expiryDate
                    ? new Date(
                        vehicleData.details.insurance.expiryDate
                      ).toLocaleDateString()
                    : "N/A"}
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Maintenance */}
        {vehicleData.maintenance && (
          <View className="px-3 mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Maintenance
            </ThemedText>
            <View className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="wrench"
                  size={20}
                  color="#eab308"
                />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Last Service:{" "}
                  {vehicleData.maintenance?.lastService
                    ? new Date(
                        vehicleData.maintenance.lastService
                      ).toLocaleDateString()
                    : "N/A"}
                </ThemedText>
              </View>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={20}
                  color="#eab308"
                />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Next Service:{" "}
                  {vehicleData.maintenance?.nextService
                    ? new Date(
                        vehicleData.maintenance.nextService
                      ).toLocaleDateString()
                    : "N/A"}
                </ThemedText>
              </View>
              {vehicleData.maintenance?.history?.map(
                (record: any, index: number) => (
                  <View key={index} className="flex-row items-center space-x-2">
                    <MaterialCommunityIcons
                      name="history"
                      size={20}
                      color="#eab308"
                    />
                    <ThemedText className="text-gray-600 dark:text-gray-300">
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "N/A"}
                      : {record.details}
                    </ThemedText>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {/* Features */}
        {vehicleData.features && vehicleData.features.length > 0 && (
          <View className="px-3 mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Features
            </ThemedText>
            <View className="flex-row flex-wrap gap-2">
              {vehicleData.features.map((feature: string, index: number) => (
                <View
                  key={index}
                  className="bg-yellow-500/10 px-3 py-1.5 rounded-full"
                >
                  <ThemedText className="text-yellow-700 dark:text-yellow-300">
                    {feature}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rental Terms */}
        {vehicleData.rentalTerms && (
          <View className="px-3 mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Rental Terms
            </ThemedText>
            <View className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  color="#eab308"
                />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Minimum Age: {vehicleData.rentalTerms?.minimumAge || "N/A"}+
                </ThemedText>
              </View>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons name="cash" size={20} color="#eab308" />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Security Deposit: $
                  {vehicleData.rentalTerms?.securityDeposit || "N/A"}
                </ThemedText>
              </View>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons name="road" size={20} color="#eab308" />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Mileage Limit:{" "}
                  {vehicleData.rentalTerms?.mileageLimit || "Unlimited"}km/day
                </ThemedText>
              </View>
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="account-multiple"
                  size={20}
                  color="#eab308"
                />
                <ThemedText className="text-gray-600 dark:text-gray-300">
                  Additional Drivers:{" "}
                  {vehicleData.rentalTerms?.additionalDrivers
                    ? "Allowed"
                    : "Not Allowed"}
                </ThemedText>
              </View>
              {vehicleData.rentalTerms?.insuranceOptions?.map(
                (option: any, index: number) => (
                  <View key={index} className="flex-row items-center space-x-2">
                    <MaterialCommunityIcons
                      name="shield"
                      size={20}
                      color="#eab308"
                    />
                    <ThemedText className="text-gray-600 dark:text-gray-300">
                      {option.name}: ${option.price}/day
                    </ThemedText>
                  </View>
                )
              )}
              {vehicleData.rentalTerms?.requiredDocuments &&
                vehicleData.rentalTerms.requiredDocuments.map(
                  (doc: string, index: number) => (
                    <View
                      key={index}
                      className="flex-row items-center space-x-2"
                    >
                      <MaterialCommunityIcons
                        name="file-document"
                        size={20}
                        color="#eab308"
                      />
                      <ThemedText className="text-gray-600 dark:text-gray-300">
                        {doc}
                      </ThemedText>
                    </View>
                  )
                )}
            </View>
          </View>
        )}

        {/* Policies */}
        {vehicleData.policies && (
          <View className="px-3 mb-12">
            <ThemedText className="text-lg font-semibold mb-3">
              Policies
            </ThemedText>
            <ThemedText className="text-gray-600 dark:text-gray-300">
              {vehicleData.policies}
            </ThemedText>
          </View>
        )}

        {/* Ratings */}
        {vehicleData.ratings && vehicleData.ratings.length > 0 && (
          <View className="px-3 mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Reviews
            </ThemedText>
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
                      <ThemedText className="font-medium">
                        {rating.user}
                      </ThemedText>
                      <Text className="text-gray-500 text-sm">
                        {rating.createdAt
                          ? new Date(rating.createdAt).toLocaleDateString()
                          : "N/A"}
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
                <ThemedText className="text-gray-600 dark:text-gray-300 mt-2">
                  {rating.review}
                </ThemedText>
              </View>
            ))}
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
            onPress={() =>
              router.push(`/book-vehicle?id=${vehicleData._id}` as any)
            }
            className="bg-yellow-500 px-6 py-3 rounded-xl"
          >
            <ThemedText className="text-white font-semibold">
              Book Now
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
