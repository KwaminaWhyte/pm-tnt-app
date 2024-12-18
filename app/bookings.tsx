import { ErrorScreen } from "@/components/screens/error";
import { WishlistsSkeleton } from "@/components/skeletons/wishlists";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/data/fetcher";
import { View, Text, FlatList, Pressable } from "react-native";
import useSWR from "swr";

export default function Bookings() {
  const { auth } = useAuth();
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/bookings`,
    fetcher(auth?.token)
  );

  if (data) console.log(JSON.stringify(data, null, 2));
  if (error)
    console.log(JSON.stringify(error.response?.data?.message, null, 2));
  return (
    <View>
      {isLoading && <WishlistsSkeleton />}
      {error && <ErrorScreen />}
      {data && data?.data?.bookings.length > 0 && (
        <FlatList
          data={data?.data?.bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable className="flex-row mb-2 bg-white dark:bg-slate-900 p-2 rounded-2xl">
              <Text>{item.bookingReference}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
