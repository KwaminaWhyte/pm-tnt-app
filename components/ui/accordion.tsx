import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

export const AccordionItem = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-8">
      {/* Header */}
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Text className="text-xl font-semibold text-slate-700 dark:text-white">
          {title}
        </Text>

        {/* Animated Chevron Icon */}
        <MotiView
          from={{ rotate: "0deg" }}
          animate={{ rotate: isOpen ? "90deg" : "0deg" }}
          transition={{ type: "timing", duration: 300 }}
        >
          <Ionicons name="chevron-forward" size={20} color="black" />
        </MotiView>
      </Pressable>

      {/* Animated Content */}
      <MotiView
        from={{
          height: 0,
          opacity: 0,
        }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          type: "timing",
          duration: 300,
        }}
        style={{
          overflow: "hidden",
          paddingVertical: isOpen ? 10 : 0,
        }}
      >
        <Text className="font-light text-sm dark:text-white">{content}</Text>
      </MotiView>
    </View>
  );
};
