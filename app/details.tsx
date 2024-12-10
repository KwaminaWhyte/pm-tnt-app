import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { fetcher } from "@/data/fetcher";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useGlobalSearchParams } from "expo-router";
import { ScrollView, View } from "moti";
import { useState } from "react";
import { ImageBackground, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";

export default function BookDetails() {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { id } = useGlobalSearchParams();

  const { isLoading, data, error } = useSWR(
    `${baseUrl}/hotels/public/${id}`,
    fetcher()
  );

  if (data) console.log(JSON.stringify(data, null, 2));

  const [selectedImage, setSelectedImage] = useState(
    data?.data?.images[0] || undefined
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ThemedText className="font-semibold text-4xl">Loading...</ThemedText>
        </View>
      )}

      {data && (
        <ScrollView className="flex-1">
          <ImageBackground
            source={{ uri: selectedImage }}
            className="h-56 px-3 py-3"
            resizeMode="cover"
          >
            <View className="flex-row">
              {/* press to go back */}
              <Pressable
                onPress={() => router.back()}
                className="w-8 items-center"
              >
                <FontAwesome6 name="chevron-left" size={24} color="black" />
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
          <View>
            <ThemedText className="font-semibold text-3xl px-3">
              {data?.data?.name}
            </ThemedText>
          </View>

          {/* description */}
          <View>
            <ThemedText className="font-light px-3">
              {data?.data?.description}
            </ThemedText>
          </View>
        </ScrollView>
      )}

      {error && (
        <View className="flex-1 items-center justify-center">
          <ThemedText className="text-red-500 text-3xl">Error</ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}
