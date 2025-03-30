import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { getMyPackageTemplates } from "@/data/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

// Define icon types
type StatusIconName =
  | "time-outline"
  | "hourglass-outline"
  | "checkmark-circle-outline"
  | "close-circle-outline"
  | "globe-outline";

// Define extended colors
const ExtendedColors = {
  ...Colors,
  white: "#FFFFFF",
  yellow: {
    100: "#FFF9DB",
    500: "#EAB308",
  },
  blue: {
    100: "#EBF8FF",
    500: "#3182CE",
  },
  green: {
    100: "#F0FFF4",
    500: "#48BB78",
  },
  red: {
    100: "#FED7D7",
    500: "#E53E3E",
  },
  purple: {
    100: "#FAF5FF",
    500: "#805AD5",
  },
};

interface PackageTemplate {
  _id: string;
  name: string;
  status?: "Pending" | "InReview" | "Approved" | "Rejected" | "Published";
  basePackageId?: {
    name: string;
  };
  updatedAt?: string;
  isPublic?: boolean;
}

interface PackageTemplateItemProps {
  item: PackageTemplate;
  onPress: () => void;
}

const PackageTemplateItem: React.FC<PackageTemplateItemProps> = ({
  item,
  onPress,
}) => {
  if (!item) return null;

  const statusColors = {
    Pending: {
      color: ExtendedColors.yellow[500],
      bgColor: ExtendedColors.yellow[100],
      icon: "time-outline" as StatusIconName,
    },
    InReview: {
      color: ExtendedColors.blue[500],
      bgColor: ExtendedColors.blue[100],
      icon: "hourglass-outline" as StatusIconName,
    },
    Approved: {
      color: ExtendedColors.green[500],
      bgColor: ExtendedColors.green[100],
      icon: "checkmark-circle-outline" as StatusIconName,
    },
    Rejected: {
      color: ExtendedColors.red[500],
      bgColor: ExtendedColors.red[100],
      icon: "close-circle-outline" as StatusIconName,
    },
    Published: {
      color: ExtendedColors.purple[500],
      bgColor: ExtendedColors.purple[100],
      icon: "globe-outline" as StatusIconName,
    },
  };

  const status = item.status || "Pending";
  const statusStyle = statusColors[status];

  return (
    <TouchableOpacity style={styles.templateItem} onPress={onPress}>
      <View style={styles.templateHeader}>
        <ThemedText style={styles.templateName} numberOfLines={1}>
          {item.name}
        </ThemedText>
        <View
          style={[styles.statusBadge, { backgroundColor: statusStyle.bgColor }]}
        >
          <Ionicons
            name={statusStyle.icon}
            size={14}
            color={statusStyle.color}
          />
          <ThemedText style={[styles.statusText, { color: statusStyle.color }]}>
            {status}
          </ThemedText>
        </View>
      </View>

      <View style={styles.templateInfo}>
        {item.basePackageId && (
          <View style={styles.infoRow}>
            <Ionicons name="cube-outline" size={16} color={Colors.gray[600]} />
            <ThemedText style={styles.infoText} numberOfLines={1}>
              Based on: {item.basePackageId.name}
            </ThemedText>
          </View>
        )}

        {item.updatedAt && (
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={Colors.gray[600]}
            />
            <ThemedText style={styles.infoText}>
              Updated: {new Date(item.updatedAt).toLocaleDateString()}
            </ThemedText>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons
            name={item.isPublic ? "globe-outline" : "lock-closed-outline"}
            size={16}
            color={Colors.gray[600]}
          />
          <ThemedText style={styles.infoText}>
            {item.isPublic ? "Public" : "Private"}
          </ThemedText>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={Colors.gray[400]}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

export default function PackageTemplateListScreen() {
  const { auth } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [templates, setTemplates] = useState<PackageTemplate[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, [auth?.token]);

  const fetchTemplates = async () => {
    if (!auth?.token) return;

    try {
      setLoading(true);
      const data = await getMyPackageTemplates(auth?.token);
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load templates",
        text2: error.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTemplates();
    setRefreshing(false);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color={Colors.gray[400]} />
      <ThemedText style={styles.emptyStateTitle}>No Templates Yet</ThemedText>
      <ThemedText style={styles.emptyStateText}>
        Create your first custom package template to get started
      </ThemedText>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/package-template/create")}
      >
        <Ionicons name="add" size={20} color={ExtendedColors.white} />
        <ThemedText style={styles.createButtonText}>Create Template</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Templates",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/package-template/create")}
              style={styles.headerButton}
            >
              <Ionicons name="add" size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loadingText}>
            Loading templates...
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PackageTemplateItem
              item={item}
              onPress={() => router.push(`/package-template/${item._id}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            templates.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  templateItem: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  templateName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  templateInfo: {
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginLeft: 8,
  },
  chevron: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: Colors.gray[600],
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: ExtendedColors.white,
    fontWeight: "bold",
    marginLeft: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
  },
});
