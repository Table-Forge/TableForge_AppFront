import { DEFAULT_COLORS } from "@/src/theme/colors";
import { SURFACES } from "@/src/theme/tokens";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export const LoadingOverlay = () => {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" color={DEFAULT_COLORS.purpleBright} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SURFACES.overlayStrong,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
