import { DEFAULT_COLORS } from "@/src/theme/colors";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: SURFACES.fill,
    color: DEFAULT_COLORS.white,
    height: 52,
    borderRadius: RADII.md,
    borderColor: BORDERS.highlight,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  wrapperFocused: {
    borderColor: BORDERS.highlightStrong,
    backgroundColor: SURFACES.fillStrong,
  },
  borderError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: DEFAULT_COLORS.white,
  },
  icon: {
    marginRight: 10,
  },
  statusMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: DEFAULT_COLORS.purpleBorder_35,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_65,
  },
  statusMarkFocused: {
    backgroundColor: DEFAULT_COLORS.purpleBright,
    borderColor: DEFAULT_COLORS.white,
  },
  statusMarkError: {
    backgroundColor: DEFAULT_COLORS.danger,
    borderColor: DEFAULT_COLORS.danger,
  },
});
