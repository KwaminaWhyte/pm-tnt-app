import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const StarRating = ({
  stars,
  reviewCount,
}: {
  stars: number;
  reviewCount?: number;
}) => {
  return (
    <View className="flex-row items-center space-x-1">
      <AntDesign name="star" size={12} color="#F5A524" />
      <Text className="font-semibold text-sm">{stars}</Text>
      {reviewCount && <Text className="text-sm">({reviewCount} Reviews)</Text>}
    </View>
  );
};
