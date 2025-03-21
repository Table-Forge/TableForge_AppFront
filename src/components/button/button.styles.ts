import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

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
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  tertiary: {
    backgroundColor: colors.tertiary,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: "#CBD5E0",
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
