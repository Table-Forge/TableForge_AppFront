import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native";
import { styles } from "./main-container.styles";

export const MainContainer = ({ children }: PropsWithChildren) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};
