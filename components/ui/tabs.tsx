import React, { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { ThemedText } from "../ThemedText";

export interface TabProps {
  tabs: {
    label: string;
    icon: ReactNode;
    path: string;
    isActive?: boolean;
  }[];
}
export interface TabItemProps {
  isActive?: boolean;
  icon?: ReactNode;
  label: string;
  path?: string;
  onPress?: () => void;
}

export const CustomTabs: React.FC<TabProps> = ({ tabs }) => {
  return (
    <View className="border-b border-slate-300/30 dark:border-white/10">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            path={tab.path}
            isActive={tab.isActive}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export const TabItem: React.FC<TabItemProps> = ({
  isActive,
  icon,
  label,
  path,
  onPress,
}) => (
  <Pressable className="mr-2 px-1" onPress={onPress} key={label}>
    <View className="flex-row items-center space-x-2 mr-2 ml-1">
      {icon}
      <ThemedText
        className={`"text-sm font-light ${
          isActive ? "text-yellow-500" : "text-slate-500"
        }`}
      >
        {label}
      </ThemedText>
    </View>

    <View className="mt-2" />
    {isActive && (
      <View className="rounded-full h-[2px] w-full bg-yellow-500"></View>
    )}
  </Pressable>
);
