import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useCharacter } from "@/src/features/characters/hooks/use-character";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

const { width } = Dimensions.get("window");

export default function CharacterScreen() {
  const { id } = useLocalSearchParams();
  const { handleBack } = useBackRouter();
  const characterId = Number(id);
  const { data, isLoading, isError } = useCharacter(characterId);

  if (isLoading) return <ThemedText>Carregando personagem...</ThemedText>;

  if (isError || !data) {
    return <ThemedText>Personagem não encontrado...</ThemedText>;
  }

  const className = data.className || "Classe não informada";
  const raceName = data.raceName || "Raça não informada";

  return (
    <MainContainer style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ImageBackground
          source={data.imageUrl ? { uri: data.imageUrl } : undefined}
          style={styles.banner}
        >
          <View style={styles.bannerScrim} />
          <HeaderActions padding={10}>
            <ActionButton
              variant="circle"
              style={styles.backButton}
              icon={
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={DEFAULT_COLORS.white}
                />
              }
              onPress={handleBack}
            />
          </HeaderActions>

          <View style={styles.nameOverlay}>
            <ThemedText style={styles.eyebrow}>Personagem</ThemedText>
            <ThemedText weight="bold" style={styles.charName}>
              {data.name}
            </ThemedText>
            <View style={styles.classTag}>
              <ThemedText style={styles.classTagText}>{className}</ThemedText>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.statsGrid}>
          <StatCard label="Raça" value={raceName} icon="dna" />
          <StatCard
            label="Alinhamento"
            value={data.alignment || "-"}
            icon="scale-balance"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="book-open-variant"
              size={18}
              color={DEFAULT_COLORS.purpleBright}
            />
            <ThemedText style={styles.sectionTitle}>
              História do personagem
            </ThemedText>
          </View>

          <View style={styles.historyCard}>
            <ThemedText style={styles.historyText}>
              {data.bio || "Sem história cadastrada."}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </MainContainer>
  );
}

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) => (
  <View style={styles.statCard}>
    <View style={styles.statIconWrapper}>
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={DEFAULT_COLORS.purpleBright}
      />
    </View>
    <View>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText weight="bold" style={styles.statValue}>
        {value}
      </ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SURFACES.background },
  banner: {
    width: "100%",
    height: width * 1.1,
    justifyContent: "space-between",
    backgroundColor: SURFACES.card,
  },
  bannerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DEFAULT_COLORS.overlayDark_45,
  },
  backButton: {
    backgroundColor: DEFAULT_COLORS.primary_78,
    borderColor: BORDERS.highlight,
  },
  nameOverlay: {
    padding: 22,
    backgroundColor: DEFAULT_COLORS.homeSurface_95,
    borderTopWidth: 1,
    borderTopColor: BORDERS.highlight,
    gap: 4,
  },
  eyebrow: {
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  charName: {
    fontSize: 30,
    color: DEFAULT_COLORS.white,
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  classTag: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    marginTop: 8,
    borderWidth: 1,
    borderColor: BORDERS.cta,
  },
  classTagText: {
    fontSize: 11,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SURFACES.card,
    padding: 14,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADII.pill,
    backgroundColor: SURFACES.fill,
    borderWidth: 1,
    borderColor: BORDERS.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    color: DEFAULT_COLORS.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  historyCard: {
    backgroundColor: SURFACES.card,
    padding: 20,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  historyText: {
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
    fontStyle: "italic",
  },
});
