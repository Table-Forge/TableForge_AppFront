import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

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
    color: colors.white,
  },
});
