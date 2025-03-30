import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import {
  getPackages,
  createPackageTemplate,
  PackageTemplateData,
} from "@/data/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import PackageSelector from "@/components/PackageSelector";
import { Input } from "@/components/ui/input";
import { ActivitiesSection } from "@/components/package-template/ActivitiesSection";
import { MealsSection } from "@/components/package-template/MealsSection";
import { ItinerarySection } from "@/components/package-template/ItinerarySection";
import { AccessibilitySection } from "@/components/package-template/AccessibilitySection";
import { TransportationSection } from "@/components/package-template/TransportationSection";
import { BudgetSection } from "@/components/package-template/BudgetSection";
import {
  PackageType,
  CustomizationsType,
  FormData as PackageFormData,
  PaceType,
  FlexibilityType,
  ActivitiesType,
} from "@/types/package-template";

interface FormData {
  name: string;
  description: string;
  basePackageId: string;
  customizations: Required<CustomizationsType>;
  isPublic: boolean;
  tags: string[];
}

const defaultCustomizations: Required<CustomizationsType> = {
  accommodations: {
    hotelIds: [],
    preferences: {
      roomTypes: [],
      amenities: [],
      boardBasis: [],
      location: [],
    },
  },
  transportation: {
    type: "None",
    preferences: {
      types: [],
      class: "",
      specialRequirements: [],
      seatingPreference: "",
      specialAssistance: [],
      luggageOptions: [],
    },
  },
  budget: {
    maxBudget: 0,
    priorityAreas: [],
    flexibleAreas: [],
  },
  activities: {
    included: [],
    excluded: [],
    preferences: {
      difficulty: [],
      duration: [],
      activityTypes: [],
      timeOfDay: [],
    },
  },
  meals: {
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
  },
  itinerary: {
    pace: "Moderate",
    flexibility: "Flexible",
    focusAreas: [],
    dayRequirements: [],
  },
  accessibility: {
    wheelchairAccess: false,
    mobilityAssistance: false,
    dietaryRestrictions: [],
    medicalRequirements: [],
  },
};

const defaultFormData: FormData = {
  name: "",
  description: "",
  basePackageId: "",
  customizations: defaultCustomizations,
  isPublic: false,
  tags: [],
};

