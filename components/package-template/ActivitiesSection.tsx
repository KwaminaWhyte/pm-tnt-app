import React from "react";
import { View, TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";

interface ActivitiesSectionProps {
  formData: {
    customizations: {
      activities?: {
        included?: string[];
        excluded?: string[];
        preferences?: {
          difficulty?: string[];
          duration?: string[];
          type?: string[];
          timeOfDay?: string[];
        };
      };
    };
  };
  onUpdateActivities: (activities: any) => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  formData,
  onUpdateActivities,
}) => {
  const activities = formData.customizations.activities || {
    included: [],
    excluded: [],
    preferences: {
      difficulty: [],
      duration: [],
      type: [],
      timeOfDay: [],
    },
  };

  return (
    <ThemedView style={styles.formSection}>
      <ThemedText style={styles.sectionTitle}>Activities</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Specify activity preferences and requirements
      </ThemedText>

      {/* Included Activities */}
      <ThemedText style={styles.label}>Included Activities</ThemedText>
      <TextInput
        style={styles.input}
        value={activities.included?.join(", ")}
        onChangeText={(text) => {
          const included = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateActivities({
            ...activities,
            included,
          });
        }}
        placeholder="Sightseeing, Hiking, Swimming, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Excluded Activities */}
      <ThemedText style={styles.label}>Excluded Activities</ThemedText>
      <TextInput
        style={styles.input}
        value={activities.excluded?.join(", ")}
        onChangeText={(text) => {
          const excluded = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateActivities({
            ...activities,
            excluded,
          });
        }}
        placeholder="Activities to exclude from the package"
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Difficulty Preferences */}
      <ThemedText style={styles.label}>Difficulty Level Preferences</ThemedText>
      <TextInput
        style={styles.input}
        value={activities.preferences?.difficulty?.join(", ")}
        onChangeText={(text) => {
          const difficulty = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateActivities({
            ...activities,
            preferences: {
              ...activities.preferences,
              difficulty,
            },
          });
        }}
        placeholder="Easy, Moderate, Challenging"
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Duration Preferences */}
      <ThemedText style={styles.label}>Duration Preferences</ThemedText>
      <TextInput
        style={styles.input}
        value={activities.preferences?.duration?.join(", ")}
        onChangeText={(text) => {
          const duration = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateActivities({
            ...activities,
            preferences: {
              ...activities.preferences,
              duration,
            },
          });
        }}
        placeholder="Half-day, Full-day, Multi-day"
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Activity Types */}
      <ThemedText style={styles.label}>Activity Types</ThemedText>
      <TextInput
        style={styles.input}
        value={activities.preferences?.type?.join(", ")}
        onChangeText={(text) => {
          const types = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateActivities({
            ...activities,
            preferences: {
              ...activities.preferences,
              type: types,
            },
          });
        }}
        placeholder="Adventure, Cultural, Relaxation, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Time of Day Preferences */}
      <ThemedText style={styles.label}>Time of Day Preferences</ThemedText>
      <TextInput
        style={styles.input}
        value={activities.preferences?.timeOfDay?.join(", ")}
        onChangeText={(text) => {
          const times = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateActivities({
            ...activities,
            preferences: {
              ...activities.preferences,
              timeOfDay: times,
            },
          });
        }}
        placeholder="Morning, Afternoon, Evening"
        placeholderTextColor={Colors.gray[400]}
      />
    </ThemedView>
  );
};
