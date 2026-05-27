import { ThemedText } from "../themed-text/themed-text";
import { styles } from "./label.styles";
import {
  Alert,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";

interface ILabelProps {
  style?: StyleProp<TextStyle>;
  text: string;
  infoText?: string;
}

export const Label = ({ text, style, infoText }: ILabelProps) => {
  const handleShowInfo = () => {
    if (infoText) {
      Alert.alert(text || "Informação", infoText, [{ text: "Entendi" }]);
    }
  };

  return (
    <View style={[styles.labelContainer]}>
      <ThemedText style={[styles.label, style]}>{text}</ThemedText>

      {infoText && (
        <TouchableOpacity
          onPress={handleShowInfo}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={styles.iconContainer}
        >
          <Ionicons
            name="help-circle-outline"
            size={18}
            color={DEFAULT_COLORS.purpleBright}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
