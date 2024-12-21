import { useState } from "react";
import { View, TextInput, ScrollView, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useToast } from "react-native-toast-notifications";
import { Picker } from "@react-native-picker/picker";

const documentTypes = [
  { label: "Tourist Visa", value: "tourist-visa" },
  { label: "Business Visa", value: "business-visa" },
  { label: "Student Visa", value: "student-visa" },
  { label: "Work Visa", value: "work-visa" },
  { label: "Passport", value: "passport" },
  { label: "International Driving Permit", value: "idp" },
];

export const TravelDocsForm = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    documentType: "tourist-visa",
    destination: "",
    travelDate: "",
    additionalInfo: "",
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.destination) {
      toast.show("Please fill in all required fields", { type: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call to submit the form
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated API call
      toast.show("Request submitted successfully!", { type: "success" });
      onClose();
    } catch (error) {
      toast.show("Failed to submit request", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <ThemedText className="text-lg font-semibold">
          Travel Document Request
        </ThemedText>
        <Pressable onPress={onClose} className="p-2">
          <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="space-y-4 py-4">
          {/* Full Name */}
          <View>
            <ThemedText className="text-sm mb-1 font-medium">Full Name *</ThemedText>
            <TextInput
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, fullName: text }))
              }
              placeholder="Enter your full name"
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Email */}
          <View>
            <ThemedText className="text-sm mb-1 font-medium">Email *</ThemedText>
            <TextInput
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="Enter your email"
              keyboardType="email-address"
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Phone */}
          <View>
            <ThemedText className="text-sm mb-1 font-medium">Phone Number *</ThemedText>
            <TextInput
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Document Type */}
          <View>
            <ThemedText className="text-sm mb-1 font-medium">Document Type *</ThemedText>
            <View className="bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden">
              <Picker
                selectedValue={formData.documentType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, documentType: value }))
                }
                style={{ color: "#111827" }}
                dropdownIconColor="#6b7280"
              >
                {documentTypes.map((type) => (
                  <Picker.Item
                    key={type.value}
                    label={type.label}
                    value={type.value}
                    color="#111827"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Destination */}
          <View>
            <ThemedText className="text-sm mb-1 font-medium">Destination Country *</ThemedText>
            <TextInput
              value={formData.destination}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, destination: text }))
              }
              placeholder="Enter destination country"
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Travel Date */}
          <View>
            <ThemedText className="text-sm mb-1 font-medium">Expected Travel Date</ThemedText>
            <TextInput
              value={formData.travelDate}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, travelDate: text }))
              }
              placeholder="DD/MM/YYYY"
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Additional Information */}
          <View>
            <ThemedText className="text-sm mb-1 font-medium">Additional Information</ThemedText>
            <TextInput
              value={formData.additionalInfo}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, additionalInfo: text }))
              }
              placeholder="Any additional details..."
              multiline
              numberOfLines={4}
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white min-h-[100]"
              placeholderTextColor="#9ca3af"
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className={`bg-yellow-500 p-4 rounded-xl flex-row justify-center items-center ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {isLoading ? (
            <MaterialCommunityIcons
              name="loading"
              size={24}
              color="white"
              className="animate-spin"
            />
          ) : (
            <ThemedText className="text-white font-semibold text-lg">
              Submit Request
            </ThemedText>
          )}
        </Pressable>
      </View>
    </ThemedView>
  );
};