export default function CreatePackageTemplate() {
  const { auth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await getPackages(auth?.token);
        const activePackages = response.data.data?.filter(
          (pkg: any) => pkg.status === "Active"
        );
        setPackages(activePackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
        Toast.show({
          type: "error",
          text1: "Failed to load packages",
          text2: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchPackages();
    }
  }, [auth?.token]);

  const handleSelectPackage = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setFormData((prev) => ({
      ...prev,
      basePackageId: pkg._id,
    }));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.basePackageId) {
      Toast.show({
        type: "error",
        text1: "Missing required fields",
        text2: "Please provide a name and select a base package",
      });
      return;
    }

    try {
      setSubmitting(true);
      const templateData: PackageTemplateData = {
        name: formData.name,
        description: formData.description,
        basePackageId: formData.basePackageId,
        customizations: formData.customizations,
        isPublic: formData.isPublic,
        tags: formData.tags,
      };
      const response = await createPackageTemplate(templateData, auth?.token);

      Toast.show({
        type: "success",
        text1: "Template created successfully",
        text2: "You can now customize it further",
      });

      router.push(`/package-template/${response._id}`);
    } catch (error: any) {
      console.error("Error creating package template:", error);
      Toast.show({
        type: "error",
        text1: "Failed to create template",
        text2: error.message || "Please try again later",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdateActivities = (activities: ActivitiesType) => {
    setFormData((prev) => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        activities,
      },
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Create Package Template",
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || !formData.name || !formData.basePackageId}
              style={[
                styles.submitButton,
                (!formData.name || !formData.basePackageId) &&
                  styles.disabledButton,
              ]}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <ThemedText style={styles.submitButtonText}>Create</ThemedText>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>

          <ThemedText style={styles.label}>Template Name *</ThemedText>
          <Input
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Enter a name for your custom package"
          />

          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            placeholder="Describe your custom package"
            placeholderTextColor={Colors.gray[400]}
            multiline
            numberOfLines={4}
          />

          <ThemedText style={styles.label}>Tags (comma separated)</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.tags.join(", ")}
            onChangeText={(text) =>
              handleInputChange(
                "tags",
                text
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag)
              )
            }
            placeholder="family, beach, adventure"
            placeholderTextColor={Colors.gray[400]}
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => handleInputChange("isPublic", !formData.isPublic)}
            >
              {formData.isPublic ? (
                <Ionicons name="checkbox" size={24} color={Colors.primary} />
              ) : (
                <Ionicons
                  name="square-outline"
                  size={24}
                  color={Colors.gray[400]}
                />
              )}
            </TouchableOpacity>
            <ThemedText style={styles.checkboxLabel}>
              Make this template visible to other users
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>
            Select Base Package *
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Choose a package to customize. Your template will inherit all
            properties from this package.
          </ThemedText>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.loader}
            />
          ) : packages.length > 0 ? (
            <PackageSelector
              packages={packages}
              selectedPackage={selectedPackage}
              onSelectPackage={handleSelectPackage}
            />
          ) : (
            <ThemedView style={styles.emptyState}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={Colors.gray[400]}
              />
              <ThemedText style={styles.emptyStateText}>
                No packages available
              </ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                There are no active packages to base your template on
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Accommodations Section */}
        <ThemedView style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Accommodations</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Specify accommodation preferences for this package template
          </ThemedText>

          {/* Room Types */}
          <ThemedText style={styles.label}>Room Types</ThemedText>
          <TextInput
            style={styles.input}
            value={(
              formData.customizations.accommodations?.preferences?.roomTypes ||
              []
            ).join(", ")}
            onChangeText={(text) => {
              const roomTypes = text
                .split(",")
                .map((type) => type.trim())
                .filter((type) => type);
              setFormData((prev) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  accommodations: {
                    ...prev.customizations.accommodations,
                    preferences: {
                      ...prev.customizations.accommodations?.preferences,
                      roomTypes,
                    },
                  },
                },
              }));
            }}
            placeholder="Single, Double, Suite, etc."
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Amenities */}
          <ThemedText style={styles.label}>Amenities</ThemedText>
          <TextInput
            style={styles.input}
            value={(
              formData.customizations.accommodations?.preferences?.amenities ||
              []
            ).join(", ")}
            onChangeText={(text) => {
              const amenities = text
                .split(",")
                .map((amenity) => amenity.trim())
                .filter((amenity) => amenity);
              setFormData((prev) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  accommodations: {
                    ...prev.customizations.accommodations,
                    preferences: {
                      ...prev.customizations.accommodations?.preferences,
                      amenities,
                    },
                  },
                },
              }));
            }}
            placeholder="WiFi, Pool, Gym, etc."
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Board Basis */}
          <ThemedText style={styles.label}>Board Basis</ThemedText>
          <TextInput
            style={styles.input}
            value={(
              formData.customizations.accommodations?.preferences?.boardBasis ||
              []
            ).join(", ")}
            onChangeText={(text) => {
              const boardBasis = text
                .split(",")
                .map((basis) => basis.trim())
                .filter((basis) => basis);
              setFormData((prev) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  accommodations: {
                    ...prev.customizations.accommodations,
                    preferences: {
                      ...prev.customizations.accommodations?.preferences,
                      boardBasis,
                    },
                  },
                },
              }));
            }}
            placeholder="Room Only, Bed & Breakfast, Half Board, etc."
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Location Preferences */}
          <ThemedText style={styles.label}>Location Preferences</ThemedText>
          <TextInput
            style={styles.input}
            value={(
              formData.customizations.accommodations?.preferences?.location ||
              []
            ).join(", ")}
            onChangeText={(text) => {
              const location = text
                .split(",")
                .map((loc) => loc.trim())
                .filter((loc) => loc);
              setFormData((prev) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  accommodations: {
                    ...prev.customizations.accommodations,
                    preferences: {
                      ...prev.customizations.accommodations?.preferences,
                      location,
                    },
                  },
                },
              }));
            }}
            placeholder="City center, Beachfront, etc."
            placeholderTextColor={Colors.gray[400]}
          />
        </ThemedView>

        <ActivitiesSection
          formData={{
            customizations: {
              activities:
                formData.customizations.activities ||
                defaultCustomizations.activities,
            },
          }}
          onUpdateActivities={onUpdateActivities}
        />

        <MealsSection
          formData={{
            customizations: {
              meals:
                formData.customizations.meals || defaultCustomizations.meals,
            },
          }}
          onUpdateMeals={(meals) =>
            setFormData((prev) => ({
              ...prev,
              customizations: {
                ...prev.customizations,
                meals,
              },
            }))
          }
        />

        <ItinerarySection
          formData={{
            customizations: {
              itinerary:
                formData.customizations.itinerary ||
                defaultCustomizations.itinerary,
            },
          }}
          onUpdateItinerary={(itinerary) =>
            setFormData((prev) => ({
              ...prev,
              customizations: {
                ...prev.customizations,
                itinerary,
              },
            }))
          }
        />

        <AccessibilitySection formData={formData} setFormData={setFormData} />

        {/* Transportation Section */}
        <ThemedView style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Transportation</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Specify transportation preferences for this package template
          </ThemedText>

          {/* Transportation Types */}
          <ThemedText style={styles.label}>Transportation Types</ThemedText>
          <TextInput
            style={styles.input}
            value={(
              formData.customizations.transportation?.preferences?.types || []
            ).join(", ")}
            onChangeText={(text) => {
              const types = text
                .split(",")
                .map((type) => type.trim())
                .filter((type) => type);
              setFormData((prev) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    preferences: {
                      ...prev.customizations.transportation?.preferences,
                      types,
                    },
                  },
                },
              }));
            }}
            placeholder="Private Car, Bus, Train, etc."
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Class Preference */}
          <ThemedText style={styles.label}>Class Preference</ThemedText>
          <TextInput
            style={styles.input}
            value={
              formData.customizations.transportation?.preferences?.class || ""
            }
            onChangeText={(text) => {
              setFormData((prev) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    preferences: {
                      ...prev.customizations.transportation?.preferences,
                      class: text,
                    },
                  },
                },
              }));
            }}
            placeholder="Economy, Business, First Class"
            placeholderTextColor={Colors.gray[400]}
          />

          {/* Special Requirements */}
          <ThemedText style={styles.label}>Special Requirements</ThemedText>
          <TextInput
            style={styles.input}
            value={(
              formData.customizations.transportation?.preferences
                ?.specialRequirements || []
            ).join(", ")}
            onChangeText={(text) => {
              const specialRequirements = text
                .split(",")
                .map((req) => req.trim())
                .filter((req) => req);
              setFormData((prev) => ({
                ...prev,
                customizations: {
                  ...prev.customizations,
                  transportation: {
                    ...prev.customizations.transportation,
                    preferences: {
                      ...prev.customizations.transportation?.preferences,
                      specialRequirements,
                    },
                  },
                },
              }));
            }}
            placeholder="Wheelchair accessible, Child seat, etc."
            placeholderTextColor={Colors.gray[400]}
          />
        </ThemedView>

        <BudgetSection formData={formData} setFormData={setFormData} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  scrollView: {
    flex: 1,
  },
  formSection: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: Colors.light.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  loader: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 8,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});
