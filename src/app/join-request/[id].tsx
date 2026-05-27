import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { CharacterItem } from "@/src/components/character-item/character-item";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCharacter } from "@/src/features/characters/hooks/use-character";
import { useJoinRequest } from "@/src/features/join-requests/hooks/use-join-request";
import { useJoinRequestsMutation } from "@/src/features/join-requests/hooks/use-join-requests-mutations";
import { notify } from "@/src/features/notifications/helpers/notify";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";

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
  const { data: campaign } = useCampaign(joinRequest?.campaignId);
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
        onSuccess: () => {
          if (campaign) {
            const payload = {
              requesterId: joinRequest.userId,
              campaignId: campaign.id,
              campaignTitle: campaign.title,
            };
            if (status === "Approved") {
              notify.joinRequestApproved(payload);
            } else {
              notify.joinRequestRejected(payload);
            }
          }
          handleBack();
        },
      },
    );
  };

  const isLoading = isLoadingJoinRequest || isLoadingCharacter;

  if (isLoading) {
    return (
      <Screen style={styles.centerContainer}>
        <ActivityIndicator color={DEFAULT_COLORS.purpleBright} />
        <ThemedText style={styles.feedbackText}>Carregando...</ThemedText>
      </Screen>
    );
  }

  if (isError || !joinRequest) {
    return (
      <Screen style={styles.centerContainer}>
        <ThemedText style={styles.feedbackText}>
          Solicitação não encontrada.
        </ThemedText>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <Screen.Header>
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
      </Screen.Header>

      <Screen.Body
        scroll
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InfoCard style={styles.card}>
          <ThemedText style={styles.moduleTitle}>Jogador</ThemedText>
          <ThemedText weight="bold" style={styles.playerName}>
            {joinRequest.username || `Usuário ${joinRequest.userId}`}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              joinRequest.status === "Approved" && styles.statusBadgeApproved,
              joinRequest.status === "Rejected" && styles.statusBadgeRejected,
            ]}
          >
            <ThemedText style={styles.statusText}>
              {translateJoinStatus(joinRequest.status)}
            </ThemedText>
          </View>
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
                active
                icon={
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={DEFAULT_COLORS.white}
                  />
                }
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
              cardColor={DEFAULT_COLORS.cardImageDark}
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
      </Screen.Body>

      {joinRequest.status === "Pending" && (
        <Screen.Footer style={styles.footer}>
          <View style={styles.footerButton}>
            <Button
              variant="primary"
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
        </Screen.Footer>
      )}
    </Screen>
  );
}

function translateJoinStatus(status: string) {
  const labels: Record<string, string> = {
    None: "nenhum",
    Pending: "Pendente",
    Approved: "Aprovada",
    Rejected: "Rejeitada",
  };
  return labels[status] ?? status;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACES.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: SURFACES.background,
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
    gap: 14,
  },
  card: {
    marginBottom: 0,
    backgroundColor: SURFACES.card,
    borderColor: BORDERS.highlight,
  },
  moduleTitle: {
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  playerName: {
    color: DEFAULT_COLORS.white,
    fontSize: 20,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    backgroundColor: DEFAULT_COLORS.secondary_24,
    borderWidth: 1,
    borderColor: BORDERS.highlightStrong,
    marginTop: 6,
  },
  statusBadgeApproved: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
    borderColor: BORDERS.cta,
  },
  statusBadgeRejected: {
    backgroundColor: DEFAULT_COLORS.tertiary_30,
    borderColor: DEFAULT_COLORS.danger,
  },
  statusText: {
    color: DEFAULT_COLORS.white,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  messageText: {
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
    fontSize: 14,
  },
  characterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  feedbackText: {
    color: DEFAULT_COLORS.textMuted,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});
