import { View, StyleSheet, ScrollView } from "react-native";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { ActionButton } from "@/src/components/action-button/action-button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { Ionicons } from "@expo/vector-icons";
import {
  InfoCard,
  styles as infoCardStyles,
} from "@/src/components/info-card/info-card";
import FeatherIcons from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/button/button";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

export default function MyPlanScreen() {
  const { handleBack } = useBackRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, { flex: 1 }]}>
        <HeaderActions>
          <ActionButton
            variant="circle"
            icon={
              <Ionicons
                name="arrow-back"
                size={24}
                color={DEFAULT_COLORS.white}
              />
            }
            onPress={handleBack}
          />
          <ThemedText style={styles.headerTitle}>Meu Plano</ThemedText>
          <View style={{ width: 45 }} />
        </HeaderActions>

        <ScrollView
          contentContainerStyle={styles.container}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Escolha o plano que mais se encaixa com você!
            </ThemedText>
          </View>

          <InfoCard title="Plano Atual" style={styles.planCard}>
            <View style={styles.planHeader}>
              <ThemedText style={styles.planName}>Básico</ThemedText>
              <ThemedText style={styles.planPrice}>Grátis!</ThemedText>
            </View>

            <View style={infoCardStyles.cardList}>
              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Pesquisar campanhas em sua localidade
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Criar e entrar em campanhas
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Visualizar e participar do Chat da Campanha (Sala de Taverna)
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Receber notificações sobre eventos futuros
                </ThemedText>
              </View>
            </View>
          </InfoCard>

          <InfoCard style={styles.premiumCard}>
            <View style={styles.planHeader}>
              <ThemedText style={[styles.planName, styles.premiumName]}>
                Premium
              </ThemedText>
              <ThemedText style={[styles.planPrice, styles.premiumPrice]}>
                R$ 9,99/mês
              </ThemedText>
            </View>

            <View style={infoCardStyles.cardList}>
              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Todas as funcionalidades do Plano Básico
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Criar e salvar personagens ilimitados na página de perfil
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Criar tópicos no Fórum
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Selo Premium ao lado do nome do usuário
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Destaque nas campanhas criadas por você, aparecendo primeiro
                  na listagem
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Campanhas privadas
                </ThemedText>
              </View>

              <View style={infoCardStyles.cardItem}>
                <View style={styles.checkBadge}>
                  <FeatherIcons
                    name="check"
                    size={12}
                    color={DEFAULT_COLORS.white}
                  />
                </View>
                <ThemedText fontSize={16} style={{ flex: 1 }}>
                  Personalização de Banner de campanha
                </ThemedText>
              </View>

              <Button
                onPress={() => console.log("apertei")}
                variant="tertiary"
                text="Quero Este!"
              />
            </View>
          </InfoCard>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SURFACES.background,
  },
  headerTitle: {
    fontSize: 20,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 2,
    ...fonts.bold,
    color: DEFAULT_COLORS.purpleBright,
    textTransform: "uppercase",
  },
  planCard: {
    backgroundColor: SURFACES.card,
    borderColor: BORDERS.highlight,
  },
  premiumCard: {
    backgroundColor: SURFACES.card,
    borderColor: BORDERS.ctaSoft,
    shadowColor: DEFAULT_COLORS.orange,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  planName: {
    fontSize: 18,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  premiumName: {
    color: DEFAULT_COLORS.crown,
  },
  planPrice: {
    fontSize: 16,
    color: DEFAULT_COLORS.purpleBright,
    ...fonts.bold,
  },
  premiumPrice: {
    color: DEFAULT_COLORS.orange,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: RADII.pill,
    backgroundColor: DEFAULT_COLORS.purpleBright,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.soft,
  },
});
