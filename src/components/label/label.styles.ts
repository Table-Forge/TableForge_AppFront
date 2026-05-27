import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: DEFAULT_COLORS.textMutedLight,
    letterSpacing: 0.3,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
