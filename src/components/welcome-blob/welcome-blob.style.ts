import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

export const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    padding: 4,
    paddingRight: 16,
    borderRadius: 50,
  },
  imageWrapper: {
    width: 42,
    height: 42,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
