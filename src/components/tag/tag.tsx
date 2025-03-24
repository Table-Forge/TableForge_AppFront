import { DEFAULT_COLORS } from "@/src/theme/colors";
import { View } from "react-native";
import { ThemedText } from "../themed-text/themed-text";
import { styles } from "./tag.styles";

const colors = DEFAULT_COLORS;

export const Tag = ({
  icon,
  text,
}: {
  icon?: React.ReactNode;
  text: string;
}) => {
  return (
    <View style={styles.wrapper}>
      {icon && icon}
      <ThemedText style={{ fontSize: 12, color: colors.primary }}>
        {text}
      </ThemedText>
    </View>
  );
};
