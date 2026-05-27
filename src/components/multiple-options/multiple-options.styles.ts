import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    backgroundColor: SURFACES.fill,
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    borderColor: BORDERS.highlightStrong,
    backgroundColor: DEFAULT_COLORS.purpleBright,
  },
  optionError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  optionText: {
    fontSize: 14,
    ...fonts.regular,
    color: DEFAULT_COLORS.white,
    textAlign: "center",
  },
  optionTextSelected: {
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
});
