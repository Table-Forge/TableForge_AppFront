import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { Tabs } from "@/src/components/tabs/tabs";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useCampaignAnnouncements } from "@/src/features/campaign-announcements/hooks/use-campaign-announcements";
import { useCampaignMembers } from "@/src/features/campaign-members/hooks/use-campaign-members";
import { useCampaignSessions } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions";
import { useCampaignSessionsMutation } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions-mutations";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCharacters } from "@/src/features/characters/hooks/use-characters";
import { useJoinRequests } from "@/src/features/join-requests/hooks/use-join-requests";
import { useJoinRequestsMutation } from "@/src/features/join-requests/hooks/use-join-requests-mutations";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { CallendarTab } from "@/src/pages-components/campaign/callendar-tab";
import { HomeTab } from "@/src/pages-components/campaign/home-tab";
import { MembersTab } from "@/src/pages-components/campaign/members-tab";
import { DEFAULT_COLORS } from "@/src/theme/colors";
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
  const { data: campaign, isLoading, isError } = useCampaign(campaignId);
  const { data: members = [] } = useCampaignMembers({ campaignId });
  const { data: joinRequests = [] } = useJoinRequests({ campaignId });
  const { data: announcements = [] } = useCampaignAnnouncements({ campaignId });
  const { data: sessionsResponse } = useCampaignSessions({
    campaignId,
    page: 1,
    size: 100,
  });
  const { data: charactersResponse } = useCharacters({
    page: 1,
    size: 100,
    enabled: members.length > 0,
  });
  const {
    createJoinRequestMutation,
    updateJoinRequestStatusMutation,
    isCreatingJoinRequest,
    isUpdatingJoinRequest,
  } = useJoinRequestsMutation(campaignId);

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
    <MainContainer style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={campaign.bannerUrl ? { uri: campaign.bannerUrl } : undefined}
          style={styles.banner}
        >
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

          <View style={styles.titleOverlay}>
            <ThemedText weight="bold" style={styles.title}>
              {campaign.title}
            </ThemedText>
            <ThemedText style={styles.masterText}>
              Mestre: {campaign.creatorUsername || "Mestre desconhecido"}
            </ThemedText>
          </View>
        </ImageBackground>

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
                    onApproveJoinRequest={(requestId) =>
                      updateJoinRequestStatusMutation.mutate({
                        id: requestId,
                        status: "Approved",
                      })
                    }
                    onRejectJoinRequest={(requestId) =>
                      updateJoinRequestStatusMutation.mutate({
                        id: requestId,
                        status: "Rejected",
                      })
                    }
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
      </ScrollView>

      {viewerType === "outsider" && (
        <View style={styles.footer}>
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
            isLoading={isCreatingJoinRequest}
            onPress={() => {
              if (!currentUserId) return;
              createJoinRequestMutation.mutate({
                campaignId,
                userId: currentUserId,
              });
            }}
          />
        </View>
      )}

      <ModalBase
        visible={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        title="Excluir Agendamento"
        description={`Tem certeza que deseja excluir a sessão "${sessionToDelete?.title}"?`}
        confirmText="Excluir"
        onConfirm={handleDeleteSessionConfirm}
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    width: "100%",
    height: width * 0.7,
    justifyContent: "space-between",
    backgroundColor: DEFAULT_COLORS.primary,
  },
  titleOverlay: {
    padding: 20,
    backgroundColor: "rgba(26, 26, 46, 0.85)",
    borderTopWidth: 2,
    borderTopColor: DEFAULT_COLORS.tertiary,
  },
  title: {
    fontSize: 26,
    color: DEFAULT_COLORS.white,
    textShadowColor: "black",
    textShadowRadius: 10,
  },
  masterText: { fontSize: 14, color: DEFAULT_COLORS.grays._200, marginTop: 4 },
  content: { padding: 20, gap: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: DEFAULT_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
});

function translateJoinStatus(status: string) {
  const labels: Record<string, string> = {
    Pending: "pendente",
    Approved: "aprovada",
    Rejected: "rejeitada",
  };
  return labels[status] ?? status;
}
