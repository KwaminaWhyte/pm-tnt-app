import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles";

type MealType = "breakfast" | "lunch" | "dinner";

interface MealsSectionProps {
  formData: {
    customizations: {
      meals?: {
        included?: {
          breakfast?: boolean;
          lunch?: boolean;
          dinner?: boolean;
        };
        preferences?: {
          dietary?: string[];
          cuisine?: string[];
          mealTimes?: {
            breakfast?: string;
            lunch?: string;
            dinner?: string;
          };
        };
      };
    };
  };
  onUpdateMeals: (meals: any) => void;
}

export const MealsSection: React.FC<MealsSectionProps> = ({
  formData,
  onUpdateMeals,
}) => {
  const meals = formData.customizations.meals || {
    included: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
    preferences: {
      dietary: [],
      cuisine: [],
      mealTimes: {
        breakfast: "",
        lunch: "",
        dinner: "",
      },
    },
  };

  const mealOptions: Array<{ key: MealType; label: string }> = [
    { key: "breakfast", label: "Breakfast" },
    { key: "lunch", label: "Lunch" },
    { key: "dinner", label: "Dinner" },
  ];

  return (
    <ThemedView style={styles.formSection}>
      <ThemedText style={styles.sectionTitle}>Meals</ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Specify meal preferences and dietary requirements
      </ThemedText>

      {/* Included Meals */}
      <ThemedText style={styles.label}>Included Meals</ThemedText>
      <View style={styles.buttonContainer}>
        {mealOptions.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.button,
              meals.included?.[key] && styles.buttonActive,
            ]}
            onPress={() => {
              onUpdateMeals({
                ...meals,
                included: {
                  ...meals.included,
                  [key]: !meals.included?.[key],
                },
              });
            }}
          >
            <ThemedText
              style={[
                styles.buttonText,
                meals.included?.[key] && styles.buttonTextActive,
              ]}
            >
              {label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dietary Preferences */}
      <ThemedText style={styles.label}>Dietary Preferences</ThemedText>
      <TextInput
        style={styles.input}
        value={meals.preferences?.dietary?.join(", ")}
        onChangeText={(text) => {
          const dietary = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateMeals({
            ...meals,
            preferences: {
              ...meals.preferences,
              dietary,
            },
          });
        }}
        placeholder="Vegetarian, Vegan, Gluten-free, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Cuisine Preferences */}
      <ThemedText style={styles.label}>Cuisine Preferences</ThemedText>
      <TextInput
        style={styles.input}
        value={meals.preferences?.cuisine?.join(", ")}
        onChangeText={(text) => {
          const cuisine = text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          onUpdateMeals({
            ...meals,
            preferences: {
              ...meals.preferences,
              cuisine,
            },
          });
        }}
        placeholder="Italian, Japanese, Local, etc."
        placeholderTextColor={Colors.gray[400]}
      />

      {/* Meal Times */}
      {mealOptions.map(({ key, label }) => (
        <React.Fragment key={key}>
          <ThemedText style={styles.label}>{label} Time</ThemedText>
          <TextInput
            style={styles.input}
            value={meals.preferences?.mealTimes?.[key]}
            onChangeText={(text) => {
              onUpdateMeals({
                ...meals,
                preferences: {
                  ...meals.preferences,
                  mealTimes: {
                    ...meals.preferences?.mealTimes,
                    [key]: text,
                  },
                },
              });
            }}
            placeholder={`Preferred time for ${label.toLowerCase()}`}
            placeholderTextColor={Colors.gray[400]}
          />
        </React.Fragment>
      ))}
    </ThemedView>
  );
};
