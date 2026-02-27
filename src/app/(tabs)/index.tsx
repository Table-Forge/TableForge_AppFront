import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/src/constants/screen-size";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { Button } from "@/src/components/button/button";
import { advantages, carousel } from "@/src/data/mock";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import Carousel from "react-native-reanimated-carousel";
import FeatherIcons from "react-native-vector-icons/Feather";
import { ActionButton } from "@/src/components/action-button/action-button";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { useAuth } from "@/src/context/auth";
import { Entypo } from "@expo/vector-icons";
import { KnightHeadIcon } from "@/src/components/icons";

import {
  InfoCard,
  styles as infoCardStyles,
} from "@/src/components/info-card/info-card";

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { user } = useAuth();

  return (
    <MainContainer>
      <HeaderActions>
        <ActionButton
          variant="pill"
          icon={
            user?.avatarUrl ? (
              <Image
                style={styles.image}
                source={{
                  uri: user?.avatarUrl,
                }}
              />
            ) : (
              <KnightHeadIcon size={22} color={DEFAULT_COLORS.white} />
            )
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

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.callWrapper}>
          <ThemedText
            weight="bold"
            style={{
              fontSize: 20,
              marginBottom: 16,
            }}
          >
            Seja um Nobre!
          </ThemedText>

          <InfoCard
            title="Vantagens da Nobreza"
            style={{ backgroundColor: DEFAULT_COLORS.primary }}
          >
            <View style={infoCardStyles.cardList}>
              {advantages.map((item, index) => (
                <View key={index} style={infoCardStyles.cardItem}>
                  <FeatherIcons
                    name="check-circle"
                    size={16}
                    color={DEFAULT_COLORS.white}
                  />
                  <ThemedText fontSize={16} style={{ flex: 1 }}>
                    {item.text}
                  </ThemedText>
                </View>
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
          </InfoCard>
        </View>
      </ScrollView>
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

    flex: 1,
    backgroundColor: DEFAULT_COLORS.primary,
    borderRadius: 30,

    borderWidth: 2,
    borderColor: DEFAULT_COLORS.tertiary_30,

    position: "relative",
  },
  advantagesList: {
    display: "flex",
    gap: 10,
  },
  advantageItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    width: "100%",
  },
  callWrapper: {
    paddingHorizontal: 10,
  },
});
