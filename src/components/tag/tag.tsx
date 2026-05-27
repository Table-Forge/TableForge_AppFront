import { View, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text/themed-text";
import React from "react";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";

const ICON_COLOR = DEFAULT_COLORS.purpleBright;

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
          {typeof icon === "function" ? icon(ICON_COLOR) : icon}
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
    backgroundColor: SURFACES.fill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: BORDERS.subtle,
    gap: 6,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 11,
    ...fonts.medium,
    color: DEFAULT_COLORS.white,
    letterSpacing: 0.3,
  },
});
