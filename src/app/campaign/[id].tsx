import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { SwordDiceIcon } from "@/src/components/icons";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { Screen } from "@/src/components/screen/screen";
import { Tabs } from "@/src/components/tabs/tabs";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useCampaignAnnouncements } from "@/src/features/campaign-announcements/hooks/use-campaign-announcements";
import { useCampaignMembers } from "@/src/features/campaign-members/hooks/use-campaign-members";
import { useCampaignSessions } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions";
import { useCampaignSessionsMutation } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions-mutations";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useUser } from "@/src/features/users/hooks/use-user";
import { useCharacters } from "@/src/features/characters/hooks/use-characters";
import { useJoinRequests } from "@/src/features/join-requests/hooks/use-join-requests";
import { useJoinRequestsMutation } from "@/src/features/join-requests/hooks/use-join-requests-mutations";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { useDebouncedCallback } from "@/src/hooks/use-debounced-callback";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { notify } from "@/src/features/notifications/helpers/notify";
import { CallendarTab } from "@/src/pages-components/campaign/callendar-tab";
import { HomeTab } from "@/src/pages-components/campaign/home-tab";
import { MembersTab } from "@/src/pages-components/campaign/members-tab";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";
import { useCampaignDifficultyLevelEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-difficulty-level-enum";

const { width } = Dimensions.get("window");

type TabType = "Início" | "Jogadores" | "Calendário";

export default function CampaignDetails() {
  const { handleBack } = useBackRouter();
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const campaignId = Number(id);
  const { difficultyLevelEnum } = useCampaignDifficultyLevelEnum();
  const {
    data: campaign,
    isLoading,
    isError,
    refetch: refetchCampaign,
    isRefetching: isRefetchingCampaign,
  } = useCampaign(campaignId);
  const { data: creator } = useUser(campaign?.creatorId, true);
  const {
    data: members = [],
    refetch: refetchMembers,
    isRefetching: isRefetchingMembers,
  } = useCampaignMembers({ campaignId });
  const {
    data: joinRequests = [],
    refetch: refetchJoinRequests,
    isRefetching: isRefetchingJoinRequests,
  } = useJoinRequests({ campaignId });
  const {
    data: announcements = [],
    refetch: refetchAnnouncements,
    isRefetching: isRefetchingAnnouncements,
  } = useCampaignAnnouncements({ campaignId });
  const {
    data: sessionsResponse,
    refetch: refetchSessions,
    isRefetching: isRefetchingSessions,
  } = useCampaignSessions({
    campaignId,
    page: 1,
    size: 100,
  });
  const {
    data: charactersResponse,
    refetch: refetchCharacters,
    isRefetching: isRefetchingCharacters,
  } = useCharacters({
    page: 1,
    size: 100,
    enabled: members.length > 0,
  });
  const { updateJoinRequestStatusMutation, isUpdatingJoinRequest } =
    useJoinRequestsMutation(campaignId);

  const { deleteCampaignSessionMutation } = useCampaignSessionsMutation();

  const [activeTab, setActiveTab] = useState<TabType>("Início");
  const [sessionToDelete, setSessionToDelete] =
    useState<ICampaignSessionList | null>(null);

  const currentUserId = user?.id;
  const currentMember = useMemo(
    () => members.find((member) => member.userId === currentUserId),
    [currentUserId, members],
  );
  const isCreator = currentUserId === campaign?.creatorId;
  const isMaster = isCreator || currentMember?.role === "Master";
  const isPlayer = !!currentMember && !isMaster;
  const viewerType = isMaster ? "master" : isPlayer ? "player" : "outsider";
  const canSeePrivateModules = viewerType !== "outsider";

  const currentUserJoinRequest = useMemo(
    () => joinRequests.find((request) => request.userId === currentUserId),
    [currentUserId, joinRequests],
  );
  const pendingJoinRequests = useMemo(
    () => joinRequests.filter((request) => request.status === "Pending"),
    [joinRequests],
  );
  const sessions = sessionsResponse?.items ?? [];
  const characters = charactersResponse?.items ?? [];
  const visibleTabs: TabType[] = canSeePrivateModules
    ? ["Início", "Jogadores", "Calendário"]
    : ["Início"];
  const isRefreshing =
    isRefetchingCampaign ||
    isRefetchingMembers ||
    isRefetchingJoinRequests ||
    isRefetchingAnnouncements ||
    isRefetchingSessions ||
    isRefetchingCharacters;

  const refreshAll = useCallback(() => {
    Promise.all([
      refetchCampaign(),
      refetchMembers(),
      refetchJoinRequests(),
      refetchAnnouncements(),
      refetchSessions(),
      members.length > 0 ? refetchCharacters() : Promise.resolve(),
    ]);
  }, [
    members.length,
    refetchAnnouncements,
    refetchCampaign,
    refetchCharacters,
    refetchJoinRequests,
    refetchMembers,
    refetchSessions,
  ]);

  const handleRefresh = useDebouncedCallback(refreshAll, 300);

  if (isLoading) return <ThemedText>Carregando campanha...</ThemedText>;

  if (isError || !campaign) {
    return <ThemedText>Campanha não encontrada...</ThemedText>;
  }

  const handleDeleteSessionConfirm = () => {
    if (sessionToDelete) {
      deleteCampaignSessionMutation.mutate(sessionToDelete.id, {
        onSuccess: () => setSessionToDelete(null),
      });
    }
  };

  return (
    <Screen style={styles.container}>
      <Screen.Body
        scroll
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={DEFAULT_COLORS.tertiary}
            colors={[DEFAULT_COLORS.tertiary]}
          />
        }
      >
        <Screen.HeaderBanner
          source={campaign.bannerUrl ? { uri: campaign.bannerUrl } : undefined}
          height={styles.banner.height}
          backgroundColor={SURFACES.card}
          actions={
            <HeaderActions padding={10}>
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
              {canSeePrivateModules && (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {isMaster && (
                    <ActionButton
                      variant="circle"
                      icon={
                        <Ionicons
                          name="settings-sharp"
                          size={22}
                          color={DEFAULT_COLORS.white}
                        />
                      }
                      onPress={() =>
                        router.push({
                          pathname: "/campaign/[id]/settings",
                          params: { id: campaignId },
                        } as any)
                      }
                    />
                  )}
                  {campaign.isChatEnabled && (
                    <ActionButton
                      variant="circle"
                      icon={
                        <FontAwesome5
                          name="beer"
                          size={20}
                          color={DEFAULT_COLORS.white}
                        />
                      }
                      onPress={() =>
                        router.push({
                          pathname: "/campaign-chat/[campaignId]",
                          params: { campaignId },
                        } as any)
                      }
                    />
                  )}
                </View>
              )}
            </HeaderActions>
          }
        >
          <View style={styles.titleOverlay}>
            <ThemedText style={styles.eyebrow}>Campanha</ThemedText>
            <ThemedText weight="bold" style={styles.title}>
              {campaign.title}
            </ThemedText>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/user/[id]",
                  params: { id: campaign.creatorId.toString() },
                } as any)
              }
              style={({ pressed }) => [
                styles.masterRow,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.masterAvatar}>
                {creator?.avatarUrl ? (
                  <Image
                    source={{ uri: creator.avatarUrl }}
                    style={styles.masterAvatarImage}
                  />
                ) : (
                  <SwordDiceIcon
                    size={18}
                    color={DEFAULT_COLORS.purpleBright}
                  />
                )}
              </View>
              <ThemedText style={styles.masterText}>
                Mestre {campaign.creatorUsername || "desconhecido"}
              </ThemedText>
            </Pressable>
          </View>
        </Screen.HeaderBanner>

        <View style={styles.content}>
          <Tabs<TabType>
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              {
                label: "Início",
                value: "Início",
                isAllowed: visibleTabs.includes("Início"),
                component: (
                  <HomeTab
                    announcements={announcements}
                    campaign={campaign}
                    canSeePrivateModules={canSeePrivateModules}
                    difficultyLevelEnum={difficultyLevelEnum}
                    isMaster={isMaster}
                    onCreateAnnouncement={() =>
                      router.push({
                        pathname: "/campaign-announcement/create",
                        params: { campaignId },
                      } as any)
                    }
                  />
                ),
              },
              {
                label: "Jogadores",
                value: "Jogadores",
                isAllowed: visibleTabs.includes("Jogadores"),
                component: (
                  <MembersTab
                    campaign={campaign}
                    canSeePrivateModules={canSeePrivateModules}
                    characters={characters}
                    isMaster={isMaster}
                    isUpdatingJoinRequest={isUpdatingJoinRequest}
                    members={members}
                    pendingJoinRequests={pendingJoinRequests}
                    onOpenJoinRequest={(requestId) =>
                      router.push({
                        pathname: "/join-request/[id]",
                        params: { id: requestId },
                      } as any)
                    }
                    onApproveJoinRequest={(requestId) => {
                      const request = pendingJoinRequests.find(
                        (item) => item.id === requestId,
                      );
                      updateJoinRequestStatusMutation.mutate(
                        { id: requestId, status: "Approved" },
                        {
                          onSuccess: () => {
                            if (request) {
                              notify.joinRequestApproved({
                                requesterId: request.userId,
                                campaignId,
                                campaignTitle: campaign.title,
                              });
                            }
                          },
                        },
                      );
                    }}
                    onRejectJoinRequest={(requestId) => {
                      const request = pendingJoinRequests.find(
                        (item) => item.id === requestId,
                      );
                      updateJoinRequestStatusMutation.mutate(
                        { id: requestId, status: "Rejected" },
                        {
                          onSuccess: () => {
                            if (request) {
                              notify.joinRequestRejected({
                                requesterId: request.userId,
                                campaignId,
                                campaignTitle: campaign.title,
                              });
                            }
                          },
                        },
                      );
                    }}
                  />
                ),
              },
              {
                label: "Calendário",
                value: "Calendário",
                isAllowed: visibleTabs.includes("Calendário"),
                component: (
                  <CallendarTab
                    campaignId={campaignId}
                    canSeePrivateModules={canSeePrivateModules}
                    isMaster={isMaster}
                    sessions={sessions}
                    onDeleteSession={setSessionToDelete}
                  />
                ),
              },
            ]}
          />
        </View>
      </Screen.Body>

      {viewerType === "outsider" && (
        <Screen.Footer>
          <Button
            variant="tertiary"
            text={
              currentUserJoinRequest
                ? `Solicitação ${translateJoinStatus(
                    currentUserJoinRequest.status,
                  )}`
                : "Solicitar entrada na mesa"
            }
            disabled={!!currentUserJoinRequest || !currentUserId}
            onPress={() => {
              if (!currentUserId) return;
              router.push({
                pathname: "/campaign/[id]/join-request",
                params: { id: campaignId },
              } as any);
            }}
          />
        </Screen.Footer>
      )}

      <ModalBase
        visible={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        title="Excluir Agendamento"
        description={`Tem certeza que deseja excluir a sessão "${sessionToDelete?.title}"?`}
        confirmText="Excluir"
        onConfirm={handleDeleteSessionConfirm}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SURFACES.background },
  banner: {
    width: "100%",
    height: width * 1.05,
    justifyContent: "space-between",
    backgroundColor: SURFACES.card,
  },
  titleOverlay: {
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
  title: {
    fontSize: 26,
    color: DEFAULT_COLORS.white,
    lineHeight: 30,
  },
  masterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  masterAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.white_12,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
  },
  masterAvatarImage: {
    width: "100%",
    height: "100%",
  },
  masterText: {
    fontSize: 13,
    color: DEFAULT_COLORS.textMuted,
  },
  content: { padding: 20, gap: 20 },
});

function translateJoinStatus(status: string) {
  const labels: Record<string, string> = {
    Pending: "pendente",
    Approved: "aprovada",
    Rejected: "rejeitada",
  };
  return labels[status] ?? status;
}
