import { DEFAULT_COLORS } from "@/src/theme/colors";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./notification-blob.styles";

export const NotificationBlob = () => {
  const colors = DEFAULT_COLORS;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <Pressable
      onPress={() => navigation.navigate("notifications")}
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [styles.wrapper, pressed && { opacity: 0.7 }]}
    >
      <MaterialCommunityIcons
        name="bell-outline"
        size={24}
        color={colors.white}
      />
    </Pressable>
  );
};
