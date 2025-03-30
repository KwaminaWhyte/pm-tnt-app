import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";
import { CustomizationsType } from "@/types/package-template";

interface AccessibilitySectionProps {
  formData: {
    customizations: {
      accessibility?: CustomizationsType["accessibility"];
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({
  formData,
  setFormData,
}) => {
  const accessibility = formData.customizations.accessibility || {
    wheelchairAccess: false,
    mobilityAssistance: false,
    dietaryRestrictions: [],
    medicalRequirements: [],
  };

  const updateAccessibility = (
    newAccessibility: CustomizationsType["accessibility"]
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        accessibility: newAccessibility,
      },
    }));
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
            updateAccessibility({
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
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            accessibility.mobilityAssistance && styles.checkboxActive,
          ]}
          onPress={() => {
            updateAccessibility({
              ...accessibility,
              mobilityAssistance: !accessibility.mobilityAssistance,
            });
          }}
        >
          {accessibility.mobilityAssistance && (
            <ThemedText style={styles.checkmark}>✓</ThemedText>
          )}
        </TouchableOpacity>
        <ThemedText style={styles.checkboxLabel}>
          Mobility Assistance Required
        </ThemedText>
      </View>

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
          updateAccessibility({
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
          updateAccessibility({
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
