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
            <ThemedText weight="bold" style={styles.charName}>
              {data.name}
            </ThemedText>
            <View style={styles.classTag}>
              <ThemedText style={styles.classTagText}>
                {className}
              </ThemedText>
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
              size={20}
              color={DEFAULT_COLORS.tertiary}
            />
            <ThemedText weight="bold" style={styles.sectionTitle}>
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
    <MaterialCommunityIcons
      name={icon}
      size={18}
      color={DEFAULT_COLORS.tertiary}
    />
    <View>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText weight="bold" style={styles.statValue}>
        {value}
      </ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    width: "100%",
    height: width * 1.1,
    justifyContent: "space-between",
    backgroundColor: DEFAULT_COLORS.primary,
  },
  backButton: {
    backgroundColor: "rgba(26, 26, 46, 0.7)",
    borderColor: "rgba(126, 135, 226, 0.3)",
  },
  nameOverlay: {
    padding: 20,
    backgroundColor: "rgba(26, 26, 46, 0.85)",
    borderTopWidth: 2,
    borderTopColor: DEFAULT_COLORS.tertiary,
  },
  charName: {
    fontSize: 32,
    color: DEFAULT_COLORS.white,
    letterSpacing: 1,
  },
  classTag: {
    backgroundColor: "rgba(251, 69, 1, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary,
  },
  classTagText: {
    fontSize: 12,
    color: DEFAULT_COLORS.tertiary,
    ...fonts.bold,
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
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.1)",
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.05)",
  },
  historyText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 26,
    fontStyle: "italic",
  },
});
