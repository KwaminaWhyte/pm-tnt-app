import { View } from "react-native";
import CustomSkeleton from "../ui/skeleton";

export const BookingSkeleton = () => (
  <View className="mb-6 bg-white dark:bg-slate-950 rounded-2xl p-2">
    <CustomSkeleton width="100%" height={200} radius={12} />
    <View className="mt-2">
      <CustomSkeleton width="75%" height={24} radius={8} />
      <View className="flex-row justify-between items-center pt-2">
        <CustomSkeleton width={100} height={20} radius={8} />
        <CustomSkeleton width={80} height={16} radius={8} />
      </View>
    </View>
  </View>
);
