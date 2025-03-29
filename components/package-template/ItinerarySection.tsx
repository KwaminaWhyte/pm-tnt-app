import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";

type PaceType = "relaxed" | "moderate" | "fast";

interface ItinerarySectionProps {
  formData: {
    customizations: {
      itinerary?: {
        pace?: PaceType;
        flexibility?: string;
        focusAreas?: string[];
        dayRequirements?: string[];
      };
    };
  };
  onUpdateItinerary: (itinerary: any) => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  formData,
  onUpdateItinerary,
}) => {
  const itinerary = formData.customizations.itinerary || {
    pace: "moderate",
    flexibility: "",
    focusAreas: [],
    dayRequirements: [],
  };

  const paceOptions: Array<{ key: PaceType; label: string }> = [
    { key: "relaxed", label: "Relaxed" },
    { key: "moderate", label: "Moderate" },
    { key: "fast", label: "Fast" },
  ];

  return (
    <ThemedView style={styles.formSection}>
      <ThemedText style={styles.sectionTitle}>Itinerary</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Customize your travel schedule and preferences
      </ThemedText>

      {/* Pace Selection */}
      <ThemedText style={styles.label}>Preferred Pace</ThemedText>
      <View style={styles.buttonContainer}>
        {paceOptions.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.button,
              itinerary.pace === key && styles.buttonActive,
            ]}
            onPress={() => {
              onUpdateItinerary({
                ...itinerary,
                pace: key,
              });
            }}
          >
            <ThemedText
              style={[
                styles.buttonText,
                itinerary.pace === key && styles.buttonTextActive,
              ]}
            >
              {label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Schedule Flexibility */}
      <ThemedText style={styles.label}>Schedule Flexibility</ThemedText>
      <TextInput
        style={styles.input}
        value={itinerary.flexibility}
        onChangeText={(text) => {
          onUpdateItinerary({
            ...itinerary,
            flexibility: text,
          });
        }}
        placeholder="e.g., Flexible with morning activities, fixed dinner times"
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Focus Areas */}
      <ThemedText style={styles.label}>Focus Areas</ThemedText>
      <TextInput
        style={styles.input}
        value={itinerary.focusAreas?.join(", ")}
        onChangeText={(text) => {
          const focusAreas = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateItinerary({
            ...itinerary,
            focusAreas,
          });
        }}
        placeholder="Cultural sites, Nature, Adventure, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Day Requirements */}
      <ThemedText style={styles.label}>Day Requirements</ThemedText>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={itinerary.dayRequirements?.join("\n")}
        onChangeText={(text) => {
          const dayRequirements = text.split("\n").filter(Boolean);
          onUpdateItinerary({
            ...itinerary,
            dayRequirements,
          });
        }}
        placeholder="Enter specific requirements for each day"
        placeholderTextColor={Colors.gray[400]}
        multiline
        numberOfLines={4}
      />
    </ThemedView>
  );
};
