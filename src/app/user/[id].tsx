import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useUser } from "@/src/features/users/hooks/use-user";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function PublicUserProfileScreen() {
  const { handleBack } = useBackRouter();
  const { id } = useLocalSearchParams();
  const userId = Number(id);
  const { data: user, isLoading, isError } = useUser(userId);

  if (isLoading) {
    return (
      <MainContainer style={styles.centerContainer}>
        <ActivityIndicator color={DEFAULT_COLORS.tertiary} />
        <ThemedText style={styles.feedbackText}>Carregando perfil...</ThemedText>
      </MainContainer>
    );
  }

  if (isError || !user) {
    return (
      <MainContainer style={styles.centerContainer}>
        <ThemedText style={styles.feedbackText}>Perfil não encontrado.</ThemedText>
      </MainContainer>
    );
  }

  return (
    <MainContainer style={styles.container}>
      <HeaderActions>
        <ActionButton
          variant="circle"
          icon={
            <Ionicons
              name="arrow-back"
              size={22}
              color={DEFAULT_COLORS.white}
            />
          }
          onPress={handleBack}
        />
        <ThemedText weight="bold" style={styles.headerTitle}>
          Perfil
        </ThemedText>
        <View style={styles.headerSpacer} />
      </HeaderActions>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={96}
                color="rgba(255,255,255,0.35)"
              />
            )}
          </View>
          <ThemedText weight="bold" style={styles.nickname}>
            {user.nickname || user.username}
          </ThemedText>
          <ThemedText style={styles.username}>@{user.username}</ThemedText>
        </View>

        <InfoCard style={styles.card}>
          <ThemedText style={styles.moduleTitle}>Dados públicos</ThemedText>
          <InfoRow label="Apelido" value={user.nickname || "-"} />
          <InfoRow label="Usuário" value={`@${user.username}`} />
        </InfoCard>
      </ScrollView>
    </MainContainer>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    <ThemedText weight="bold" style={styles.infoValue}>
      {value}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    color: DEFAULT_COLORS.white,
    textAlign: "center",
  },
  headerSpacer: {
    width: 45,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  profileHeader: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  avatarWrapper: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.25)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nickname: {
    marginTop: 8,
    fontSize: 24,
    color: DEFAULT_COLORS.white,
  },
  username: {
    color: DEFAULT_COLORS.grays._200,
  },
  card: {
    borderRadius: 8,
    marginBottom: 0,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: "rgba(126, 135, 226, 0.1)",
  },
  moduleTitle: {
    color: DEFAULT_COLORS.tertiary,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  infoRow: {
    gap: 4,
    paddingVertical: 8,
  },
  infoLabel: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 12,
  },
  infoValue: {
    color: DEFAULT_COLORS.white,
    fontSize: 16,
  },
  feedbackText: {
    color: DEFAULT_COLORS.grays._200,
    textAlign: "center",
  },
});
