import { PropsWithChildren } from "react";
import { useSegments } from "expo-router";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOTTOM_TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 74;

interface IProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  /**
   * Quando true, o container ignora o inset do topo (status bar).
   * Use em telas com banner/hero que devem se estender por baixo da status bar.
   */
  edgeToEdge?: boolean;
}

export const MainContainer = ({
  children,
  style,
  edgeToEdge = false,
}: IProps) => {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const hasBottomTabs = segments[0] === "(tabs)";

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: edgeToEdge ? 0 : insets.top,
          paddingBottom:
            insets.bottom + (hasBottomTabs ? BOTTOM_TAB_BAR_HEIGHT : 0),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
});
