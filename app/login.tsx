import { PadlockOutlined, UserOutlined } from "@/components/icons/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/context/AuthContext";
import useForm from "@/hooks/useForm";
import axios from "axios";
import { Href, router } from "expo-router";
import { AnimatePresence, MotiText, MotiView } from "moti";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { login, auth } = useAuth();

  const validate = (values: any) => {
    let errors: any = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const initialValues = { email: "", password: "" };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
    initialValues,
    validate
  );

  // Handle form submission
  const [isLoading, setIsLoading] = useState(false);
  const submitForm = async () => {
    console.log({ auth, values });

    setIsLoading(true);
    try {
      // check for validation errors
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        // show toast message based on error
        Toast.show({
          type: "error",
          text1: "Invalid Credentials",
          text2: validationErrors.email || validationErrors.password,
        });
        return;
      }

      const response = await axios.post(`${baseUrl}/user-auth/login/email`, {
        email: values.email,
        password: values.password,
      });

      login(response.data);
      resetForm();
      router.push("/profile" as Href);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));

      Toast.show({
        type: "error",
        text1: error.response.data ? "Invalid Credentials" : "Unexpected Error",
        text2:
          error.response.data?.errors[0]?.message ||
          "Something went wrong" + error.message,
      });
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
              <MotiView className="items-center justify-center">
                <Image
                  source={require("@/assets/images/illustrations/journey.png")}
                  className="w-56 h-56 object-contain"
                />
              </MotiView>

              {/* form*/}
              <MotiView className="flex-1 px-4 gap-y-8">
                {/* welcome text */}
                <MotiView>
                  <MotiText className="font-bold text-3xl text-slate-900 dark:text-white">
                    Welcome back!
                  </MotiText>
                  <Text className="text-slate-900 dark:text-white font text-sm opacity-50">
                    Sign in to your account
                  </Text>
                </MotiView>

                {/* login form */}
                <MotiView className="flex-1">
                  <View className="space-y-6">
                    <View>
                      <Input
                        value={values.email}
                        onChangeText={(text) => handleChange("email", text)}
                        placeholder="Email"
                        startContent={
                          <UserOutlined className="w-5 h-5 text-slate-500" />
                        }
                        errorMessage={errors.email}
                      />
                    </View>

                    <View>
                      <PasswordInput
                        value={values.password}
                        onChangeText={(text) => handleChange("password", text)}
                        placeholder="Password"
                        startContent={
                          <PadlockOutlined className="w-5 h-5 text-slate-500" />
                        }
                        errorMessage={errors.password}
                      />
                    </View>

                    <View className="flex-row justify-end">
                      <Pressable>
                        <Text className="font-medium text-yellow-500">
                          Forgot password?
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <View className="mt-8">
                    <Button
                      isLoading={isLoading}
                      label="Sign In"
                      variant="solid"
                      onClick={submitForm}
                    />
                  </View>
                </MotiView>

                {/* create account link */}
                <MotiView className="flex-row items-center justify-center py-4">
                  <Text className="font text-slate-900 dark:text-white opacity-50">
                    Don't have an account?{" "}
                  </Text>
                  <Pressable onPress={() => router.push("/register" as Href)}>
                    <Text className="font-medium text-yellow-500">
                      Create account
                    </Text>
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
