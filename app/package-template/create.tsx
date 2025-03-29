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
import { getPackages, createPackageTemplate } from "@/data/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import PackageSelector from "@/components/PackageSelector";
import { Input } from "@/components/ui/input";
import { ActivitiesSection } from "@/components/package-template/ActivitiesSection";
import { MealsSection } from "@/components/package-template/MealsSection";
import { ItinerarySection } from "@/components/package-template/ItinerarySection";
import { AccessibilitySection } from "@/components/package-template/AccessibilitySection";

// Define types for package
interface PackageType {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  duration?: {
    days: number;
    nights: number;
  };
  price?: number;
  maxParticipants?: number;
  status?: string;
}

interface CustomizationsType {
  accommodations: {
    hotelIds: string[];
    preferences: {
      roomTypes: string[];
      amenities: string[];
      boardBasis: string[];
      location: string[];
    };
  };
  transportation: {
    type: "None" | "Flight" | "Train" | "Bus" | "Private Car";
    preferences: {
      class: string;
      seatingPreference: string;
      specialAssistance: string[];
      luggageOptions: string[];
    };
  };
  budget: {
    maxBudget: number;
    priorityAreas: string[];
    flexibleAreas: string[];
  };
  activities: {
    included: string[];
    excluded: string[];
    preferences: {
      difficulty: string[];
      duration: string[];
      activityTypes: string[];
      timeOfDay: string[];
    };
  };
  meals: {
    included: {
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
    };
    preferences: {
      dietary: string[];
      cuisine: string[];
      mealTimes: {
        breakfast: string;
        lunch: string;
        dinner: string;
      };
    };
  };
  itinerary: {
    pace: "Relaxed" | "Moderate" | "Fast";
    flexibility: string;
    focusAreas: string[];
    dayRequirements: string[];
  };
  accessibility: {
    wheelchairAccess: boolean;
    mobilityAssistance: string[];
    dietaryRestrictions: string[];
    medicalRequirements: string[];
  };
}

