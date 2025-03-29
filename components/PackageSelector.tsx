import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "../constants/Colors";

// Ensure Colors is available by providing fallbacks
const PRIMARY_COLOR = Colors?.primary || "#0a7ea4";
const GRAY_COLORS = {
  200: Colors?.gray?.[200] || "#E6E8EB",
  400: Colors?.gray?.[400] || "#9BA1A6",
  600: Colors?.gray?.[600] || "#687076",
};
const ICON_COLOR = Colors?.light?.icon || "#687076";
const BACKGROUND_COLOR = Colors?.light?.background || "#FFFFFF";

// Define a proper type for the package object
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
}

interface PackageCardProps {
  package: PackageType;
  isSelected: boolean;
  onSelect: (pkg: PackageType) => void;
}

interface PackageSelectorProps {
  packages: PackageType[];
  selectedPackage: PackageType | null;
  onSelectPackage: (pkg: PackageType) => void;
}

const PackageCard = ({
  package: pkg,
  isSelected,
  onSelect,
}: PackageCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.packageCard, isSelected && styles.selectedCard]}
      onPress={() => onSelect(pkg)}
      activeOpacity={0.7}
    >
      <View style={styles.packageImageContainer}>
        {pkg.images && pkg.images.length > 0 ? (
          <Image
            source={{ uri: pkg.images[0] }}
            style={styles.packageImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.packageImage, styles.noImage]}>
            <Ionicons name="image-outline" size={36} color={GRAY_COLORS[400]} />
          </View>
        )}
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Ionicons name="checkmark-circle" size={32} color={ICON_COLOR} />
          </View>
        )}
      </View>

      <View style={styles.packageInfo}>
        <ThemedText style={styles.packageName} numberOfLines={1}>
          {pkg.name}
        </ThemedText>

        <View style={styles.packageMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={ICON_COLOR} />
            <ThemedText style={styles.metaText}>
              {pkg.duration?.days || "?"} days
            </ThemedText>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={16} color={PRIMARY_COLOR} />
            <ThemedText style={styles.metaText}>
              ${pkg.price?.toLocaleString() || "?"}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PackageSelector = ({
  packages,
  selectedPackage,
  onSelectPackage,
}: PackageSelectorProps) => {
  // Add a null check for safety
  if (!packages || packages.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={24}
          color={GRAY_COLORS[400]}
        />
        <ThemedText style={styles.emptyText}>No packages available</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {packages.map((pkg) => (
          <PackageCard
            key={pkg._id}
            package={pkg}
            isSelected={selectedPackage?._id === pkg._id}
            onSelect={onSelectPackage}
          />
        ))}
      </ScrollView>

      {selectedPackage && (
        <ThemedView style={styles.selectedInfo}>
          <ThemedText style={styles.selectedTitle}>Selected Package</ThemedText>
          <ThemedText style={styles.selectedName}>
            {selectedPackage.name}
          </ThemedText>
          <ThemedText style={styles.selectedDescription} numberOfLines={3}>
            {selectedPackage.description || "No description available"}
          </ThemedText>

          <View style={styles.packageDetails}>
            <View style={styles.detailItem}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={PRIMARY_COLOR}
              />
              <ThemedText style={styles.detailText}>
                {selectedPackage.duration?.days || "?"} days,{" "}
                {selectedPackage.duration?.nights || "?"} nights
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={18} color={ICON_COLOR} />
              <ThemedText style={styles.detailText}>
                Max {selectedPackage.maxParticipants || "?"} participants
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={18} color={ICON_COLOR} />
              <ThemedText style={styles.detailText}>
                ${selectedPackage.price?.toLocaleString() || "?"} per person
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginVertical: 12,
  },
  emptyText: {
    marginTop: 8,
    color: GRAY_COLORS[600],
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  packageCard: {
    width: 200,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  selectedCard: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
  },
  packageImageContainer: {
    position: "relative",
    height: 120,
    width: "100%",
  },
  packageImage: {
    height: "100%",
    width: "100%",
  },
  noImage: {
    backgroundColor: GRAY_COLORS[200],
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 16,
    padding: 2,
  },
  packageInfo: {
    padding: 12,
  },
  packageName: {
    fontSize: 16,
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
  selectedInfo: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  selectedTitle: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  selectedName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectedDescription: {
    fontSize: 14,
    marginBottom: 16,
    color: GRAY_COLORS[600],
  },
  packageDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default PackageSelector;
