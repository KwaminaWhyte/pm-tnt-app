import { View, Text } from "react-native";

export const HotelSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View className="px-3 mb-6">
      <Text className="font-semibold text-2xl">{title}</Text>

      <View>{children}</View>
    </View>
  );
};
