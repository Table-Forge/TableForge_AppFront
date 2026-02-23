import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  valueText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: DEFAULT_COLORS.white,
  },
});
