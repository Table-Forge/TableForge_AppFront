import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

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
    borderColor: colors.secondary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  optionError: {
    borderColor: colors.danger,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.white,
    textAlign: "center",
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: "500",
  },
});
