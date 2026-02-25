import { DEFAULT_COLORS } from "@/src/theme/colors";
import React from "react";
import {
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
}

export const ActionButton = ({
  onPress,
  icon,
  label,
  variant = "circle",
  style,
  backgroundColor,
}: IProps) => {
  const shadowColor = backgroundColor || DEFAULT_COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: "rgba(0,0,0,0.1)",
        borderless: variant === "circle",
      }}
      style={({ pressed }) => [
        styles.base,
        { shadowColor: shadowColor },
        styles[variant],
        backgroundColor ? { backgroundColor } : styles.defaultBg,
        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
        style,
      ]}
    >
      {icon && (
        <View
          style={[styles.iconContainer, variant === "pill" && styles.iconPill]}
        >
          {icon}
        </View>
      )}

      {variant === "pill" && label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  defaultBg: {
    backgroundColor: DEFAULT_COLORS.primary,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  pill: {
    paddingRight: 20,
    paddingLeft: 4,
    height: 45,
    borderRadius: 25,
    gap: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    color: DEFAULT_COLORS.white,
  },
  iconPill: {
    width: 38,
    height: 38,
    backgroundColor: "rgba(0,0,0,0.2)",
    color: DEFAULT_COLORS.white,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary,
  },
  label: {
    color: DEFAULT_COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
