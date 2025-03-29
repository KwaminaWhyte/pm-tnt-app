import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";

interface AccessibilitySectionProps {
  formData: {
    customizations: {
      accessibility?: {
        wheelchairAccess?: boolean;
        mobilityAssistance?: string[];
        dietaryRestrictions?: string[];
        medicalRequirements?: string[];
      };
    };
  };
  onUpdateAccessibility: (accessibility: any) => void;
}

export const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({
  formData,
  onUpdateAccessibility,
}) => {
  const accessibility = formData.customizations.accessibility || {
    wheelchairAccess: false,
    mobilityAssistance: [],
    dietaryRestrictions: [],
    medicalRequirements: [],
  };

  return (
    <ThemedView style={styles.formSection}>
      <ThemedText style={styles.sectionTitle}>Accessibility</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Specify accessibility requirements and medical needs
      </ThemedText>

      {/* Wheelchair Access */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            accessibility.wheelchairAccess && styles.checkboxActive,
          ]}
          onPress={() => {
            onUpdateAccessibility({
              ...accessibility,
              wheelchairAccess: !accessibility.wheelchairAccess,
            });
          }}
        >
          {accessibility.wheelchairAccess && (
            <ThemedText style={styles.checkmark}>✓</ThemedText>
          )}
        </TouchableOpacity>
        <ThemedText style={styles.checkboxLabel}>
          Wheelchair Access Required
        </ThemedText>
      </View>

      {/* Mobility Assistance */}
      <ThemedText style={styles.label}>Mobility Assistance</ThemedText>
      <TextInput
        style={styles.input}
        value={accessibility.mobilityAssistance?.join(", ")}
        onChangeText={(text) => {
          const mobilityAssistance = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateAccessibility({
            ...accessibility,
            mobilityAssistance,
          });
        }}
        placeholder="Walking aid, Elevator access, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Dietary Restrictions */}
      <ThemedText style={styles.label}>Dietary Restrictions</ThemedText>
      <TextInput
        style={styles.input}
        value={accessibility.dietaryRestrictions?.join(", ")}
        onChangeText={(text) => {
          const dietaryRestrictions = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateAccessibility({
            ...accessibility,
            dietaryRestrictions,
          });
        }}
        placeholder="Allergies, Religious restrictions, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Medical Requirements */}
      <ThemedText style={styles.label}>Medical Requirements</ThemedText>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={accessibility.medicalRequirements?.join("\n")}
        onChangeText={(text) => {
          const medicalRequirements = text.split("\n").filter(Boolean);
          onUpdateAccessibility({
            ...accessibility,
            medicalRequirements,
          });
        }}
        placeholder="List any medical requirements or special needs"
        placeholderTextColor={Colors.gray[400]}
        multiline
        numberOfLines={4}
      />
    </ThemedView>
  );
};
