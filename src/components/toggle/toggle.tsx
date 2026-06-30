import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { DEFAULT_COLORS } from "@/src/theme/colors";
import { ErrorMessage } from "@/src/components/error-message/error-message";

interface IProps {
  error?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export const Toggle = ({ value, onValueChange, error, disabled }: IProps) => {
  const translateX = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    translateX.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value, translateX]);

  const toggleHandle = () => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 22 }],
  }));

  const animatedTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value,
      [0, 1],
      [DEFAULT_COLORS.white_08, DEFAULT_COLORS.purpleBright],
    ),
    borderColor: interpolateColor(
      translateX.value,
      [0, 1],
      [DEFAULT_COLORS.white_16, DEFAULT_COLORS.purpleBorder_65],
    ),
  }));

  return (
    <>
      <Pressable
        onPress={toggleHandle}
        style={[styles.trackContainer, disabled && styles.disabled]}
        disabled={disabled}
      >
        <Animated.View style={[styles.track, animatedTrackStyle]}>
          <Animated.View
            style={[
              styles.thumb,
              animatedThumbStyle,
              value && styles.thumbActive,
            ]}
          />
        </Animated.View>
      </Pressable>

      {error && <ErrorMessage text={error} />}
    </>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    paddingVertical: 4,
  },
  disabled: {
    opacity: 0.55,
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: DEFAULT_COLORS.textMutedLight,
  },
  thumbActive: {
    backgroundColor: DEFAULT_COLORS.white,
    shadowColor: DEFAULT_COLORS.purpleBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
});
