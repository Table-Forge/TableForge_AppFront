import { fonts } from "@/src/theme/fonts";
import { PropsWithChildren } from "react";
import { Text, TextStyle } from "react-native";
import { styles } from "./themed-text.styles";

type FontWeight = keyof typeof fonts;

interface IProps {
  style?: TextStyle | TextStyle[];
  weight?: FontWeight;
}

export const ThemedText = ({
  style,
  children,
  weight = "regular",
}: PropsWithChildren & IProps) => {
  const fontWeightStyle = fonts[weight] || fonts.regular;

  return <Text style={[styles.text, fontWeightStyle, style]}>{children}</Text>;
};
