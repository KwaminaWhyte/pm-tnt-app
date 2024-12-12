import {
  IdCardOutlined,
  PadlockOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@/components/icons/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { validateRegistrationForm } from "@/constants/validations";
import useForm from "@/hooks/useForm";
import axios from "axios";
import { router } from "expo-router";
import { AnimatePresence, MotiText, MotiView } from "moti";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RegistrationScreen() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
    initialValues,
    validateRegistrationForm
  );
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const [isLoading, setIsLoading] = useState(false);
  // Handle form submission
  const submitForm = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/user-auth/register`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      console.log(response.data);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.response.data ? "Invalid Credentials" : "Unexpected Error",
        text2:
          error.response.data?.errors[0]?.message ||
          "Something went wrong" + error.message,
      });
      console.error(JSON.stringify(error.response.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
        <ScrollView className="flex-1">
          <AnimatePresence>
            <MotiView className="flex-1 gap-y-4">
              {/* illustration */}
              <MotiView className="h-[23vh] overflow-hidden justify-center items-center">
                <Image
                  source={require("@/assets/images/illustrations/hotel-booking.png")}
                  className="object-contain w-[65%] h-full"
                />
              </MotiView>

              {/* form*/}
              <MotiView className="flex-1 px-4">
                {/* welcome text */}
                <MotiView className="mt-2 mb-6">
                  <MotiText className="font-bold text-3xl text-slate-900 dark:text-white">
                    Register Now!
                  </MotiText>
                  <Text className="text-slate-900 dark:text-white font text-sm opacity-50">
                    Create a free account
                  </Text>
                </MotiView>

                {/* login form */}
                <MotiView className="flex-1">
                  <View className="h-20">
                    <Input
                      value={values.firstName}
                      onChangeText={(text) => handleChange("firstName", text)}
                      placeholder="First Name"
                      startContent={
                        <IdCardOutlined className="text-slate-500 w-4 h-4" />
                      }
                      errorMessage={errors.firstName}
                    />
                  </View>
                  <View className="h-20">
                    <Input
                      value={values.lastName}
                      onChangeText={(text) => handleChange("lastName", text)}
                      placeholder="Last Name"
                      startContent={
                        <IdCardOutlined className="text-slate-500 w-4 h-4" />
                      }
                      errorMessage={errors.lastName}
                    />
                  </View>
                  <View className="h-20">
                    <Input
                      value={values.email}
                      onChangeText={(text) => handleChange("email", text)}
                      placeholder="Email"
                      startContent={
                        <UserOutlined className="text-slate-500 w-4 h-4" />
                      }
                      errorMessage={errors.email}
                    />
                  </View>
                  <View className="h-20">
                    <Input
                      value={values.phone}
                      onChangeText={(text) => handleChange("phone", text)}
                      placeholder="Phone"
                      startContent={
                        <PhoneOutlined className="text-slate-500 w-4 h-4" />
                      }
                      errorMessage={errors.phone}
                    />
                  </View>
                  <View className="h-20">
                    <PasswordInput
                      value={values.password}
                      onChangeText={(text) => handleChange("password", text)}
                      placeholder="Password"
                      startContent={
                        <PadlockOutlined className="text-slate-500 w-4 h-4" />
                      }
                      errorMessage={errors.password}
                    />
                  </View>
                  <View className="h-20">
                    <PasswordInput
                      value={values.confirmPassword}
                      onChangeText={(text) =>
                        handleChange("confirmPassword", text)
                      }
                      placeholder="Confirm Password"
                      startContent={
                        <PadlockOutlined className="text-slate-500 w-4 h-4" />
                      }
                      errorMessage={errors.confirmPassword}
                    />
                  </View>

                  <Button
                    isLoading={isLoading}
                    label="Sign Up"
                    onClick={handleSubmit(submitForm)}
                  />
                </MotiView>

                {/* create account link */}
                <MotiView className="flex-row items-center justify-center py-4">
                  <Text className="font text-slate-900 dark:text-white opacity-50">
                    Already have an account?{" "}
                  </Text>
                  <Pressable onPress={() => router.push("/login")}>
                    <Text className="font-medium text-yellow-500">Login</Text>
                  </Pressable>
                </MotiView>
              </MotiView>
            </MotiView>
          </AnimatePresence>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
