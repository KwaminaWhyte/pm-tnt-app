import { UserOutlined } from "@/components/icons/auth";
import {
  HeartOutlined,
  LockOutlined,
  MapOutlined,
  QuestionCircleOutlined,
  ShoppingCart,
} from "@/components/icons/profile";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { PhWarningCircleDuotone } from "@/components/icons/phosphorus";
import { useAlertModal } from "@/context/AlertModalContext";
import { useAuth } from "@/context/AuthContext";

const WelcomeScreen = () => {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 px-4 items-center justify-center">
      <View className="items-center mb-8">
        <Image
          source={
            colorScheme === "dark"
              ? require("@/assets/images/dark-no-globe.png")
              : require("@/assets/images/no-globe.png")
          }
          className="w-48 h-48"
          resizeMode="contain"
        />
        <ThemedText type="title" className="font-bold mt-4 text-center">
          WELCOME TO PM TRIPPERS
        </ThemedText>
        <ThemedText className="text-base font-light text-center mt-2 text-slate-600 dark:text-slate-400">
          Sign in to access your profile, bookings, and travel preferences
        </ThemedText>
      </View>

      <View className="w-full gap-y-5 px-6">
        <Pressable
          onPress={() => router.push("/login" as Href)}
          className="h-14 bg-yellow-500 rounded-2xl items-center justify-center"
        >
          <Text className="font-medium text-lg text-white">Sign In</Text>
        </Pressable>

        <View className="flex-row items-center justify-center mt-4">
          <View className="flex-1 h-[1px] bg-slate-300 dark:bg-slate-700" />
          <ThemedText className="mx-4 font-light">or</ThemedText>
          <View className="flex-1 h-[1px] bg-slate-300 dark:bg-slate-700" />
        </View>

        <Pressable
          onPress={() => router.push("/register" as Href)}
          className="h-14 bg-transparent border-2 border-yellow-500 rounded-2xl items-center justify-center"
        >
          <Text className="text-yellow-500 font-medium text-lg">
            Create Account
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const LoggedInProfile = () => {
  const colorScheme = useColorScheme();
  const { logout, auth } = useAuth();
  const { top } = useSafeAreaInsets();
  const { showAlert } = useAlertModal();

  const handleSignOut = () => {
    showAlert(
      <View className="pt-4">
        <ThemedText className="font-light text-base text-red-500">
          Are you sure you want to sign out?
        </ThemedText>
      </View>,
      () => {
        logout();
      }
    );
  };

  const profileNav = [
    {
      label: "Personal Information",
      path: "/personal-info",
      icon: (
        <UserOutlined
          className={`w-6 h-6 text-yellow-400 ${
            colorScheme === "dark" && "opacity-60"
          } mr-2`}
        />
      ),
    },
    {
      label: "Addresses",
      path: "/addresses",
      icon: (
        <MapOutlined
          className={`w-6 h-6 text-yellow-400 ${
            colorScheme === "dark" && "opacity-60"
          } mr-2`}
        />
      ),
    },
    {
      label: "Bookings",
      path: "/bookings",
      icon: (
        <ShoppingCart
          className={`w-6 h-6 text-yellow-400 ${
            colorScheme === "dark" && "opacity-60"
          } mr-2`}
        />
      ),
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      icon: (
        <HeartOutlined
          className={`w-6 h-6 text-yellow-400 ${
            colorScheme === "dark" && "opacity-60"
          } mr-2`}
        />
      ),
    },
    {
      label: "Security",
      path: "/security",
      icon: (
        <LockOutlined
          className={`w-6 h-6 text-yellow-400 ${
            colorScheme === "dark" && "opacity-60"
          } mr-2`}
        />
      ),
    },
    {
      label: "Help & Support",
      path: "/support",
      icon: (
        <QuestionCircleOutlined
          className={`w-6 h-6 text-yellow-400 ${
            colorScheme === "dark" && "opacity-60"
          } mr-2`}
        />
      ),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950">
      {/* Profile Header */}
      <View className="items-center pt-4 pb-6">
        <Image
          source={require("@/assets/images/profile.png")}
          // source={{
          //   uri: "https://t3.ftcdn.net/jpg/04/77/87/44/360_F_477874414_kSQ9ip26804g8B3ItYsh5XsjNRgqf693.jpg",
          // }}
          className="rounded-full w-32 h-32"
        />
        <Text className="text-slate-800 dark:text-white text-2xl font-semibold mt-3">
          {auth?.user?.firstName + " " + auth?.user?.lastName}
        </Text>
        <Text className="text-slate-500 font-light text-sm">
          {auth?.user?.email}
        </Text>
      </View>

      {/* Navigation Items */}
      <View className=" py-6">
        <View className="bg-white dark:bg-slate-900">
          {profileNav.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(item.path as Href)}
              className="flex-row items-center h-14 px-4 border-b border-slate-100 dark:border-slate-800"
            >
              {item.icon}
              <ThemedText className="flex-1 font">{item.label}</ThemedText>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colorScheme === "dark" ? "#94a3b8" : "#64748b"}
              />
            </Pressable>
          ))}
        </View>

        <View className="px-4">
          <Pressable
            onPress={handleSignOut}
            className="mt-8 h-14 bg-red-500 rounded-2xl items-center justify-center"
          >
            <Text className="text-white font-medium text-base">Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default function Profile() {
  const { auth, authLoading } = useAuth();

  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center">
        <ThemedText className="font">Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      {auth ? <LoggedInProfile /> : <WelcomeScreen />}
    </SafeAreaView>
  );
}
