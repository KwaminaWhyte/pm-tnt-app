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

export default function CreatePackageTemplate() {
  const { auth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );

  const [formData, setFormData] = useState<PackageTemplateData>({
    name: "",
    description: "",
    basePackageId: "",
    customizations: {
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
    },
    isPublic: false,
    tags: [],
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
      basePackageId: pkg._id,
    }));
  };

  const handleInputChange = (field: keyof PackageTemplateData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("formData", formData);

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
      const response = await createPackageTemplate(formData, auth?.token);

      Toast.show({
        type: "success",
        text1: "Template created successfully",
        text2: "You can now customize it further",
      });

      // Navigate to edit template screen
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
              disabled={submitting || !formData.name || !formData.basePackageId}
              style={[
                styles.submitButton,
                (!formData.name || !formData.basePackageId) &&
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
            value={formData.tags?.join(", ") || ""}
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

        <ThemedText style={styles.footer}>* Required fields</ThemedText>
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
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.gray[400],
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[400],
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
  submitButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: Colors.gray[400],
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    color: Colors.gray[400],
  },
  footer: {
    fontSize: 12,
    color: Colors.gray[400],
    marginBottom: 24,
    marginLeft: 16,
  },
});
