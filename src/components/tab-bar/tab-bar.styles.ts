import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

const colors = DEFAULT_COLORS;

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "fixed",
    bottom: 0,
    left: 0,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    gap: 4,
    paddingBottom: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchItemWrapper: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    width: 80,
    height: 80,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
});
