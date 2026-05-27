import { fonts } from "@/src/theme/fonts";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ColorValue,
  Pressable,
  StyleProp,
  ViewStyle,
  Text,
  View,
  StyleSheet,
} from "react-native";

interface IProps {
  onPress?: () => void;
  icon?: React.ReactNode;
  label?: string;
  variant?: "pill" | "circle";
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  active?: boolean;
  glow?: boolean;
}

export const ActionButton = ({
  onPress,
  icon,
  label,
  variant = "circle",
  style,
  backgroundColor,
  active = false,
  glow = false,
}: IProps) => {
  const isPill = variant === "pill";

  const gradientColors: [ColorValue, ColorValue] = backgroundColor
    ? [backgroundColor, backgroundColor]
    : active
      ? [DEFAULT_COLORS.orange, DEFAULT_COLORS.orangeDark]
      : [DEFAULT_COLORS.homeSurfaceLight_95, DEFAULT_COLORS.homeSurface_95];

  const shadowColor =
    active || backgroundColor
      ? DEFAULT_COLORS.orange
      : DEFAULT_COLORS.purpleBright;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: DEFAULT_COLORS.white_08,
        borderless: variant === "circle",
      }}
      style={({ pressed }) => [
        styles.pressable,
        styles[variant],
        {
          shadowColor,
        },
        glow && styles.glow,
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          styles[`${variant}Gradient`],
          active && styles.activeBorder,
        ]}
      >
        {icon && (
          <View
            style={[
              styles.iconContainer,
              isPill && styles.iconPill,
              active && isPill && styles.iconPillActive,
            ]}
          >
            {icon}
          </View>
        )}

        {isPill && label && (
          <Text
            numberOfLines={1}
            style={[styles.label, active && styles.activeLabel]}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,

    elevation: 8,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },

  glow: {
    shadowOpacity: 0.42,
    shadowRadius: 18,
    elevation: 12,
  },

  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  pill: {
    minWidth: 150,
    maxWidth: 245,
    height: 52,
    borderRadius: 999,
  },

  gradient: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_35,
    overflow: "hidden",
  },

  circleGradient: {
    borderRadius: 26,
  },

  pillGradient: {
    borderRadius: 999,
    justifyContent: "flex-start",
    paddingLeft: 6,
    paddingRight: 18,
    gap: 10,
  },

  activeBorder: {
    borderColor: DEFAULT_COLORS.orangeBorder_85,
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  iconPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: DEFAULT_COLORS.black_22,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_65,
  },

  iconPillActive: {
    backgroundColor: DEFAULT_COLORS.black_25,
    borderColor: DEFAULT_COLORS.white_25,
  },

  label: {
    flex: 1,
    color: DEFAULT_COLORS.white,
    fontSize: 14,
    letterSpacing: 0.2,
    ...fonts.medium,
  },

  activeLabel: {
    color: DEFAULT_COLORS.white,
  },
});
