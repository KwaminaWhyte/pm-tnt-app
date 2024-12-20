import React from "react";
import { View, Text, Pressable } from "react-native";
import { Building2, Car, Palmtree } from "lucide-react-native";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: "hotel" | "vehicle" | "package";
}

interface CustomTabsProps {
  tabs: Tab[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
}

const getIcon = (icon: Tab["icon"], isSelected: boolean) => {
  const props = {
    size: 20,
    stroke: isSelected ? "#CA8A04" : "#6B7280",
    strokeWidth: 2,
  };

  switch (icon) {
    case "hotel":
      return <Building2 {...props} />;
    case "vehicle":
      return <Car {...props} />;
    case "package":
      return <Palmtree {...props} />;
  }
};

export function CustomTabs({
  tabs,
  selectedTab,
  onTabChange,
}: CustomTabsProps) {
  return (
    <View className="flex-row bg-gray-50/80 dark:bg-slate-800/50 p-1 rounded-2xl">
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className={cn(
              "flex-1  px-3 rounded-xl flex-row items-center justify-center space-x-2 py-3",
              isSelected && "bg-yellow-500/10 dark:bg-yellow-400/10 shadow-sm"
            )}
          >
            {getIcon(tab.icon, isSelected)}
            <Text
              className={cn(
                "text-sm font-medium",
                isSelected
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-300"
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
