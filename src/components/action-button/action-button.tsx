import React from "react";
import { Pressable, StyleProp, ViewStyle, Text, View } from "react-native";

import { styles } from "@/src/components/action-button/action-button.styles";

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
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: "rgba(0,0,0,0.1)",
        borderless: variant === "circle",
      }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        backgroundColor ? { backgroundColor } : styles.defaultBg,
        pressed && { opacity: 0.8 },
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
