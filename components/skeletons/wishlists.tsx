import { View } from "react-native";
import CustomSkeleton from "../ui/skeleton";

export const WishlistsSkeleton = () => {
  return (
    <View className="space-y-8 p-4">
      {[...Array(2)].map((_, index) => (
        <View key={index} className="">
          <View className="mb-3 w-[45%]">
            <CustomSkeleton width="100%" height={32} radius={8} />
          </View>

          {[...Array(4)].map((_, index) => (
            <View className="flex-row mb-2" key={index}>
              <View className="w-1/4 mr-3">
                <CustomSkeleton width="100%" height={100} radius={12} />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-3">
                  <CustomSkeleton width={"80%"} height={28} radius={8} />
                  <CustomSkeleton width={58} height={28} radius={8} />
                </View>
                <CustomSkeleton width="75%" height={50} radius={10} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};
