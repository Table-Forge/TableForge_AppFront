import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import { Control, useController } from "react-hook-form";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { ThemedText } from "../themed-text/themed-text";
import { useScrollToFocusedInput } from "@/src/context/scroll-to-focused-input";

interface IProps {
  name: string;
  control: Control<any>;
  label: string;
  description?: string;
}

export const ControlledToggle = ({
  name,
  control,
  label,
  description,
}: IProps) => {
  const { field } = useController({ name, control, defaultValue: false });
  const containerRef = useRef<View>(null);
  const { scrollToFocusedInput } = useScrollToFocusedInput();

  const translateX = useSharedValue(field.value ? 1 : 0);

  useEffect(() => {
    translateX.value = withSpring(field.value ? 1 : 0, { damping: 15 });
  }, [field.value]);

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 20 }],
  }));

  const animatedTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value,
      [0, 1],
      ["rgba(255, 255, 255, 0.1)", "rgba(251, 69, 1, 0.2)"],
    ),
    borderColor: interpolateColor(
      translateX.value,
      [0, 1],
      ["rgba(255, 255, 255, 0.2)", DEFAULT_COLORS.tertiary],
    ),
  }));

  return (
    <Pressable
      ref={containerRef}
      collapsable={false}
      onPress={() => {
        scrollToFocusedInput(containerRef);
        field.onChange(!field.value);
      }}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <ThemedText weight="bold" style={styles.label}>
          {label}
        </ThemedText>
        {description && (
          <ThemedText style={styles.description}>{description}</ThemedText>
        )}
      </View>

      <Animated.View style={[styles.track, animatedTrackStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            animatedThumbStyle,
            field.value && styles.thumbActive,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    gap: 10,
  },

  textContainer: { flex: 1 },
  label: { fontSize: 16, color: DEFAULT_COLORS.white },
  description: { fontSize: 13, color: DEFAULT_COLORS.grays._200, marginTop: 2 },

  track: {
    width: 48,
    height: 26,
    borderRadius: 15,
    borderWidth: 1.5,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DEFAULT_COLORS.grays._300,
  },
  thumbActive: {
    backgroundColor: DEFAULT_COLORS.white,
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});
