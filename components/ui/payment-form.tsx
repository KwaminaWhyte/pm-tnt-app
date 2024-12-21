import { useState } from "react";
import { View, TextInput, ScrollView, Pressable, Image } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type PaymentFormProps = {
  onClose: () => void;
  amount: number;
  hotelName: string;
  bookingData: any; // Add bookingData to the interface
};

export const PaymentForm = ({ onClose, amount, hotelName, bookingData }: PaymentFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal'>('card');

  return (
    <ThemedView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <ThemedText className="text-lg font-semibold">Payment Details</ThemedText>
        <Pressable onPress={onClose} className="p-2">
          <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="space-y-6 py-4">
          {/* Booking Summary */}
          <View className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
            <ThemedText className="text-sm font-medium mb-2">Booking Summary</ThemedText>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <ThemedText className="text-gray-600 dark:text-gray-400">Hotel</ThemedText>
                <ThemedText className="font-medium">{hotelName}</ThemedText>
              </View>
              <View className="flex-row justify-between">
                <ThemedText className="text-gray-600 dark:text-gray-400">Amount</ThemedText>
                <ThemedText className="font-medium text-yellow-500">${amount}</ThemedText>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View>
            <ThemedText className="text-sm font-medium mb-3">Payment Method</ThemedText>
            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setSelectedMethod('card')}
                className={`flex-1 p-4 rounded-xl border ${
                  selectedMethod === 'card'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <View className="items-center space-y-2">
                  <MaterialCommunityIcons
                    name="credit-card"
                    size={24}
                    color={selectedMethod === 'card' ? '#eab308' : '#6b7280'}
                  />
                  <ThemedText className="text-sm">Credit Card</ThemedText>
                </View>
              </Pressable>
              <Pressable
                onPress={() => setSelectedMethod('paypal')}
                className={`flex-1 p-4 rounded-xl border ${
                  selectedMethod === 'paypal'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <View className="items-center space-y-2">
                  <FontAwesome5
                    name="paypal"
                    size={24}
                    color={selectedMethod === 'paypal' ? '#eab308' : '#6b7280'}
                  />
                  <ThemedText className="text-sm">PayPal</ThemedText>
                </View>
              </Pressable>
            </View>
          </View>

          {selectedMethod === 'card' ? (
            <View className="space-y-4">
              {/* Card Number */}
              <View>
                <ThemedText className="text-sm mb-1 font-medium">Card Number</ThemedText>
                <View className="relative">
                  <TextInput
                    placeholder="1234 5678 9012 3456"
                    className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white pr-12"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                  <MaterialCommunityIcons
                    name="credit-card"
                    size={24}
                    color="#6b7280"
                    style={{ position: 'absolute', right: 12, top: 12 }}
                  />
                </View>
              </View>

              {/* Card Holder */}
              <View>
                <ThemedText className="text-sm mb-1 font-medium">Card Holder Name</ThemedText>
                <TextInput
                  placeholder="John Doe"
                  className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Expiry and CVV */}
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <ThemedText className="text-sm mb-1 font-medium">Expiry Date</ThemedText>
                  <TextInput
                    placeholder="MM/YY"
                    className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-sm mb-1 font-medium">CVV</ThemedText>
                  <View className="relative">
                    <TextInput
                      placeholder="123"
                      className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-900 dark:text-white pr-12"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      secureTextEntry
                    />
                    <MaterialCommunityIcons
                      name="help-circle-outline"
                      size={24}
                      color="#6b7280"
                      style={{ position: 'absolute', right: 12, top: 12 }}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="items-center py-8 space-y-4">
              <Image
                source={{ uri: 'https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png' }}
                style={{ width: 200, height: 51 }}
                resizeMode="contain"
              />
              <ThemedText className="text-center text-gray-600 dark:text-gray-400">
                You will be redirected to PayPal to complete your payment securely.
              </ThemedText>
            </View>
          )}

          {/* Save Card Option */}
          {selectedMethod === 'card' && (
            <View className="flex-row items-center space-x-2">
              <MaterialCommunityIcons name="checkbox-marked" size={24} color="#eab308" />
              <ThemedText className="text-sm">Save card for future payments</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Pressable className="bg-yellow-500 p-4 rounded-xl flex-row justify-center items-center">
          <ThemedText className="text-white font-semibold text-lg">
            Pay ${amount}
          </ThemedText>
        </Pressable>
        <ThemedText className="text-center text-xs mt-2 text-gray-600 dark:text-gray-400">
          Your payment information is secure and encrypted
        </ThemedText>
      </View>
    </ThemedView>
  );
};
