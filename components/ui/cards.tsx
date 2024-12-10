import { Href, router } from "expo-router";
import { ReactNode } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

export const TripPackageCard = ({
  image,
  title,
  price,
  location,
  path,
  data,
}: {
  image: string;
  title: string;
  price: string;
  location: string;
  path?: string;
  data?: any;
}) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: path || "trip-details",
          params: { title, price, location, ...data },
        } as Href)
      }
      className="bg-white dark:bg-slate-950 rounded-2xl p-2 mr-3 w-72"
    >
      <Image
        className="h-40 rounded-xl mb-2"
        source={{ uri: image }}
        resizeMode="cover"
      />
      <View>
        <ThemedText className="font-medium text-base">{title}</ThemedText>
        <View className="flex-row justify-between items-center pt-2">
          <ThemedText className="font-semibold text-yellow-500">
            Early bird {price}
          </ThemedText>
          <Text className="text-sm font-light">{location}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export const BenefitsCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <View className="flex-row mb-1 py-2 px-2 rounded-2xl bg-white dark:bg-slate-950">
    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/20">
      {icon}
    </View>

    <View className="flex-1 ml-2 ">
      <ThemedText className="font-medium text-base">{title}</ThemedText>
      <ThemedText className="font-light text-xs">{description}</ThemedText>
    </View>
  </View>
);
