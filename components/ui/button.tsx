import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";

export const Button = ({
  label,
  onClick,
  variant = "solid",
  startIcon,
  endIcon,
  classNames,
  isLoading,
}: {
  label?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "secondary" | undefined;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  classNames?: {
    wrapper?: string;
    label?: string;
  };
  isLoading?: boolean;
}) => {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      className={`h-12 rounded-xl flex-row items-center justify-center px-4 ${
        variant === "solid"
          ? "bg-yellow-500"
          : variant === "outline"
          ? "bg-transparent border-2 border-yellow-500"
          : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
      } ${classNames?.wrapper}`}
      onPress={onClick}
    >
      {isLoading && (
        <View className="mr-2">
          <ActivityIndicator size="small" color={"#fff"} />
        </View>
      )}
      {startIcon && <View className="mr-2">{startIcon}</View>}
      <Text
        className={`font-medium text-base ${
          variant === "solid"
            ? "text-white"
            : variant === "outline"
            ? "text-yellow-500"
            : "text-slate-900 dark:text-white"
        } ${classNames?.label}`}
      >
        {label}
      </Text>
      {endIcon && <View className="ml-2">{endIcon}</View>}
    </Pressable>
  );
};

export const IconButton = ({
  color = "default",
  onClick,
  icon,
  size = "md",
}: {
  color?: "danger" | "primary" | "theme" | "default";
  onClick?: () => void;
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <Pressable
      onPress={onClick}
      className={`${sizeClasses[size]} ${
        color === "danger"
          ? "bg-red-500"
          : color === "primary"
          ? "bg-blue-500"
          : color === "theme"
          ? "bg-yellow-500"
          : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
      } rounded-xl items-center justify-center`}
    >
      {icon}
    </Pressable>
  );
};
