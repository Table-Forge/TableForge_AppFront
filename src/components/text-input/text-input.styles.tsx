import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    color: DEFAULT_COLORS.white,
    height: 52,
    borderRadius: 16,
    borderColor: "rgba(126, 135, 226, 0.45)",
    borderWidth: 1,
    paddingHorizontal: 16,
    shadowColor: DEFAULT_COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 1,
  },
  wrapperFocused: {
    borderColor: DEFAULT_COLORS.tertiary,
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  borderError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    backgroundColor: "rgba(126, 135, 226, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  statusMarkFocused: {
    backgroundColor: DEFAULT_COLORS.tertiary,
    borderColor: DEFAULT_COLORS.white,
  },
  statusMarkError: {
    backgroundColor: DEFAULT_COLORS.danger,
    borderColor: DEFAULT_COLORS.danger,
  },
});
