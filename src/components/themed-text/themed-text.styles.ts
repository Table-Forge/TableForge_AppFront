import { DefaultTheme } from "@/src/theme/theme";
import { StyleSheet } from "react-native";

const { colors } = DefaultTheme;

export const styles = StyleSheet.create({
  text: {
    color: colors.text,
    display: "flex",
    gap: 4,
  },
});
