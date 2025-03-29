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
    800: "#975A16",
  },
  blue: {
    100: "#EBF8FF",
    800: "#2C5282",
  },
  green: {
    100: "#F0FFF4",
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
    budget: {
      maxBudget: number;
      priorityAreas: string[];
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
    } else if (
      fields.length === 3 &&
      fields[0] === "customizations" &&
      fields[1] === "budget"
    ) {
      setFormData((prev) => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          budget: {
            ...prev.customizations.budget,
            [fields[2]]: value,
          },
        },
      }));
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
          <TouchableOpacity
            onPress={() => router.push("/package-template/list")}
          >
            <ThemedText style={styles.emptyStateAction}>
              Go to My Templates
            </ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <ThemedView style={styles.headerSection}>
          {renderStatusBadge()}

          {isEditing ? (
            <>
              <ThemedText style={styles.label}>Template Name</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="Enter template name"
                placeholderTextColor={Colors.gray[400]}
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

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    handleInputChange("isPublic", !formData.isPublic)
                  }
                >
                  {formData.isPublic ? (
                    <Ionicons
                      name="checkbox"
                      size={24}
                      color={Colors.primary}
                    />
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
            </>
          ) : (
            <>
              <ThemedText style={styles.templateName}>
                {template.name}
              </ThemedText>
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
                  name={
                    template.isPublic ? "globe-outline" : "lock-closed-outline"
                  }
                  size={16}
                  color={
                    template.isPublic
                      ? ExtendedColors.green[600]
                      : Colors.gray[600]
                  }
                />
                <ThemedText style={styles.visibilityText}>
                  {template.isPublic ? "Public template" : "Private template"}
                </ThemedText>
              </View>
            </>
          )}
        </ThemedView>

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

        {template.status === "Rejected" && template.adminFeedback && (
          <ThemedView style={styles.feedbackSection}>
            <ThemedText style={styles.feedbackTitle}>Admin Feedback</ThemedText>
            <ThemedText style={styles.feedbackContent}>
              {template.adminFeedback}
            </ThemedText>
          </ThemedView>
        )}

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
              <Ionicons name="open-outline" size={24} color={Colors.primary} />
              <ThemedText style={styles.publishedPackageText}>
                View Published Package
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

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

      <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
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
    padding: 16,
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    borderColor: "#E2E8F0", // Use direct color value instead of Colors.gray[300]
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
});