const defaultCustomizations: CustomizationsType = {
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
      class: "",
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
    flexibility: "",
    focusAreas: [],
    dayRequirements: [],
  },
  accessibility: {
    wheelchairAccess: false,
    mobilityAssistance: [],
    dietaryRestrictions: [],
    medicalRequirements: [],
  },
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

  const [formData, setFormData] = useState<CustomizationsType>({
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
        class: "",
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
      flexibility: "",
      focusAreas: [],
      dayRequirements: [],
    },
    accessibility: {
      wheelchairAccess: false,
      mobilityAssistance: [],
      dietaryRestrictions: [],
      medicalRequirements: [],
    },
  });

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
      accommodations: {
        ...prev.accommodations,
        hotelIds: [pkg._id],
      },
    }));
  };

  const handleInputChange = (field: keyof CustomizationsType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.accommodations.hotelIds.length || !formData.itinerary.pace) {
      Toast.show({
        type: "error",
        text1: "Missing required fields",
        text2: "Please provide a base package and select a pace",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await createPackageTemplate(formData, auth?.token);

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

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Create Package Template",
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={
                submitting ||
                !formData.accommodations.hotelIds.length ||
                !formData.itinerary.pace
              }
              style={[
                styles.submitButton,
                (!formData.accommodations.hotelIds.length ||
                  !formData.itinerary.pace) &&
                  styles.disabledButton,
              ]}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
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
            value={
              formData.accommodations?.preferences?.roomTypes?.join(", ") || ""
            }
            onChangeText={(text) => {
              const roomTypes = text
                .split(",")
                .map((type) => type.trim())
                .filter((type) => type);
              setFormData((prev) => ({
                ...prev,
                accommodations: {
                  ...prev.accommodations,
                  preferences: {
                    ...prev.accommodations?.preferences,
                    roomTypes,
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
            value={formData.accommodations.preferences.amenities.join(", ")}
            onChangeText={(text) => {
              const amenities = text
                .split(",")
                .map((amenity) => amenity.trim())
                .filter((amenity) => amenity);
              setFormData((prev) => ({
                ...prev,
                accommodations: {
                  ...prev.accommodations,
                  preferences: {
                    ...prev.accommodations.preferences,
                    amenities,
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
            value={formData.accommodations.preferences.boardBasis.join(", ")}
            onChangeText={(text) => {
              const boardBasis = text
                .split(",")
                .map((basis) => basis.trim())
                .filter((basis) => basis);
              setFormData((prev) => ({
                ...prev,
                accommodations: {
                  ...prev.accommodations,
                  preferences: {
                    ...prev.accommodations.preferences,
                    boardBasis,
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
            value={formData.accommodations.preferences.location.join(", ")}
            onChangeText={(text) => {
              const location = text
                .split(",")
                .map((loc) => loc.trim())
                .filter((loc) => loc);
              setFormData((prev) => ({
                ...prev,
                accommodations: {
                  ...prev.accommodations,
                  preferences: {
                    ...prev.accommodations.preferences,
                    location,
                  },
                },
              }));
            }}
            placeholder="City center, Beachfront, etc."
            placeholderTextColor={Colors.gray[400]}
          />
        </ThemedView>

        {/* Transportation Section */}
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
                  formData.transportation.type === type && styles.buttonActive,
                ]}
                onPress={() => {
                  setFormData((prev) => ({
                    ...prev,
                    transportation: {
                      ...prev.transportation,
                      type: type as CustomizationsType["transportation"]["type"],
                    },
                  }));
                }}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    formData.transportation.type === type &&
                      styles.buttonTextActive,
                  ]}
                >
                  {type}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {formData.transportation.type !== "None" && (
            <>
              {/* Class */}
              <ThemedText style={styles.label}>Class</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.transportation.preferences.class}
                onChangeText={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    transportation: {
                      ...prev.transportation,
                      preferences: {
                        ...prev.transportation.preferences,
                        class: text,
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
                value={formData.transportation.preferences.seatingPreference}
                onChangeText={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    transportation: {
                      ...prev.transportation,
                      preferences: {
                        ...prev.transportation.preferences,
                        seatingPreference: text,
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
                value={formData.transportation.preferences.specialAssistance.join(
                  ", "
                )}
                onChangeText={(text) => {
                  const assistance = text
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item);
                  setFormData((prev) => ({
                    ...prev,
                    transportation: {
                      ...prev.transportation,
                      preferences: {
                        ...prev.transportation.preferences,
                        specialAssistance: assistance,
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
                value={formData.transportation.preferences.luggageOptions.join(
                  ", "
                )}
                onChangeText={(text) => {
                  const options = text
                    .split(",")
                    .map((option) => option.trim())
                    .filter((option) => option);
                  setFormData((prev) => ({
                    ...prev,
                    transportation: {
                      ...prev.transportation,
                      preferences: {
                        ...prev.transportation.preferences,
                        luggageOptions: options,
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

        {/* Budget Section */}
        <ThemedView style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Budget</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Specify budget preferences and priorities
          </ThemedText>

          {/* Maximum Budget */}
          <ThemedText style={styles.label}>Maximum Budget</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.budget.maxBudget.toString()}
            onChangeText={(text) => {
              const budget = parseFloat(text) || 0;
              setFormData((prev) => ({
                ...prev,
                budget: {
                  ...prev.budget,
                  maxBudget: budget,
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
            value={formData.budget.priorityAreas.join(", ")}
            onChangeText={(text) => {
              const areas = text
                .split(",")
                .map((area) => area.trim())
                .filter((area) => area);
              setFormData((prev) => ({
                ...prev,
                budget: {
                  ...prev.budget,
                  priorityAreas: areas,
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
            value={formData.budget.flexibleAreas.join(", ")}
            onChangeText={(text) => {
              const areas = text
                .split(",")
                .map((area) => area.trim())
                .filter((area) => area);
              setFormData((prev) => ({
                ...prev,
                budget: {
                  ...prev.budget,
                  flexibleAreas: areas,
                },
              }));
            }}
            placeholder="Areas where budget can be flexible"
            placeholderTextColor={Colors.gray[400]}
          />
        </ThemedView>

        <ActivitiesSection
          formData={formData}
          onUpdateActivities={(activities: CustomizationsType["activities"]) =>
            setFormData((prev) => ({
              ...prev,
              activities,
            }))
          }
        />

        <MealsSection
          formData={formData}
          onUpdateMeals={(meals: CustomizationsType["meals"]) =>
            setFormData((prev) => ({
              ...prev,
              meals,
            }))
          }
        />

        <ItinerarySection
          formData={formData}
          onUpdateItinerary={(itinerary: CustomizationsType["itinerary"]) =>
            setFormData((prev) => ({
              ...prev,
              itinerary,
            }))
          }
        />

        <AccessibilitySection
          formData={formData}
          onUpdateAccessibility={(
            accessibility: CustomizationsType["accessibility"]
          ) =>
            setFormData((prev) => ({
              ...prev,
              accessibility,
            }))
          }
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: Colors.gray[300],
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
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  buttonTextActive: {
    color: Colors.white,
  },
});
