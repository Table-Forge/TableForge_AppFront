import { MainContainer } from "@/src/components/main-container/main-container";
import { NotificationBlob } from "@/src/components/notification-blob/notification-blob";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { WelcomeBlob } from "@/src/components/welcome-blob/welcome-blob";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/src/constants/screen-size";
import { Image, StyleSheet, View } from "react-native";

import { Button } from "@/src/components/button/button";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import Carousel from "react-native-reanimated-carousel";
import FeatherIcons from "react-native-vector-icons/Feather";

const colors = DEFAULT_COLORS;

export default function Home() {
  const carousel = [
    {
      id: 1,
      image:
        "https://platform.polygon.com/wp-content/uploads/sites/2/2024/09/phb-2024-cover.jpeg?quality=90&strip=all&crop=0%2C24.5552761479%2C100%2C50.8894477042&w=2400",
      title: "Encontre Sua Party",
    },
    {
      id: 2,
      image:
        "https://images.squarespace-cdn.com/content/v1/605e90f9c17ee25104dba783/1696448239405-LW45NVW93EEWGIHAHMOW/Screenshot+2023-10-04+123658.png?format=2500w",
      title: "Marque Encontros Épicos",
    },
    {
      id: 3,
      image:
        "https://shortrest.files.wordpress.com/2023/10/dragonborn_bard_pg_59_326880__copy.0.jpg",
      title: "Crie Sua Própria Campanha",
    },
    {
      id: 4,
      image:
        "https://images.ctfassets.net/swt2dsco9mfe/4GhYDHCEuhO6C9eJK3pBY1/c1712db014c5f9c7014bdfb07287d0ae/dnd_learntoplay_hero1.jpg?q=70&w=1920",
      title: "Destrua Seus Inimigos",
    },
    {
      id: 5,
      image:
        "https://i0.wp.com/dungeonsanddragonsfan.com/wp-content/uploads/2024/11/2024-dnd-character-sheets-pdf.png?fit=800%2C450&ssl=1",
      title: "Crie Seu Personagem Favorito",
    },
  ];

  const advantages = [
    { text: "Todas as funcionalidades do Plano Básico" },
    {
      text: "Criar e salvar personagens ilimitados na página de perfil",
    },
    { text: "Criar tópicos no Fórum" },
    { text: "Selo Premium ao lado do nome do usuário" },
    {
      text: "Destaque nas campanhas criadas por você, aparecendo primeiro na listagem",
    },
    { text: "Campanhas privadas" },
  ];

  return (
    <MainContainer>
      <View style={styles.topWrapper}>
        <WelcomeBlob />

        <NotificationBlob />
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
          Seja Premium!
        </ThemedText>

        <View style={styles.advantagesWrapper}>
          <ThemedText weight="bold" style={{ fontSize: 16 }}>
            Vantagens da Assinatura
          </ThemedText>

          <View style={styles.advantagesList}>
            {advantages.map((item, index) => (
              <ThemedText key={index} style={{ fontSize: 16 }}>
                <FeatherIcons name="check-circle" size={16} color={"#fff"} />{" "}
                {item.text}
              </ThemedText>
            ))}

            <ThemedText style={{ textAlign: "center" }}>
              Apenas <ThemedText weight="bold">R$ 9,99</ThemedText>/mês
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
