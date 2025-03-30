import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import {
  getPackageTemplateById,
  updatePackageTemplate,
  submitPackageTemplateForReview,
  deletePackageTemplate,
} from "@/data/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

// Define color extensions
const ExtendedColors = {
  ...Colors,
  white: "#FFFFFF",
  yellow: {
    100: "#FFF9DB",
    500: "#EAB308",
    800: "#975A16",
  },
  blue: {
    100: "#EBF8FF",
    500: "#3182CE",
    800: "#2C5282",
  },
  green: {
    100: "#F0FFF4",
    500: "#48BB78",
    600: "#38A169",
    800: "#276749",
  },
  red: {
    50: "#FFF5F5",
    100: "#FED7D7",
    500: "#E53E3E",
    700: "#C53030",
    800: "#9B2C2C",
  },
  purple: {
    100: "#FAF5FF",
    500: "#805AD5",
    800: "#553C9A",
  },
};

// Define template type
interface Template {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  status: "Pending" | "InReview" | "Approved" | "Rejected" | "Published";
  userId: string;
  basePackageId: {
    _id: string;
    name: string;
    images?: string[];
    duration?: {
      days?: number;
    };
    price?: number;
  };
  estimatedPrice?: number;
  adminFeedback?: string;
  resultingPackageId?: string;
  customizations: {
    accommodations?: {
      hotelIds?: string[];
      preferences?: {
        roomTypes?: string[];
        amenities?: string[];
        boardBasis?: string[];
        location?: string[];
      };
    };
    transportation?: {
      type?: "Flight" | "Train" | "Bus" | "Private Car" | "None";
      preferences?: {
        types?: string[];
        class?: string;
        specialRequirements?: string[];
        seatingPreference?: string;
        specialAssistance?: string[];
        luggageOptions?: string[];
      };
    };
    activities?: {
      included?: string[];
      excluded?: string[];
      preferences?: {
        difficulty?: string[];
        duration?: string[];
        activityTypes?: string[];
        timeOfDay?: string[];
      };
    };
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
    itinerary?: {
      pace?: "Relaxed" | "Moderate" | "Fast";
      flexibility?: "Fixed" | "Flexible" | "Very Flexible";
      focusAreas?: string[];
      dayRequirements?: string[];
    };
    accessibility?: {
      wheelchairAccess?: boolean;
      mobilityAssistance?: boolean;
      dietaryRestrictions?: string[];
      medicalRequirements?: string[];
    };
    budget?: {
      maxBudget?: number;
      priorityAreas?: string[];
      flexibleAreas?: string[];
    };
  };
}

