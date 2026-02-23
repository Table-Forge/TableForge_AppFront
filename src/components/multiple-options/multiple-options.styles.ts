import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.secondary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    borderColor: DEFAULT_COLORS.secondary,
    backgroundColor: DEFAULT_COLORS.secondary,
  },
  optionError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "400",
    color: DEFAULT_COLORS.white,
    textAlign: "center",
  },
  optionTextSelected: {
    color: DEFAULT_COLORS.primary,
    fontWeight: "500",
  },
});
