import React from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

import { ThemedText } from "../themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  text,
  children,
  onPress,
  disabled = false,
  isLoading = false,
  variant = "primary",
  size = "md",
}: ButtonProps) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
  };

  const variantTextStyles = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    tertiary: styles.textTertiary,
  };

  const sizeStyles = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  };

  const textSizeStyles = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        variant === "tertiary" && !disabled && SHADOWS.glow,
        (disabled || isLoading) && styles.disabled,
        pressed && { opacity: 0.92, transform: [{ scale: 0.97 }] },
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      android_ripple={{ color: DEFAULT_COLORS.white_10, borderless: false }}
    >
      {isLoading ? (
        <ActivityIndicator color={DEFAULT_COLORS.white} />
      ) : text ? (
        <ThemedText
          style={[styles.text, variantTextStyles[variant], textSizeStyles[size]]}
        >
          {text}
        </ThemedText>
      ) : (
        children
      )}
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 18,
    borderRadius: RADII.pill,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: SURFACES.fill,
    borderColor: BORDERS.highlight,
  },
  secondary: {
    backgroundColor: DEFAULT_COLORS.secondary,
    borderColor: BORDERS.highlightStrong,
  },
  tertiary: {
    backgroundColor: DEFAULT_COLORS.orange,
    borderColor: BORDERS.cta,
  },
  sm: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: RADII.pill,
  },
  md: {
    paddingHorizontal: 18,
    minHeight: 48,
  },
  lg: {
    paddingHorizontal: 22,
    minHeight: 56,
  },
  disabled: {
    backgroundColor: DEFAULT_COLORS.white_08,
    borderColor: DEFAULT_COLORS.white_10,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    ...fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  textPrimary: {
    color: DEFAULT_COLORS.white,
  },
  textSecondary: {
    color: DEFAULT_COLORS.white,
  },
  textTertiary: {
    color: DEFAULT_COLORS.white,
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 18,
  },
});
