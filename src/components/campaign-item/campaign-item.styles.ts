import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 8,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 10,
  },
  imageWrapper: {
    width: 360 * 0.3,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  tags: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
});
