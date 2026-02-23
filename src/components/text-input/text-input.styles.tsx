import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
    color: DEFAULT_COLORS.white,
    height: 48,
    borderRadius: 16,
    borderColor: DEFAULT_COLORS.secondary,
    borderWidth: 1,
    paddingHorizontal: 16,
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
});
