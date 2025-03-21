import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Pressable, View } from "react-native";
import { ThemedText } from "../themed-text/themed-text";
import { styles } from "./welcome-blob.style";

export const WelcomeBlob = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <Pressable
      onPress={() => navigation.navigate("profile")}
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [styles.wrapper, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={{
            uri: "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png",
          }}
        />
      </View>
      <ThemedText weight="bold"> Bem vindo, Morello!</ThemedText>
    </Pressable>
  );
};