export default function PackageTemplateScreen() {
  const { id } = useLocalSearchParams();
  const { auth } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    customizations: {
      budget: {
        maxBudget: 0,
        priorityAreas: [] as string[],
      },
    },
  });

  useEffect(() => {
    fetchTemplateDetails();
  }, [id, auth?.token]);

  const fetchTemplateDetails = async () => {
    if (!id || !auth?.token) return;

    try {
      setLoading(true);
      const data = await getPackageTemplateById(id as string, auth.token);
      setTemplate(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        isPublic: data.isPublic || false,
        customizations: data.customizations || {
          budget: {
            maxBudget: 0,
            priorityAreas: [],
          },
        },
      });
    } catch (error) {
      console.error("Error fetching template details:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load template",
        text2: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const fields = field.split(".");

    if (fields.length === 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (fields.length === 2 && fields[0] === "customizations") {
      setFormData((prev) => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          [fields[1]]: value,
        },
      }));
    } else if (fields.length === 3 && fields[0] === "customizations") {
      const section = fields[1];
      const property = fields[2];

      setFormData((prev) => {
        const prevCustomizations = { ...prev.customizations };
        const sectionData =
          prevCustomizations[section as keyof typeof prevCustomizations] || {};

        return {
          ...prev,
          customizations: {
            ...prevCustomizations,
            [section]: {
              ...sectionData,
              [property]: value,
            },
          },
        };
      });
    } else if (fields.length === 4 && fields[0] === "customizations") {
      const section = fields[1];
      const subsection = fields[2];
      const property = fields[3];

      setFormData((prev) => {
        const prevCustomizations = { ...prev.customizations };
        const sectionData =
          prevCustomizations[section as keyof typeof prevCustomizations] || {};
        const subsectionData = (sectionData as any)[subsection] || {};

        return {
          ...prev,
          customizations: {
            ...prevCustomizations,
            [section]: {
              ...sectionData,
              [subsection]: {
                ...subsectionData,
                [property]: value,
              },
            },
          },
        };
      });
    }
  };

  const saveChanges = async () => {
    if (!formData.name) {
      Toast.show({
        type: "error",
        text1: "Name is required",
      });
      return;
    }

    try {
      setSaving(true);
      const updatedTemplate = await updatePackageTemplate(
        id as string,
        formData,
        auth?.token as string
      );
      setTemplate(updatedTemplate);
      setIsEditing(false);

      Toast.show({
        type: "success",
        text1: "Template updated successfully",
      });
    } catch (error) {
      console.error("Error updating template:", error);
      Toast.show({
        type: "error",
        text1: "Failed to update template",
        text2: (error as Error)?.message || "Please try again later",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    Alert.alert(
      "Submit for Review",
      "Are you sure you want to submit this template for review? You won't be able to edit it while it's being reviewed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            try {
              setSubmitting(true);
              await submitPackageTemplateForReview(
                id as string,
                auth?.token as string
              );

              Toast.show({
                type: "success",
                text1: "Template submitted for review",
                text2: "You'll be notified when it's approved",
              });

              fetchTemplateDetails();
            } catch (error) {
              console.error("Error submitting template for review:", error);
              Toast.show({
                type: "error",
                text1: "Failed to submit template",
                text2: (error as Error)?.message || "Please try again later",
              });
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Template",
      "Are you sure you want to delete this template? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePackageTemplate(id as string, auth?.token as string);

              Toast.show({
                type: "success",
                text1: "Template deleted successfully",
              });

              router.replace("/package-template/list");
            } catch (error) {
              console.error("Error deleting template:", error);
              Toast.show({
                type: "error",
                text1: "Failed to delete template",
                text2: (error as Error)?.message || "Please try again later",
              });
            }
          },
        },
      ]
    );
  };

  const renderStatusBadge = () => {
    if (!template) return null;

    const statusColors = {
      Pending: {
        bg: ExtendedColors.yellow[100],
        text: ExtendedColors.yellow[800],
        icon: "time-outline" as const,
      },
      InReview: {
        bg: ExtendedColors.blue[100],
        text: ExtendedColors.blue[800],
        icon: "hourglass-outline" as const,
      },
      Approved: {
        bg: ExtendedColors.green[100],
        text: ExtendedColors.green[800],
        icon: "checkmark-circle-outline" as const,
      },
      Rejected: {
        bg: ExtendedColors.red[100],
        text: ExtendedColors.red[800],
        icon: "close-circle-outline" as const,
      },
      Published: {
        bg: ExtendedColors.purple[100],
        text: ExtendedColors.purple[800],
        icon: "globe-outline" as const,
      },
    };

    const statusStyle = statusColors[template.status] || statusColors.Pending;

    return (
      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        <Ionicons name={statusStyle.icon} size={16} color={statusStyle.text} />
        <ThemedText style={[styles.statusText, { color: statusStyle.text }]}>
          {template.status}
        </ThemedText>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loaderText}>Loading template...</ThemedText>
        </View>
      );
    }

    if (!template) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={Colors.gray[400]}
          />
          <ThemedText style={styles.emptyStateText}>
            Template not found
          </ThemedText>
          <TouchableOpacity onPress={() => router.push("/template")}>
            <ThemedText style={styles.emptyStateAction}>
              Go to My Templates
            </ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {/* Basic Information Section */}
        <ThemedView style={styles.headerSection}>
          {renderStatusBadge()}
          <ThemedText style={styles.templateName}>{template.name}</ThemedText>
          {template.description ? (
            <ThemedText style={styles.templateDescription}>
              {template.description}
            </ThemedText>
          ) : (
            <ThemedText style={styles.noDescription}>
              No description provided
            </ThemedText>
          )}
          <View style={styles.visibility}>
            <Ionicons
              name={template.isPublic ? "globe-outline" : "lock-closed-outline"}
              size={16}
              color={
                template.isPublic ? ExtendedColors.green[600] : Colors.gray[600]
              }
            />
            <ThemedText style={styles.visibilityText}>
              {template.isPublic ? "Public template" : "Private template"}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Base Package Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Base Package</ThemedText>
          {template.basePackageId ? (
            <TouchableOpacity
              style={styles.packageCard}
              onPress={() =>
                router.push(`/package-details/${template.basePackageId._id}`)
              }
            >
              <View style={styles.packageImageContainer}>
                {template.basePackageId.images &&
                template.basePackageId.images.length > 0 ? (
                  <Image
                    source={{ uri: template.basePackageId.images[0] }}
                    style={styles.packageImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.packageImage, styles.noImage]}>
                    <Ionicons
                      name="image-outline"
                      size={36}
                      color={Colors.gray[400]}
                    />
                  </View>
                )}
              </View>

              <View style={styles.packageInfo}>
                <ThemedText style={styles.packageName}>
                  {template.basePackageId.name}
                </ThemedText>

                <View style={styles.packageMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={Colors.primary}
                    />
                    <ThemedText style={styles.metaText}>
                      {template.basePackageId.duration?.days || "?"} days
                    </ThemedText>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color={Colors.primary}
                    />
                    <ThemedText style={styles.metaText}>
                      ${template.basePackageId.price?.toLocaleString() || "?"}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <ThemedText style={styles.noBasePackage}>
              Base package information not available
            </ThemedText>
          )}
        </ThemedView>

        {template.estimatedPrice && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Estimated Price</ThemedText>
            <ThemedText style={styles.price}>
              ${template.estimatedPrice.toLocaleString()}
            </ThemedText>
          </ThemedView>
        )}

        {/* Accommodations Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Accommodations</ThemedText>
          {template.customizations?.accommodations?.preferences ? (
            <>
              {template.customizations.accommodations.preferences.roomTypes &&
                template.customizations.accommodations.preferences.roomTypes
                  .length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Room Types:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.accommodations.preferences.roomTypes.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.accommodations.preferences.amenities &&
                template.customizations.accommodations.preferences.amenities
                  .length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Amenities:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.accommodations.preferences.amenities.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.accommodations.preferences.boardBasis &&
                template.customizations.accommodations.preferences.boardBasis
                  .length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Board Basis:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.accommodations.preferences.boardBasis.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.accommodations.preferences.location &&
                template.customizations.accommodations.preferences.location
                  .length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Location Preferences:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.accommodations.preferences.location.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
            </>
          ) : (
            <ThemedText style={styles.noPreferences}>
              No accommodation preferences specified
            </ThemedText>
          )}
        </ThemedView>

        {/* Transportation Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Transportation</ThemedText>
          {template.customizations?.transportation ? (
            <>
              <View style={styles.preferenceGroup}>
                <ThemedText style={styles.preferenceLabel}>Type:</ThemedText>
                <ThemedText style={styles.preferenceValue}>
                  {template.customizations.transportation.type ||
                    "Not specified"}
                </ThemedText>
              </View>
              {template.customizations.transportation.preferences?.types &&
                template.customizations.transportation.preferences.types
                  .length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Transportation Types:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.transportation.preferences.types.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.transportation.preferences?.class && (
                <View style={styles.preferenceGroup}>
                  <ThemedText style={styles.preferenceLabel}>
                    Class Preference:
                  </ThemedText>
                  <ThemedText style={styles.preferenceValue}>
                    {template.customizations.transportation.preferences.class}
                  </ThemedText>
                </View>
              )}
              {template.customizations.transportation.preferences
                ?.specialRequirements &&
                template.customizations.transportation.preferences
                  .specialRequirements.length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Special Requirements:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.transportation.preferences.specialRequirements.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
            </>
          ) : (
            <ThemedText style={styles.noPreferences}>
              No transportation preferences specified
            </ThemedText>
          )}
        </ThemedView>

        {/* Activities Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Activities</ThemedText>
          {template.customizations?.activities ? (
            <>
              {template.customizations.activities.included &&
                template.customizations.activities.included.length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Included Activities:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.activities.included.join(", ")}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.activities.excluded &&
                template.customizations.activities.excluded.length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Excluded Activities:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.activities.excluded.join(", ")}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.activities.preferences && (
                <>
                  {template.customizations.activities.preferences.difficulty &&
                    template.customizations.activities.preferences.difficulty
                      .length > 0 && (
                      <View style={styles.preferenceGroup}>
                        <ThemedText style={styles.preferenceLabel}>
                          Difficulty Levels:
                        </ThemedText>
                        <ThemedText style={styles.preferenceValue}>
                          {template.customizations.activities.preferences.difficulty.join(
                            ", "
                          )}
                        </ThemedText>
                      </View>
                    )}
                  {template.customizations.activities.preferences
                    .activityTypes &&
                    template.customizations.activities.preferences.activityTypes
                      .length > 0 && (
                      <View style={styles.preferenceGroup}>
                        <ThemedText style={styles.preferenceLabel}>
                          Activity Types:
                        </ThemedText>
                        <ThemedText style={styles.preferenceValue}>
                          {template.customizations.activities.preferences.activityTypes.join(
                            ", "
                          )}
                        </ThemedText>
                      </View>
                    )}
                </>
              )}
            </>
          ) : (
            <ThemedText style={styles.noPreferences}>
              No activity preferences specified
            </ThemedText>
          )}
        </ThemedView>

        {/* Meals Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Meals</ThemedText>
          {template.customizations?.meals ? (
            <>
              <View style={styles.preferenceGroup}>
                <ThemedText style={styles.preferenceLabel}>
                  Included Meals:
                </ThemedText>
                <View style={styles.mealInclusionList}>
                  <ThemedText style={styles.mealInclusion}>
                    Breakfast:{" "}
                    {template.customizations.meals.included?.breakfast
                      ? "✓"
                      : "✗"}
                  </ThemedText>
                  <ThemedText style={styles.mealInclusion}>
                    Lunch:{" "}
                    {template.customizations.meals.included?.lunch ? "✓" : "✗"}
                  </ThemedText>
                  <ThemedText style={styles.mealInclusion}>
                    Dinner:{" "}
                    {template.customizations.meals.included?.dinner ? "✓" : "✗"}
                  </ThemedText>
                </View>
              </View>
              {template.customizations.meals.preferences && (
                <>
                  {template.customizations.meals.preferences.dietary &&
                    template.customizations.meals.preferences.dietary.length >
                      0 && (
                      <View style={styles.preferenceGroup}>
                        <ThemedText style={styles.preferenceLabel}>
                          Dietary Requirements:
                        </ThemedText>
                        <ThemedText style={styles.preferenceValue}>
                          {template.customizations.meals.preferences.dietary.join(
                            ", "
                          )}
                        </ThemedText>
                      </View>
                    )}
                  {template.customizations.meals.preferences.cuisine &&
                    template.customizations.meals.preferences.cuisine.length >
                      0 && (
                      <View style={styles.preferenceGroup}>
                        <ThemedText style={styles.preferenceLabel}>
                          Cuisine Preferences:
                        </ThemedText>
                        <ThemedText style={styles.preferenceValue}>
                          {template.customizations.meals.preferences.cuisine.join(
                            ", "
                          )}
                        </ThemedText>
                      </View>
                    )}
                </>
              )}
            </>
          ) : (
            <ThemedText style={styles.noPreferences}>
              No meal preferences specified
            </ThemedText>
          )}
        </ThemedView>

        {/* Itinerary Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Itinerary</ThemedText>
          {template.customizations?.itinerary ? (
            <>
              <View style={styles.preferenceGroup}>
                <ThemedText style={styles.preferenceLabel}>Pace:</ThemedText>
                <ThemedText style={styles.preferenceValue}>
                  {template.customizations.itinerary.pace || "Not specified"}
                </ThemedText>
              </View>
              <View style={styles.preferenceGroup}>
                <ThemedText style={styles.preferenceLabel}>
                  Flexibility:
                </ThemedText>
                <ThemedText style={styles.preferenceValue}>
                  {template.customizations.itinerary.flexibility ||
                    "Not specified"}
                </ThemedText>
              </View>
              {template.customizations.itinerary.focusAreas &&
                template.customizations.itinerary.focusAreas.length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Focus Areas:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.itinerary.focusAreas.join(", ")}
                    </ThemedText>
                  </View>
                )}
            </>
          ) : (
            <ThemedText style={styles.noPreferences}>
              No itinerary preferences specified
            </ThemedText>
          )}
        </ThemedView>

        {/* Accessibility Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Accessibility</ThemedText>
          {template.customizations?.accessibility ? (
            <>
              <View style={styles.accessibilityOptions}>
                <View style={styles.accessibilityOption}>
                  <Ionicons
                    name={
                      template.customizations.accessibility.wheelchairAccess
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={20}
                    color={
                      template.customizations.accessibility.wheelchairAccess
                        ? ExtendedColors.green[500]
                        : ExtendedColors.red[500]
                    }
                  />
                  <ThemedText style={styles.accessibilityText}>
                    Wheelchair Access
                  </ThemedText>
                </View>
                <View style={styles.accessibilityOption}>
                  <Ionicons
                    name={
                      template.customizations.accessibility.mobilityAssistance
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={20}
                    color={
                      template.customizations.accessibility.mobilityAssistance
                        ? ExtendedColors.green[500]
                        : ExtendedColors.red[500]
                    }
                  />
                  <ThemedText style={styles.accessibilityText}>
                    Mobility Assistance
                  </ThemedText>
                </View>
              </View>
              {template.customizations.accessibility.dietaryRestrictions &&
                template.customizations.accessibility.dietaryRestrictions
                  .length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Dietary Restrictions:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.accessibility.dietaryRestrictions.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.accessibility.medicalRequirements &&
                template.customizations.accessibility.medicalRequirements
                  .length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Medical Requirements:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.accessibility.medicalRequirements.join(
                        ", "
                      )}
                    </ThemedText>
                  </View>
                )}
            </>
          ) : (
            <ThemedText style={styles.noPreferences}>
              No accessibility requirements specified
            </ThemedText>
          )}
        </ThemedView>

        {/* Budget Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Budget</ThemedText>
          {template.customizations?.budget ? (
            <>
              {template.customizations.budget.maxBudget !== undefined && (
                <View style={styles.preferenceGroup}>
                  <ThemedText style={styles.preferenceLabel}>
                    Maximum Budget:
                  </ThemedText>
                  <ThemedText style={styles.budgetValue}>
                    ${template.customizations.budget.maxBudget.toLocaleString()}
                  </ThemedText>
                </View>
              )}
              {template.customizations.budget.priorityAreas &&
                template.customizations.budget.priorityAreas.length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Priority Areas:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.budget.priorityAreas.join(", ")}
                    </ThemedText>
                  </View>
                )}
              {template.customizations.budget.flexibleAreas &&
                template.customizations.budget.flexibleAreas.length > 0 && (
                  <View style={styles.preferenceGroup}>
                    <ThemedText style={styles.preferenceLabel}>
                      Flexible Areas:
                    </ThemedText>
                    <ThemedText style={styles.preferenceValue}>
                      {template.customizations.budget.flexibleAreas.join(", ")}
                    </ThemedText>
                  </View>
                )}
            </>
          ) : (
            <ThemedText style={styles.noPreferences}>
              No budget preferences specified
            </ThemedText>
          )}
        </ThemedView>

        {/* Admin Feedback Section */}
        {template.status === "Rejected" && template.adminFeedback && (
          <ThemedView style={styles.feedbackSection}>
            <ThemedText style={styles.feedbackTitle}>Admin Feedback</ThemedText>
            <ThemedText style={styles.feedbackContent}>
              {template.adminFeedback}
            </ThemedText>
          </ThemedView>
        )}

        {/* Published Package Section */}
        {template.status === "Published" && template.resultingPackageId && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Published Package
            </ThemedText>
            <TouchableOpacity
              style={styles.publishedPackage}
              onPress={() =>
                router.push(`/package-details/${template.resultingPackageId}`)
              }
            >
              <Ionicons
                name="open-outline"
                size={24}
                color={ExtendedColors.white}
              />
              <ThemedText style={styles.publishedPackageText}>
                View Published Package
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {/* Action Buttons */}
        {template.status === "Pending" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={ExtendedColors.white}
              />
              <ThemedText style={styles.buttonText}>Delete</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmitForReview}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={ExtendedColors.white} />
              ) : (
                <>
                  <Ionicons
                    name="paper-plane-outline"
                    size={20}
                    color={ExtendedColors.white}
                  />
                  <ThemedText style={styles.buttonText}>
                    Submit for Review
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: template?.name || "Package Template",
          headerRight: () =>
            template?.status === "Pending" &&
            template?.userId === auth?.user?.id ? (
              isEditing ? (
                <TouchableOpacity
                  onPress={saveChanges}
                  disabled={saving}
                  style={styles.headerButton}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <ThemedText style={styles.headerButtonText}>
                      Save
                    </ThemedText>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.headerButton}
                >
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              )
            ) : null,
        }}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  contentContainer: {
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  emptyStateAction: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 16,
    fontWeight: "500",
  },
  headerSection: {
    padding: 16,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  templateName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  noDescription: {
    fontSize: 16,
    color: Colors.gray[400],
    marginBottom: 16,
    fontStyle: "italic",
  },
  visibility: {
    flexDirection: "row",
    alignItems: "center",
  },
  visibilityText: {
    fontSize: 14,
    marginLeft: 6,
    color: Colors.gray[600],
  },
  section: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  packageImageContainer: {
    height: 180,
    width: "100%",
  },
  packageImage: {
    height: "100%",
    width: "100%",
  },
  noImage: {
    backgroundColor: Colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  packageInfo: {
    padding: 16,
  },
  packageName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  packageMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  noBasePackage: {
    fontSize: 16,
    color: Colors.gray[400],
    fontStyle: "italic",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: ExtendedColors.green[600],
  },
  feedbackSection: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: ExtendedColors.red[50],
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: ExtendedColors.red[500],
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: ExtendedColors.red[700],
    marginBottom: 8,
  },
  feedbackContent: {
    fontSize: 14,
    color: ExtendedColors.red[800],
  },
  publishedPackage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  publishedPackageText: {
    color: ExtendedColors.white,
    fontWeight: "bold",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: ExtendedColors.red[500],
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: ExtendedColors.white,
    fontWeight: "bold",
    marginLeft: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: Colors.light.background,
    color: Colors.dark.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  preferenceGroup: {
    marginBottom: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray[600],
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 16,
  },
  mealInclusionList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  mealInclusion: {
    fontSize: 16,
    marginRight: 16,
  },
  accessibilityOptions: {
    marginBottom: 16,
  },
  accessibilityOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  accessibilityText: {
    fontSize: 16,
    marginLeft: 8,
  },
  noPreferences: {
    fontSize: 14,
    color: Colors.gray[400],
    fontStyle: "italic",
  },
  budgetValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: ExtendedColors.green[600],
  },
});
