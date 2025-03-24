import { MainContainer } from "@/src/components/main-container/main-container";
import { NotificationButton } from "@/src/components/notification-button/notification-button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { WelcomeButton } from "@/src/components/welcome-button/welcome-button";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/src/constants/screen-size";
import { Image, StyleSheet, View } from "react-native";

import { Button } from "@/src/components/button/button";
import { advantages, carousel } from "@/src/data/mock";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import Carousel from "react-native-reanimated-carousel";
import FeatherIcons from "react-native-vector-icons/Feather";

const colors = DEFAULT_COLORS;

export default function Home() {
  return (
    <MainContainer>
      <View style={styles.topWrapper}>
        <WelcomeButton />

        <NotificationButton />
      </View>

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
                <FeatherIcons name="check-circle" size={16} color={"#fff"} />{" "}
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
  topWrapper: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
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
    borderColor: colors.white,
    borderRadius: 16,
  },
  advantagesList: {
    display: "flex",
    gap: 10,
  },
});
