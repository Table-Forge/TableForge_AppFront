import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Platform, StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

export const styles = StyleSheet.create({
  containerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 80 : 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  svgBackground: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: Platform.OS === "ios" ? 80 : 70,
  },
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: "100%",
  },
  searchItemWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  searchItemButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 100,
    aspectRatio: 1,
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
    top: -50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
