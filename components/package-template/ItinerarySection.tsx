import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";
import { PaceType, FlexibilityType } from "@/types/package-template";

interface ItinerarySectionProps {
  formData: {
    customizations: {
      itinerary?: {
        pace?: PaceType;
        flexibility?: FlexibilityType;
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
    pace: "Moderate",
    flexibility: "Flexible",
    focusAreas: [],
    dayRequirements: [],
  };

  const paceOptions: Array<{ key: PaceType; label: string }> = [
    { key: "Relaxed", label: "Relaxed" },
    { key: "Moderate", label: "Moderate" },
    { key: "Fast", label: "Fast" },
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
      <View style={styles.buttonContainer}>
        {[
          { key: "Fixed", label: "Fixed" },
          { key: "Flexible", label: "Flexible" },
          { key: "Very Flexible", label: "Very Flexible" },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.button,
              itinerary.flexibility === key && styles.buttonActive,
            ]}
            onPress={() => {
              onUpdateItinerary({
                ...itinerary,
                flexibility: key,
              });
            }}
          >
            <ThemedText
              style={[
                styles.buttonText,
                itinerary.flexibility === key && styles.buttonTextActive,
              ]}
            >
              {label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

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
