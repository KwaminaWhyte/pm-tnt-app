import {
  IdCardOutlined,
  PadlockOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@/components/icons/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
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
import { useToast } from "react-native-toast-notifications";

export default function RegistrationScreen() {
  const toast = useToast();
  const baseUrl = process.env.PM_TNT_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (data: typeof values) => {
    const errors: Record<string, string> = {};

    if (!data.firstName) {
      errors.firstName = "First name is required";
    }
    if (!data.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }
    if (!data.phone) {
      errors.phone = "Phone number is required";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const resetForm = () => {
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        // Show first validation error
        const firstError = Object.values(validationErrors)[0];
        toast.show(firstError, { type: "danger" });
        setErrors(validationErrors);
        return;
      }

      const response = await axios.post(`${baseUrl}/user-auth/register`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      console.log(response.data);
    } catch (error: any) {
      toast.show("Failed to register! " + error?.response?.data?.message, {
        type: "danger",
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
              <Input
                value={values.firstName}
                onChangeText={(text) => handleChange("firstName", text)}
                placeholder="First Name"
                startContent={
                  <IdCardOutlined className="w-5 h-5 text-slate-500" />
                }
                errorMessage={errors.firstName}
              />

              <Input
                value={values.lastName}
                onChangeText={(text) => handleChange("lastName", text)}
                placeholder="Last Name"
                startContent={
                  <IdCardOutlined className="w-5 h-5 text-slate-500" />
                }
                errorMessage={errors.lastName}
              />

              <Input
                value={values.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Email"
                startContent={
                  <UserOutlined className="w-5 h-5 text-slate-500" />
                }
                errorMessage={errors.email}
              />

              <Input
                value={values.phone}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder="Phone"
                startContent={
                  <PhoneOutlined className="w-5 h-5 text-slate-500" />
                }
                errorMessage={errors.phone}
              />

              <PasswordInput
                value={values.password}
                onChangeText={(text) => handleChange("password", text)}
                placeholder="Password"
                startContent={
                  <PadlockOutlined className="w-5 h-5 text-slate-500" />
                }
                errorMessage={errors.password}
              />

              <PasswordInput
                value={values.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                placeholder="Confirm Password"
                startContent={
                  <PadlockOutlined className="w-5 h-5 text-slate-500" />
                }
                errorMessage={errors.confirmPassword}
              />

              <Button
                isLoading={isLoading}
                label="Create Account"
                onClick={handleSubmit}
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
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
