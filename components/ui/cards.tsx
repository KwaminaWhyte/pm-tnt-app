import { Href, router } from "expo-router";
import { ReactNode } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { AntDesign } from "@expo/vector-icons";

export const TripPackageCard = ({
  path,
  data,
}: {
  path?: string;
  data?: any;
}) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: path || "trip-details",
          params: { ...data },
        } as Href)
      }
      className="bg-white dark:bg-slate-950 rounded-2xl p-2 mr-3 w-72"
    >
      <Image
        className="h-40 rounded-xl mb-2"
        source={{ uri: data?.images[0] }}
        resizeMode="cover"
      />
      <View>
        <ThemedText className="font-medium text-base">{data?.title}</ThemedText>
        <View className="flex-row justify-between items-center pt-2">
          <ThemedText className="font-semibold text-yellow-500">
            Early bird {data?.price}
          </ThemedText>
          <View className="flex-row items-center space-x-1">
            <AntDesign name="star" size={12} color="black" />
            <Text className="font-semibold text-sm">
              {data?.rating?.average}
            </Text>
            <Text className="text-sm">({data?.rating?.reviews} Reviews)</Text>
          </View>
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
