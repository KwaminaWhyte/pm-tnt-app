import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <ThemedText>Trip</ThemedText>
    </SafeAreaView>
  );
}
