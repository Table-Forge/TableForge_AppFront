import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "./back-button.styles";

export const BackButton = () => {
  const colors = DEFAULT_COLORS;
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [styles.wrapper, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name="arrow-back" size={24} color={colors.white} />
    </Pressable>
  );
};
