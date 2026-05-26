import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
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
  }, [value]);

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
      ["rgba(255, 255, 255, 0.05)", "rgba(251, 69, 1, 0.15)"],
    ),
    borderColor: interpolateColor(
      translateX.value,
      [0, 1],
      ["rgba(255, 255, 255, 0.2)", DEFAULT_COLORS.tertiary],
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
    backgroundColor: DEFAULT_COLORS.grays._300,
  },
  thumbActive: {
    backgroundColor: DEFAULT_COLORS.white,
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 4,
  },
});
