import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import { DEFAULT_COLORS } from "@/src/theme/colors";

export const SwipeActionsContainer = ({ children, style, ...rest }: ViewProps) => {
  return (
    <View style={[styles.swipeActionsContainer, style]} {...rest}>
      {children}
    </View>
  );
};

export interface ISwipeActionBtnProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: "danger" | "edit" | "primary" | "secondary";
}

export const SwipeActionBtn = ({ onPress, children, variant = "primary" }: ISwipeActionBtnProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.swipeActionBtn,
        variant === "danger" && styles.dangerActionBtn,
        variant === "edit" && styles.editActionBtn,
        variant === "primary" && styles.primaryActionBtn,
        variant === "secondary" && styles.secondaryActionBtn,
      ]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  swipeActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    height: "100%",
  },
  swipeActionBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dangerActionBtn: {
    backgroundColor: DEFAULT_COLORS.danger,
  },
  editActionBtn: {
    backgroundColor: DEFAULT_COLORS.purpleBright,
  },
  primaryActionBtn: {
    backgroundColor: DEFAULT_COLORS.primary,
  },
  secondaryActionBtn: {
    backgroundColor: DEFAULT_COLORS.secondary,
  }
});
