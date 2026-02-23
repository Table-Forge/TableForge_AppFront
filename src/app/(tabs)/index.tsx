import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { WelcomeButton } from "@/src/components/welcome-button/welcome-button";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/src/constants/screen-size";
import { Image, StyleSheet, View } from "react-native";

import { Button } from "@/src/components/button/button";
import { advantages, carousel } from "@/src/data/mock";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import Carousel from "react-native-reanimated-carousel";
import FeatherIcons from "react-native-vector-icons/Feather";
import { ActionButton } from "@/src/components/action-button/action-button";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { useAuth } from "@/src/context/auth";
import { Entypo } from "@expo/vector-icons";

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { user } = useAuth();

  return (
    <MainContainer>
      <HeaderActions hasPadding={false}>
        <ActionButton
          variant="pill"
          icon={
            <Image
              style={styles.image}
              source={{
                uri: `${user?.avatarUrl ? user?.avatarUrl : "https://www.refugee-action.org.uk/wp-content/uploads/2016/10/anonymous-user.png"}`,
              }}
            />
          }
          label={`Bem vindo(a), ${user?.nickname}!`}
          onPress={() => navigation.navigate("profile")}
        />

        <ActionButton
          variant="circle"
          icon={<Entypo name="bell" size={22} color={DEFAULT_COLORS.white} />}
          onPress={() => navigation.navigate("notifications")}
        />
      </HeaderActions>

      <Carousel
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT * 0.3}
        data={carousel}
        loop
        autoPlay
        autoPlayInterval={3000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxAdjacentItemScale: 0.8,
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <ThemedText style={styles.title}>{item.title}</ThemedText>
          </View>
        )}
      />

      <View>
        <ThemedText weight="bold" style={{ fontSize: 20, marginBottom: 16 }}>
          Seja um Nobre!
        </ThemedText>

        <View style={styles.advantagesWrapper}>
          <ThemedText weight="bold" style={{ fontSize: 16 }}>
            Vantagens da Nobreza
          </ThemedText>

          <View style={styles.advantagesList}>
            {advantages.map((item, index) => (
              <ThemedText key={index} style={{ fontSize: 16 }}>
                <FeatherIcons
                  name="check-circle"
                  size={16}
                  color={DEFAULT_COLORS.white}
                />{" "}
                {item.text}
              </ThemedText>
            ))}

            <ThemedText style={{ textAlign: "center" }}>
              Apenas{" "}
              <ThemedText weight="bold" style={{ fontSize: 20 }}>
                R$ 9,99
              </ThemedText>
              /mês
            </ThemedText>

            <Button
              onPress={() => console.log("apertei")}
              variant="tertiary"
              text="Quero Assinar!"
            />
          </View>
        </View>
      </View>
    </MainContainer>
  );
}

export const styles = StyleSheet.create({
  slide: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  title: {
    position: "absolute",
    bottom: 10,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  advantagesWrapper: {
    display: "flex",
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white,
    borderRadius: 16,
  },
  advantagesList: {
    display: "flex",
    gap: 10,
  },
});
