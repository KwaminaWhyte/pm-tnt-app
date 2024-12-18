import { View, Text, Pressable } from "react-native";
import { Image } from "moti";
import { router } from "expo-router";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type VehicleCardProps = {
  item: {
    _id: string;
    vehicleType?: string;
    make?: string;
    model?: string;
    year?: number;
    pricePerDay?: number;
    images?: string[];
    features?: string[];
    details?: {
      transmission?: string;
      fuelType?: string;
    };
    availability?: {
      isAvailable?: boolean;
    };
    averageRating?: number;
  };
};

export const VehicleListingCard = ({ item }: VehicleCardProps) => {
  if (!item) return null;

  return (
    <Pressable
      onPress={() => router.push({
        pathname: "/vehicle-details",
        params: { vehicle: JSON.stringify(item) }
      })}
      className="flex-row mb-3 bg-white dark:bg-slate-900 p-3 rounded-2xl"
    >
      {item.images?.[0] && (
        <Image
          source={{ uri: item.images[0] }}
          className="w-24 h-24 rounded-xl"
          resizeMode="cover"
        />
      )}

      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="font-semibold text-lg dark:text-white"
            numberOfLines={1}
          >
            {item.make} {item.model}
          </Text>
          <Text className="font-semibold text-yellow-500">
            ${item.pricePerDay}/day
          </Text>
        </View>

        <Text
          className="text-xs text-gray-500 dark:text-gray-400 mb-2"
          numberOfLines={2}
        >
          {item.year} {item.details?.transmission ? `• ${item.details.transmission}` : ''} {item.details?.fuelType ? `• ${item.details.fuelType}` : ''}
        </Text>

        <View className="flex-row items-center space-x-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons 
              name="car" 
              size={14} 
              color={item.availability?.isAvailable ? "#22c55e" : "#888"} 
            />
            <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              {item.availability?.isAvailable ? "Available" : "Unavailable"}
            </Text>
          </View>

          {item.averageRating && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="star"
                size={14}
                color="#facc15"
              />
              <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                {item.averageRating.toFixed(1)}
              </Text>
            </View>
          )}

          {item.features && item.features.length > 0 && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="feature-search"
                size={14}
                color="#888"
              />
              <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                {item.features.slice(0, 2).join(", ")}
                {item.features.length > 2 ? "..." : ""}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
