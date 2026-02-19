import { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { mainContainerStyles } from "./main-container.styles";
import { SafeAreaView } from "react-native-safe-area-context";

export const MainContainer = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={mainContainerStyles.container}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};
