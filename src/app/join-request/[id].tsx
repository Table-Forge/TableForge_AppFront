import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { CharacterItem } from "@/src/components/character-item/character-item";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useCharacter } from "@/src/features/characters/hooks/use-character";
import { useJoinRequest } from "@/src/features/join-requests/hooks/use-join-request";
import { useJoinRequestsMutation } from "@/src/features/join-requests/hooks/use-join-requests-mutations";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function JoinRequestDetailsScreen() {
  const router = useRouter();
  const { handleBack } = useBackRouter();
  const { id } = useLocalSearchParams();
  const joinRequestId = Number(id);
  const {
    data: joinRequest,
    isLoading: isLoadingJoinRequest,
    isError,
  } = useJoinRequest(joinRequestId);
  const { data: character, isLoading: isLoadingCharacter } = useCharacter(
    joinRequest?.characterId ?? undefined,
  );
  const { updateJoinRequestStatusMutation, isUpdatingJoinRequest } =
    useJoinRequestsMutation(joinRequest?.campaignId);

  const handleStatusUpdate = (status: "Approved" | "Rejected") => {
    if (!joinRequest) return;

    updateJoinRequestStatusMutation.mutate(
      {
        id: joinRequest.id,
        status,
      },
      {
        onSuccess: () => handleBack(),
      },
    );
  };

  const isLoading = isLoadingJoinRequest || isLoadingCharacter;

  if (isLoading) {
    return (
      <MainContainer style={styles.centerContainer}>
        <ActivityIndicator color={DEFAULT_COLORS.tertiary} />
        <ThemedText style={styles.feedbackText}>Carregando...</ThemedText>
      </MainContainer>
    );
  }

  if (isError || !joinRequest) {
    return (
      <MainContainer style={styles.centerContainer}>
        <ThemedText style={styles.feedbackText}>
          Solicitação não encontrada.
        </ThemedText>
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
          Solicitação
        </ThemedText>
        <View style={styles.headerSpacer} />
      </HeaderActions>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoCard style={styles.card}>
          <ThemedText style={styles.moduleTitle}>Jogador</ThemedText>
          <ThemedText weight="bold" style={styles.playerName}>
            {joinRequest.username || `Usuário ${joinRequest.userId}`}
          </ThemedText>
          <ThemedText style={styles.statusText}>
            Status: {translateJoinStatus(joinRequest.status)}
          </ThemedText>
        </InfoCard>

        <InfoCard style={styles.card}>
          <ThemedText style={styles.moduleTitle}>Mensagem</ThemedText>
          <ThemedText style={styles.messageText}>
            {joinRequest.message || "Sem mensagem."}
          </ThemedText>
        </InfoCard>

        <InfoCard style={styles.card}>
          <View style={styles.characterHeader}>
            <ThemedText style={styles.moduleTitle}>
              Personagem submetido
            </ThemedText>
            {!!character && (
              <ActionButton
                variant="pill"
                label="Ver ficha"
                icon={
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={DEFAULT_COLORS.white}
                  />
                }
                backgroundColor={DEFAULT_COLORS.tertiary}
                onPress={() =>
                  router.push({
                    pathname: "/character/[id]",
                    params: { id: character.id },
                  } as any)
                }
              />
            )}
          </View>

          {character ? (
            <CharacterItem
              data={character}
              cardColor={DEFAULT_COLORS.background}
              onPress={() =>
                router.push({
                  pathname: "/character/[id]",
                  params: { id: character.id },
                } as any)
              }
            />
          ) : (
            <ThemedText style={styles.feedbackText}>
              Nenhum personagem vinculado à solicitação.
            </ThemedText>
          )}
        </InfoCard>
      </ScrollView>

      {joinRequest.status === "Pending" && (
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button
              variant="secondary"
              text="Rejeitar"
              onPress={() => handleStatusUpdate("Rejected")}
              isLoading={isUpdatingJoinRequest}
            />
          </View>
          <View style={styles.footerButton}>
            <Button
              variant="tertiary"
              text="Aprovar"
              onPress={() => handleStatusUpdate("Approved")}
              isLoading={isUpdatingJoinRequest}
            />
          </View>
        </View>
      )}
    </MainContainer>
  );
}

function translateJoinStatus(status: string) {
  const labels: Record<string, string> = {
    None: "nenhum",
    Pending: "pendente",
    Approved: "aprovada",
    Rejected: "rejeitada",
  };
  return labels[status] ?? status;
}

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
    paddingBottom: 120,
    gap: 16,
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
  playerName: {
    color: DEFAULT_COLORS.white,
    fontSize: 20,
  },
  statusText: {
    color: DEFAULT_COLORS.grays._200,
  },
  messageText: {
    color: DEFAULT_COLORS.white,
    lineHeight: 22,
  },
  characterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  feedbackText: {
    color: DEFAULT_COLORS.grays._200,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    flexDirection: "row",
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});
