import { PropsWithChildren } from "react";
import { useSegments } from "expo-router";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOTTOM_TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 74;
const BOTTOM_TAB_BAR_OFFSET = 12;

interface IProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export const MainContainer = ({ children, style }: IProps) => {
  const segments = useSegments();
  const hasBottomTabs = segments[0] === "(tabs)";

  return (
    <SafeAreaView style={[styles.safe, style]}>
      <View
        style={[
          styles.container,
          hasBottomTabs && styles.containerWithBottomTabs,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 20,
  },
  containerWithBottomTabs: {
    paddingBottom: BOTTOM_TAB_BAR_HEIGHT + BOTTOM_TAB_BAR_OFFSET,
  },
});
