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
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
