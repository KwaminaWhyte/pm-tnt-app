import { AnimatePresence, Image, Text, View } from "moti";

import errorIllustration from "@/assets/images/illustrations/warning.png";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

export const ErrorScreen = () => {
  return (
    <AnimatePresence exitBeforeEnter>
      <View className="flex-1 items-center justify-center bg-white dark:bg-red-500/5 -mt-36">
        <Image
          source={errorIllustration}
          className="w-80 h-80"
          resizeMode="contain"
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300 }}
        />
        <Text
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300, delay: 100 }}
          className="-mt-12 mb-1 text-red-500 text-2xl text-center font-bold"
        >
          Error
        </Text>
        <Text
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300, delay: 100 }}
          className="text-center text-gray-600 dark:text-white"
        >
          Something went wrong
        </Text>
        <View
          className="mt-8"
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300, delay: 200 }}
        >
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center space-x-2 px-5 py-2 bg-yellow-500 rounded-xl justify-center"
          >
            <AntDesign name="arrowleft" color={"#020617"} size={20} />
            <Text className="text-slate-950 text-base">Go Back</Text>
          </Pressable>
        </View>
      </View>
    </AnimatePresence>
  );
};
