import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ErrorMessage } from "@/src/components/error-message/error-message";
import { useScrollToFocusedInput } from "@/src/context/scroll-to-focused-input";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

interface ProgressInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  error?: string;
}

export const ProgressInput = ({
  value,
  onChange,
  min,
  max,
  error,
}: ProgressInputProps) => {
  const containerRef = useRef<View>(null);
  const { scrollToFocusedInput } = useScrollToFocusedInput();
  const normalizedMin = Math.min(min, max);
  const normalizedMax = Math.max(min, max);
  const range = Math.max(normalizedMax - normalizedMin, 1);
  const clampedValue = Math.min(
    Math.max(Number(value) || normalizedMin, normalizedMin),
    normalizedMax,
  );
  const progress = ((clampedValue - normalizedMin) / range) * 100;

  const handleChange = (newValue: number) => {
    onChange(
      Math.min(Math.max(Math.round(newValue), normalizedMin), normalizedMax),
    );
  };

  return (
    <View
      ref={containerRef}
      collapsable={false}
      style={styles.container}
      onTouchStart={() => scrollToFocusedInput(containerRef)}
    >
      <View style={[styles.wrapper, error && styles.wrapperError]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.labelInfo}>Tamanho do Grupo</Text>
          </View>

          <View style={styles.badge}>
            <Ionicons name="people" size={16} color={DEFAULT_COLORS.tertiary} />
            <Text style={styles.valueText}>{clampedValue}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={() => handleChange(clampedValue - 1)}
            disabled={clampedValue <= normalizedMin}
            style={({ pressed }) => [
              styles.stepButton,
              clampedValue <= normalizedMin && styles.stepButtonDisabled,
              pressed && styles.stepButtonPressed,
            ]}
          >
            <Ionicons name="remove" size={18} color={DEFAULT_COLORS.white} />
          </Pressable>

          <View style={styles.sliderArea}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <Slider
              style={styles.slider}
              minimumValue={normalizedMin}
              maximumValue={normalizedMax}
              value={clampedValue}
              onValueChange={handleChange}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={DEFAULT_COLORS.white}
              step={1}
            />
          </View>

          <Pressable
            onPress={() => handleChange(clampedValue + 1)}
            disabled={clampedValue >= normalizedMax}
            style={({ pressed }) => [
              styles.stepButton,
              clampedValue >= normalizedMax && styles.stepButtonDisabled,
              pressed && styles.stepButtonPressed,
            ]}
          >
            <Ionicons name="add" size={18} color={DEFAULT_COLORS.white} />
          </Pressable>
        </View>
      </View>

      {error && <ErrorMessage text={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 4,
  },
  wrapper: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.35)",
  },
  wrapperError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  labelInfo: {
    ...fonts.bold,
    fontSize: 12,
    color: DEFAULT_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(251, 69, 1, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary,
  },
  valueText: {
    fontSize: 18,
    ...fonts.heavy,
    color: DEFAULT_COLORS.tertiary,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(126, 135, 226, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.45)",
  },
  stepButtonPressed: {
    opacity: 0.8,
  },
  stepButtonDisabled: {
    opacity: 0.35,
  },
  sliderArea: {
    flex: 1,
    height: 36,
    justifyContent: "center",
  },
  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(126, 135, 226, 0.18)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: DEFAULT_COLORS.tertiary,
  },
  slider: {
    width: "100%",
    height: 36,
  },
});
