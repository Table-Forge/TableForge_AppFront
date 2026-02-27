import React from "react";
import { ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "../themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import * as Haptics from "expo-haptics";
import { fonts } from "@/src/theme/fonts";

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
        (disabled || isLoading) && styles.disabled,
        pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      android_ripple={{ color: DEFAULT_COLORS.tertiary_20, borderless: false }}
    >
      {isLoading ? (
        <ActivityIndicator color="#f8f8f8" />
      ) : text ? (
        <ThemedText style={[styles.text, textSizeStyles[size]]}>
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
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: DEFAULT_COLORS.primary,
    borderColor: DEFAULT_COLORS.secondary,
  },
  secondary: {
    backgroundColor: DEFAULT_COLORS.secondary,
    borderColor: DEFAULT_COLORS.primary,
  },
  tertiary: {
    backgroundColor: DEFAULT_COLORS.tertiary,
    borderColor: DEFAULT_COLORS.primary,
  },
  sm: {
    minHeight: 40,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  md: {
    paddingHorizontal: 16,
    minHeight: 48,
  },
  lg: {
    paddingHorizontal: 16,
    minHeight: 58,
  },
  disabled: {
    backgroundColor: DEFAULT_COLORS.grays._100,
  },
  text: {
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
    textTransform: "uppercase",
  },
  textSm: {
    fontSize: 14,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 20,
  },
});
