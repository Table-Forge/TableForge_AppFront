import { PropsWithChildren } from "react";
import { useSegments } from "expo-router";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export const MainContainer = ({ children, style }: IProps) => {
  const segments = useSegments();
  const hasBottomTabs = segments[0] === "(tabs)";

  return (
    <SafeAreaView style={[{ flex: 1 }, style]}>
      <View
        style={[
          styles.container,
          !hasBottomTabs && styles.containerWithoutBottomPadding,
          { flex: 1 },
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
  containerWithoutBottomPadding: {
    paddingBottom: 0,
  },
});
