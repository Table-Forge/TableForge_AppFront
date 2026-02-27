import { View, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text/themed-text";
import React from "react";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

const BORDER_COLOR = DEFAULT_COLORS.tertiary_30;

export const Tag = ({
  icon,
  text,
}: {
  icon?: (color: string) => React.ReactNode;
  text: string;
}) => {
  return (
    <View style={styles.wrapper}>
      {icon && (
        <View style={styles.iconContainer}>
          {typeof icon === "function" ? icon(BORDER_COLOR) : icon}
        </View>
      )}
      <ThemedText style={styles.text}>{text}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 6,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 11,
    ...fonts.medium,
    color: DEFAULT_COLORS.grays._50,
    letterSpacing: 0.3,
  },
});
