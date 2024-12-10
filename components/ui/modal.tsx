import { AnimatePresence, MotiView, View } from "moti";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Button, IconButton } from "./button";
import { CloseX } from "../icons/actions";

export default function Modal({
  open,
  setOpen,
  title,
  children,
  buttonText,
  contentHeight,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: ReactNode;
  buttonText?: string | undefined;
  contentHeight: number;
}) {
  // Handler for clicking outside the modal content
  const handleOverlayPress = () => {
    setOpen(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 300, type: "timing" }}
            className="h-screen w-screen absolute top-0 left-0 justify-center px-5 z-[999] bg-black/70"
          >
            <TouchableWithoutFeedback>
              <MotiView
                from={{
                  opacity: 0,
                  translateY: 50,
                  // scale: 1.2,
                }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                  // scale: 1,
                }}
                exit={{
                  translateY: 50,
                  opacity: 0,
                  // scale: 1.2,
                }}
                transition={{
                  type: "timing",
                  duration: 250,
                  delay: 100,
                }}
                className="rounded-3xl bg-white dark:bg-slate-800 px-3 py-3"
                style={{
                  height: contentHeight,
                }}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-slate-900 dark:text-white font-medium text-lg">
                    {title}
                  </Text>
                  <IconButton
                    color="danger"
                    icon={<CloseX className="w-5 h-5 text-red-500" />}
                    onClick={() => setOpen(false)}
                  />
                </View>

                <View className="flex-1 mb-4">{children}</View>

                <View className="flex-row items-center pb-5">
                  <Pressable className="bg-transparent border border-slate-400 dark:border-slate-500 rounded-full py-2 px-8 mr-2">
                    <Text className="font text-slate-900 dark:text-white">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable className="bg-yellow-400 rounded-full py-2 px-8">
                    <Text className="font-medium text-slate-950">
                      {buttonText || "Cancel"}
                    </Text>
                  </Pressable>
                </View>
              </MotiView>
            </TouchableWithoutFeedback>
          </MotiView>
        </TouchableWithoutFeedback>
      )}
    </AnimatePresence>
  );
}

export const CustomAlertModal = ({
  open,
  setOpen,
  children,
  classNames,
  handleOk,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  classNames?: {
    wrapper?: string | undefined;
    container?: string | undefined;
  };
  handleOk?: () => void;
}) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300 }}
          className={`absolute h-screen w-screen top-0 left-0 bg-black/50 items-center justify-center`}
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => setOpen(false)}
        >
          <MotiView
            from={{
              translateY: 30,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              translateY: -30,
            }}
            transition={{
              type: "timing",
              duration: 300,
              delay: 50,
            }}
            className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-300/30 dark:border-white/5 h-40 w-[80%] px-4 py-3 flex-col ${classNames?.wrapper}`}
            onStartShouldSetResponder={() => true}
            onResponderRelease={(e) => {
              // Prevent click from propagating to parent
              e.stopPropagation();
            }}
          >
            <MotiView className={`flex-1 ${classNames?.container} `}>
              {children}
            </MotiView>

            <MotiView className="flex-row justify-end">
              <Pressable
                className="h-9 rounded-lg bg-slate-500/20 dark:bg-slate-600/30 items-center justify-center px-6 mr-4"
                onPress={() => setOpen(false)}
              >
                <Text className="text-slate-700 dark:text-white/70 text-base font-semibold">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                className="h-9 rounded-lg bg-blue-600/20 items-center justify-center px-6"
                onPress={handleOk}
              >
                <Text className="text-blue-600 text-base font-semibold">
                  OK
                </Text>
              </Pressable>
            </MotiView>
          </MotiView>
        </MotiView>
      )}
    </AnimatePresence>
  );
};
