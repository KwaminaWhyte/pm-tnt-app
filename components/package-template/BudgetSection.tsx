import React from "react";
import { TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";
import { CustomizationsType } from "@/types/package-template";

interface BudgetSectionProps {
  formData: {
    customizations: {
      budget: CustomizationsType["budget"];
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <ThemedView style={styles.formSection}>
      <ThemedText style={styles.sectionTitle}>Budget</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Specify budget preferences and priorities
      </ThemedText>

      {/* Maximum Budget */}
      <ThemedText style={styles.label}>Maximum Budget</ThemedText>
      <TextInput
        style={styles.input}
        value={formData.customizations.budget.maxBudget.toString()}
        onChangeText={(text) => {
          const budget = parseFloat(text) || 0;
          setFormData((prev: any) => ({
            ...prev,
            customizations: {
              ...prev.customizations,
              budget: {
                ...prev.customizations.budget,
                maxBudget: budget,
              },
            },
          }));
        }}
        placeholder="Enter maximum budget"
        placeholderTextColor={Colors.gray[400]}
        keyboardType="numeric"
      />

      {/* Priority Areas */}
      <ThemedText style={styles.label}>Priority Areas</ThemedText>
      <TextInput
        style={styles.input}
        value={formData.customizations.budget.priorityAreas.join(", ")}
        onChangeText={(text) => {
          const areas = text
            .split(",")
            .map((area) => area.trim())
            .filter((area) => area);
          setFormData((prev: any) => ({
            ...prev,
            customizations: {
              ...prev.customizations,
              budget: {
                ...prev.customizations.budget,
                priorityAreas: areas,
              },
            },
          }));
        }}
        placeholder="Accommodation, Activities, Transportation, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Flexible Areas */}
      <ThemedText style={styles.label}>Flexible Areas</ThemedText>
      <TextInput
        style={styles.input}
        value={formData.customizations.budget.flexibleAreas.join(", ")}
        onChangeText={(text) => {
          const areas = text
            .split(",")
            .map((area) => area.trim())
            .filter((area) => area);
          setFormData((prev: any) => ({
            ...prev,
            customizations: {
              ...prev.customizations,
              budget: {
                ...prev.customizations.budget,
                flexibleAreas: areas,
              },
            },
          }));
        }}
        placeholder="Areas where budget can be flexible"
        placeholderTextColor={Colors.gray[400]}
      />
    </ThemedView>
  );
};
