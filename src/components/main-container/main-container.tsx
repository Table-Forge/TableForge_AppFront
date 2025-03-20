import { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { styles } from "./main-container.styles";

export const MainContainer = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};
