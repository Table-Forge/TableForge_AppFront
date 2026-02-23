import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  defaultBg: {
    backgroundColor: DEFAULT_COLORS.primary,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  pill: {
    paddingRight: 20,
    paddingLeft: 4,
    height: 45,
    borderRadius: 25,
    gap: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    color: DEFAULT_COLORS.white,
  },
  iconPill: {
    width: 38,
    height: 38,
    backgroundColor: "rgba(0,0,0,0.2)",
    color: DEFAULT_COLORS.white,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: DEFAULT_COLORS.secondary,
  },
  label: {
    color: DEFAULT_COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
