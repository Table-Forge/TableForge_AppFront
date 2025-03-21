import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text/themed-text";
import { styles } from "./button.styles";

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
}

export const Button = ({
  text,
  children,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary"
          ? styles.primary
          : variant === "secondary"
          ? styles.secondary
          : styles.tertiary,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {text ? (
            <ThemedText style={styles.text}>{text}</ThemedText>
          ) : children ? (
            children
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};
