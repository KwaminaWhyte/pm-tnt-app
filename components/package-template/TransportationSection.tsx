import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";
import { CustomizationsType } from "@/types/package-template";

interface TransportationSectionProps {
  formData: {
    customizations: {
      transportation: CustomizationsType["transportation"];
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const TransportationSection: React.FC<TransportationSectionProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <ThemedView style={styles.formSection}>
      <ThemedText style={styles.sectionTitle}>Transportation</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Specify transportation preferences and requirements
      </ThemedText>

      {/* Transportation Type */}
      <ThemedText style={styles.label}>Transportation Type</ThemedText>
      <View style={styles.buttonContainer}>
        {["None", "Flight", "Train", "Bus", "Private Car"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              formData.customizations.transportation.type === type &&
                styles.buttonActive,
            ]}
            onPress={() => {
              setFormData((prev: any) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    type: type as CustomizationsType["transportation"]["type"],
                  },
                },
              }));
            }}
          >
            <ThemedText
              style={[
                styles.buttonText,
                formData.customizations.transportation.type === type &&
                  styles.buttonTextActive,
              ]}
            >
              {type}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {formData.customizations.transportation.type !== "None" && (
        <>
          {/* Class */}
          <ThemedText style={styles.label}>Class</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.customizations.transportation.preferences.class}
            onChangeText={(text) => {
              setFormData((prev: any) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    preferences: {
                      ...prev.customizations.transportation.preferences,
                      class: text,
                    },
                  },
                },
              }));
            }}
            placeholder="Economy, Business, First Class"
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Seating Preference */}
          <ThemedText style={styles.label}>Seating Preference</ThemedText>
          <TextInput
            style={styles.input}
            value={
              formData.customizations.transportation.preferences
                .seatingPreference
            }
            onChangeText={(text) => {
              setFormData((prev: any) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    preferences: {
                      ...prev.customizations.transportation.preferences,
                      seatingPreference: text,
                    },
                  },
                },
              }));
            }}
            placeholder="Window, Aisle, Extra Legroom"
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Special Assistance */}
          <ThemedText style={styles.label}>Special Assistance</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.customizations.transportation.preferences.specialAssistance.join(
              ", "
            )}
            onChangeText={(text) => {
              const assistance = text
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item);
              setFormData((prev: any) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    preferences: {
                      ...prev.customizations.transportation.preferences,
                      specialAssistance: assistance,
                    },
                  },
                },
              }));
            }}
            placeholder="Wheelchair, Medical assistance, etc."
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Luggage Options */}
          <ThemedText style={styles.label}>Luggage Options</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.customizations.transportation.preferences.luggageOptions.join(
              ", "
            )}
            onChangeText={(text) => {
              const options = text
                .split(",")
                .map((option) => option.trim())
                .filter((option) => option);
              setFormData((prev: any) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    preferences: {
                      ...prev.customizations.transportation.preferences,
                      luggageOptions: options,
                    },
                  },
                },
              }));
            }}
            placeholder="Check-in baggage, Hand carry only, etc."
            placeholderTextColor={Colors.gray[400]}
          />
        </>
      )}
    </ThemedView>
  );
};
