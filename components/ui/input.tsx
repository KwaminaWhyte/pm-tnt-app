import { ReactNode, useRef } from "react";
import { Text, TextInput, View, useColorScheme } from "react-native";
import { MotiText } from "moti";

export const Input = ({
  value,
  onChangeText,
  startContent,
  label,
  placeholder,
  errorMessage,
  secureTextEntry,
  endContent,
}: {
  value?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  startContent?: ReactNode | undefined;
  endContent?: ReactNode | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  errorMessage?: string | undefined;
  secureTextEntry?: boolean;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View>
      {/* label */}
      {label && (
        <Text className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
          {label}
        </Text>
      )}

      {/* input wrapper */}
      <View className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex-row items-center px-4 border border-slate-200 dark:border-slate-700">
        {startContent && <View className="justify-center">{startContent}</View>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colorScheme === "dark" ? "#9ca3af" : "#6b7280"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          className="flex-1 ml-2 font text-black dark:text-white h-12"
        />
        {endContent && (
          <View className="justify-center ml-2">{endContent}</View>
        )}
      </View>

      {/* error message */}
      {errorMessage && (
        <MotiText
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 300, type: "timing" }}
          className="text-red-500 text-xs font-light mt-1"
          key={label}
        >
          {errorMessage}
        </MotiText>
      )}
    </View>
  );
};

export const OTPInput = ({
  value = "",
  length,
  setValue = () => {},
}: {
  value?: string;
  length: number;
  setValue?: (value: string) => void;
}) => {
  // Create an array of refs for the input fields
  const inputRefs = useRef<(TextInput | null)[]>(new Array(length).fill(null));

  // Handle text input change
  const handleChangeText = (text: string, index: number) => {
    // Update the value at the current index
    const newValue =
      value.substring(0, index) + text + value.substring(index + 1);

    // Update the state value
    setValue(newValue);

    // Move to the next field if the text length is 1
    if (text.length === 1 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press (backspace)
  const handleBackspace = (text: string, index: number) => {
    if (text === "" && index > 0) {
      // Move focus to the previous input if current is empty and index > 0
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle input event for text change
  const handleInputChange = (text: string, index: number) => {
    handleChangeText(text, index);
    handleBackspace(text, index);
  };

  // Create input fields
  const renderInputs = () => {
    return Array.from({ length }).map((_, index) => (
      <TextInput
        key={index}
        ref={(ref) => (inputRefs.current[index] = ref)}
        value={value[index] || ""}
        maxLength={1}
        keyboardType="number-pad"
        textAlign="center"
        onChangeText={(text) => handleInputChange(text, index)}
        className="flex-1 h-12 border border-slate-500 rounded-xl text-lg font text-slate-900 dark:text-white"
        // Disable the input if the previous input is empty (except the first one)
        editable={index === 0 || value[index - 1] !== ""}
      />
    ));
  };

  return <View className="flex-row gap-x-3">{renderInputs()}</View>;
};
