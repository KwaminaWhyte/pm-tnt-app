import React, { useEffect, useState } from "react";
import { Text, View, ImageBackground, Pressable } from "react-native";
import { MotiView, MotiText, AnimatePresence } from "moti";

export type HeroCarouselProps = {
  backgroundImage: string;
  title: string;
  description: string;
  ctaText?: string;
  handleButtonPress?: () => void;
};

const HeroCarousel = ({
  carouselData,
}: {
  carouselData: HeroCarouselProps[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="h-60 rounded-2xl overflow-hidden">
      {carouselData.map((item: HeroCarouselProps, index: number) => {
        const isVisible = index === currentIndex;
        return (
          <AnimatePresence key={index}>
            {isVisible && (
              <MotiView
                key={index}
                from={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{
                  type: "timing",
                  duration: 1000,
                }}
              >
                <ImageBackground
                  className="h-64"
                  source={{ uri: item.backgroundImage }}
                >
                  <View className="bg-black/60 h-full items-center justify-center px-5">
                    <MotiText className="font-semibold text-2xl text-white text-center mb-1">
                      {item.title}
                    </MotiText>
                    <MotiText className="text-white/70 font-light text-base text-center mb-2">
                      {item.description}
                    </MotiText>
                    {item.ctaText && (
                      <Pressable
                        onPress={item.handleButtonPress}
                        className="rounded-xl bg-yellow-500/80 h-11 items-center justify-center px-5"
                      >
                        <Text className="text-white font-medium text-base">
                          {item.ctaText}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </ImageBackground>
              </MotiView>
            )}
          </AnimatePresence>
        );
      })}
    </View>
  );
};

export default HeroCarousel;
