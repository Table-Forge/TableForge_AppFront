import { PropsWithChildren } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export const MainContainer = ({ children, style }: IProps) => {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]}>
      <View style={[styles.container, { flex: 1 }]}>{children}</View>
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
});
