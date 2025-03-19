import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

export const styles = StyleSheet.create({
  containerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  svgBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
  },
  container: {
    flexDirection: "row",
    top: 0,
    left: 0,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchItemWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    position: "relative",
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
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
});
