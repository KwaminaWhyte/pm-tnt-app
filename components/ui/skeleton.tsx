import { MotiSkeletonProps } from "moti/build/skeleton/types";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";

export default function CustomSkeleton(props: MotiSkeletonProps | any) {
  const colorScheme = useColorScheme();

  return (
    <Skeleton
      colors={
        colorScheme === "light"
          ? ["#e2e8f0", "#cbd5e1"]
          : ["#1e293b", "#0f172a"]
      }
      {...props}
    />
  );
}
