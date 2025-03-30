import React from "react";
import { TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";
import { CustomizationsType } from "@/types/package-template";

interface ActivitiesSectionProps {
  formData: {
    customizations: {
      activities: Required<CustomizationsType["activities"]>;
    };
  };
  onUpdateActivities: (
    activities: Required<CustomizationsType["activities"]>
  ) => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  formData,
  onUpdateActivities,
}) => {
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
        value={formData.customizations.activities.included.join(", ")}
        onChangeText={(text) => {
          const included = text
            .split(",")
            .map((activity) => activity.trim())
            .filter((activity) => activity);
          onUpdateActivities({
            ...formData.customizations.activities,
            included,
          });
        }}
        placeholder="Sightseeing, Hiking, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Excluded Activities */}
      <ThemedText style={styles.label}>Excluded Activities</ThemedText>
      <TextInput
        style={styles.input}
        value={formData.customizations.activities.excluded.join(", ")}
        onChangeText={(text) => {
          const excluded = text
            .split(",")
            .map((activity) => activity.trim())
            .filter((activity) => activity);
          onUpdateActivities({
            ...formData.customizations.activities,
            excluded,
          });
        }}
        placeholder="Activities to exclude"
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Activity Types */}
      <ThemedText style={styles.label}>Activity Types</ThemedText>
      <TextInput
        style={styles.input}
        value={formData.customizations.activities.preferences.activityTypes.join(
          ", "
        )}
        onChangeText={(text) => {
          const activityTypes = text
            .split(",")
            .map((type) => type.trim())
            .filter((type) => type);
          onUpdateActivities({
            ...formData.customizations.activities,
            preferences: {
              ...formData.customizations.activities.preferences,
              activityTypes,
            },
          });
        }}
        placeholder="Adventure, Cultural, Nature, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Difficulty Levels */}
      <ThemedText style={styles.label}>Difficulty Levels</ThemedText>
      <TextInput
        style={styles.input}
        value={formData.customizations.activities.preferences.difficulty.join(
          ", "
        )}
        onChangeText={(text) => {
          const difficulty = text
            .split(",")
            .map((level) => level.trim())
            .filter((level) => level);
          onUpdateActivities({
            ...formData.customizations.activities,
            preferences: {
              ...formData.customizations.activities.preferences,
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
        value={formData.customizations.activities.preferences.duration.join(
          ", "
        )}
        onChangeText={(text) => {
          const duration = text
            .split(",")
            .map((dur) => dur.trim())
            .filter((dur) => dur);
          onUpdateActivities({
            ...formData.customizations.activities,
            preferences: {
              ...formData.customizations.activities.preferences,
              duration,
            },
          });
        }}
        placeholder="Half-day, Full-day, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Time of Day */}
      <ThemedText style={styles.label}>Time of Day</ThemedText>
      <TextInput
        style={styles.input}
        value={formData.customizations.activities.preferences.timeOfDay.join(
          ", "
        )}
        onChangeText={(text) => {
          const timeOfDay = text
            .split(",")
            .map((time) => time.trim())
            .filter((time) => time);
          onUpdateActivities({
            ...formData.customizations.activities,
            preferences: {
              ...formData.customizations.activities.preferences,
              timeOfDay,
            },
          });
        }}
        placeholder="Morning, Afternoon, Evening"
        placeholderTextColor={Colors.gray[400]}
      />
    </ThemedView>
  );
};
