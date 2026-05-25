import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";
import dayjs from "dayjs";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { CharacterItem } from "@/src/components/character-item/character-item";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useCampaignAnnouncements } from "@/src/features/campaign-announcements/hooks/use-campaign-announcements";
import { useCampaignMembers } from "@/src/features/campaign-members/hooks/use-campaign-members";
import { ICampaignMember } from "@/src/features/campaign-members/schemas/campaign-member.schema";
import { useCampaignSessions } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions";
import { useCampaignSessionsMutation } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions-mutations";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCharacters } from "@/src/features/characters/hooks/use-characters";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { useJoinRequests } from "@/src/features/join-requests/hooks/use-join-requests";
import { useJoinRequestsMutation } from "@/src/features/join-requests/hooks/use-join-requests-mutations";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";

const { width } = Dimensions.get("window");
const BORDER_COLOR = DEFAULT_COLORS.tertiary_30;

type TabType = "Início" | "Jogadores" | "Calendário";

export default function CampaignDetails() {
  const { handleBack } = useBackRouter();
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const campaignId = Number(id);
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
  const [sessionToDelete, setSessionToDelete] = useState<any>(null);

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
  const canOpenChat = !!campaign?.isChatEnabled && canSeePrivateModules;
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
        onSuccess: () => setSessionToDelete(null)
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
                    onPress={() => router.push({ pathname: "/campaign/[id]/settings", params: { id: campaignId } } as any)}
                  />
                )}
                <ActionButton
                  variant="circle"
                  icon={
                    <FontAwesome5
                      name="beer"
                      size={20}
                      color={DEFAULT_COLORS.white}
                    />
                  }
                  onPress={() => router.push({ pathname: "/campaign-chat/[campaignId]", params: { campaignId } } as any)}
                />
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
          
          <View style={styles.tabsContainer}>
            {visibleTabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <ThemedText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "Início" && (
            <>
              <View style={styles.module}>
                <ThemedText style={styles.moduleTitle}>MISSÃO</ThemedText>
                <ThemedText style={styles.description}>
                  {campaign.description || "Sem descrição."}
                </ThemedText>
              </View>

              <View style={styles.module}>
                <ThemedText style={styles.moduleTitle}>DETALHES DA PARTY</ThemedText>
                <View style={styles.row}>
                  <InfoItem
                    icon={(color) => <FontAwesome5 name="book-reader" size={14} color={color} />}
                    label="Sistema"
                    value={campaign.gameSystemName || (campaign.gameSystemId ? `Sistema ${campaign.gameSystemId}` : "-")}
                  />
                  <InfoItem
                    icon={(color) => <FontAwesome6 name="shield" size={14} color={color} />}
                    label="Nível"
                    value={campaign.difficulty || "-"}
                  />
                </View>
                <View style={[styles.row, { marginTop: 15 }]}>
                  <InfoItem
                    icon={(color) => <FontAwesome6 name="location-dot" size={14} color={color} />}
                    label="Local"
                    value={campaign.locationName || campaign.address || "-"}
                  />
                  <InfoItem
                    icon={(color) => <Fontisto name="persons" size={14} color={color} />}
                    label="Vagas"
                    value={`${campaign.playersLimit || 0} jogadores`}
                  />
                </View>
              </View>

              {canSeePrivateModules && (
                <View style={styles.module}>
                  <ModuleHeader
                    title="ANÚNCIOS"
                    actionText={isMaster ? "CRIAR" : undefined}
                    onActionPress={isMaster ? () => router.push({ pathname: "/campaign-announcement/create", params: { campaignId } } as any) : undefined}
                  />
                  {announcements.length ? (
                    announcements.map((announcement) => (
                      <InlineItem
                        key={announcement.id}
                        title={announcement.title}
                        description={announcement.content}
                      />
                    ))
                  ) : (
                    <EmptyText text="Nenhum anúncio publicado." />
                  )}
                </View>
              )}
            </>
          )}

          {activeTab === "Jogadores" && (
            <>
              {canSeePrivateModules ? (
                <View style={styles.module}>
                  <View style={styles.membersHeader}>
                    <ThemedText
                      style={[styles.moduleTitle, styles.moduleTitleNoMargin]}
                    >
                      MEMBROS
                    </ThemedText>
                    <ThemedText style={styles.memberCounter}>
                      {members.length}/{campaign.playersLimit}
                    </ThemedText>
                  </View>
                  {members.length ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.membersScrollContainer}
                    >
                      {members.map((member) => (
                        <CharacterItem
                          key={member.id}
                          data={getMemberCharacter(member, characters)}
                          cardColor={DEFAULT_COLORS.background}
                          disabled={!member.characterId}
                        />
                      ))}
                    </ScrollView>
                  ) : (
                    <EmptyText text="Nenhum membro listado." />
                  )}
                </View>
              ) : (
                <View style={styles.module}>
                  <ThemedText style={styles.moduleTitle}>ACESSO À MESA</ThemedText>
                  <ThemedText style={styles.description}>
                    Solicite entrada para visualizar membros.
                  </ThemedText>
                </View>
              )}

              {isMaster && (
                <View style={styles.module}>
                  <ThemedText style={styles.moduleTitle}>SOLICITAÇÕES DE ENTRADA</ThemedText>
                  {pendingJoinRequests.length ? (
                    pendingJoinRequests.map((request) => (
                      <View key={request.id} style={styles.requestItem}>
                        <InlineItem
                          title={request.username || `Usuário ${request.userId}`}
                          description={request.message || "Sem mensagem."}
                        />
                        <View style={styles.requestActions}>
                          <Button
                            size="sm"
                            variant="secondary"
                            text="REJEITAR"
                            isLoading={isUpdatingJoinRequest}
                            onPress={() =>
                              updateJoinRequestStatusMutation.mutate({
                                id: request.id,
                                status: "Rejected",
                              })
                            }
                          />
                          <Button
                            size="sm"
                            variant="tertiary"
                            text="APROVAR"
                            isLoading={isUpdatingJoinRequest}
                            onPress={() =>
                              updateJoinRequestStatusMutation.mutate({
                                id: request.id,
                                status: "Approved",
                              })
                            }
                          />
                        </View>
                      </View>
                    ))
                  ) : (
                    <EmptyText text="Nenhuma solicitação pendente." />
                  )}
                </View>
              )}
            </>
          )}

          {activeTab === "Calendário" && (
            <>
              {canSeePrivateModules ? (
                <>
                  <View style={styles.module}>
                     <ThemedText style={styles.moduleTitle}>AGENDA</ThemedText>
                     <CalendarWidget />
                  </View>
                  
                  <View style={styles.module}>
                    <ModuleHeader
                      title="SESSÕES AGENDADAS"
                      actionText={isMaster ? "NOVA SESSÃO" : undefined}
                      onActionPress={isMaster ? () => router.push({ pathname: "/campaign-session/create", params: { campaignId } } as any) : undefined}
                    />
                    {sessions.length ? (
                      sessions.map((session) => (
                        <View key={session.id} style={styles.sessionItem}>
                          <View style={styles.sessionDateBox}>
                            <ThemedText style={{ fontSize: 14, color: DEFAULT_COLORS.white }}>{dayjs(session.date).format('DD/MM')}</ThemedText>
                            <ThemedText style={{ fontSize: 14, color: DEFAULT_COLORS.white }}>- {dayjs(session.date).format('HH:mm')}</ThemedText>
                          </View>
                          <View style={styles.sessionContentBox}>
                            <ThemedText style={{ fontSize: 14, color: DEFAULT_COLORS.white, fontWeight: "bold" }}>{session.title}</ThemedText>
                            <ThemedText style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{session.location}</ThemedText>
                          </View>
                          {isMaster && (
                            <View style={styles.sessionActionsBox}>
                              <TouchableOpacity onPress={() => setSessionToDelete(session)}>
                                <FontAwesome5 name="trash" size={16} color={DEFAULT_COLORS.white} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => router.push({ pathname: "/campaign-session/[sessionId]/edit", params: { sessionId: session.id } } as any)}>
                                <FontAwesome5 name="pen" size={16} color={DEFAULT_COLORS.white} />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ))
                    ) : (
                      <EmptyText text="Nenhuma sessão agendada." />
                    )}
                  </View>
                </>
              ) : (
                <View style={styles.module}>
                  <ThemedText style={styles.moduleTitle}>ACESSO À MESA</ThemedText>
                  <ThemedText style={styles.description}>
                    Solicite entrada para visualizar as sessões e o calendário.
                  </ThemedText>
                </View>
              )}
            </>
          )}

        </View>
      </ScrollView>

      <View style={styles.footer}>
        {viewerType !== "outsider" ? (
          canOpenChat ? (
            <Button
              variant="tertiary"
              text="ABRIR CHAT DA MESA"
              onPress={() => router.push({ pathname: "/campaign-chat/[campaignId]", params: { campaignId } } as any)}
            />
          ) : null
        ) : (
          <Button
            variant="tertiary"
            text={
              currentUserJoinRequest
                ? `SOLICITAÇÃO ${translateJoinStatus(
                    currentUserJoinRequest.status,
                  )}`
                : "SOLICITAR ENTRADA NA MESA"
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
        )}
      </View>

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

// Subcomponents

const CalendarWidget = () => {
   const daysOfWeek = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
   const calendarGrid = [
      [29, 30, 31, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, 31, 1],
      [2, 3, 4, 5, 6, 7, 8]
   ];

   return (
     <View style={styles.calendarContainer}>
       <View style={styles.calendarHeader}>
         <View style={styles.monthPill}>
           <ThemedText style={styles.monthText}>janeiro</ThemedText>
         </View>
       </View>
       <View style={styles.daysHeaderRow}>
         {daysOfWeek.map(day => (
           <ThemedText key={day} style={styles.dayOfWeekText}>{day}</ThemedText>
         ))}
       </View>
       {calendarGrid.map((row, i) => (
         <View key={i} style={styles.daysRow}>
           {row.map((day, j) => {
             const isOtherMonth = (i === 0 && day > 20) || (i >= 4 && day < 15);
             const isSelected = day === 30 && !isOtherMonth;
             return (
               <View key={j} style={[styles.dayCell, isSelected && styles.selectedDayCell]}>
                 <ThemedText style={[styles.dayText, isOtherMonth && styles.otherMonthText, isSelected && styles.selectedDayText]}>
                   {day}
                 </ThemedText>
               </View>
             )
           })}
         </View>
       ))}
     </View>
   )
}

const ModuleHeader = ({
  title,
  actionText,
  onActionPress,
}: {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}) => (
  <View style={styles.moduleHeader}>
    <ThemedText style={[styles.moduleTitle, styles.moduleTitleNoMargin]}>
      {title}
    </ThemedText>
    {!!actionText && !!onActionPress && (
      <Button
        size="sm"
        variant="secondary"
        text={actionText}
        onPress={onActionPress}
      />
    )}
  </View>
);

const InlineItem = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <View style={styles.inlineItem}>
    <ThemedText weight="bold" style={styles.inlineTitle}>
      {title}
    </ThemedText>
    {!!description && (
      <ThemedText style={styles.inlineDescription} numberOfLines={2}>
        {description}
      </ThemedText>
    )}
  </View>
);

const EmptyText = ({ text }: { text: string }) => (
  <ThemedText style={styles.emptyText}>{text}</ThemedText>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: (color: string) => React.ReactNode;
  label: string;
  value: string;
}) => (
  <View style={{ flex: 1, gap: 4 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      {icon && <View style={styles.iconContainer}>{icon(BORDER_COLOR)}</View>}
      <ThemedText
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: 1,
        }}
      >
        {label.toUpperCase()}
      </ThemedText>
    </View>
    <ThemedText weight="bold" style={{ fontSize: 14 }}>
      {value}
    </ThemedText>
  </View>
);

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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary_30,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 16
  },
  activeTab: {
    backgroundColor: DEFAULT_COLORS.tertiary
  },
  tabText: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
    fontWeight: "bold"
  },
  activeTabText: {
    color: DEFAULT_COLORS.white
  },
  module: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.1)",
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  moduleTitleNoMargin: {
    marginBottom: 0,
    flex: 1,
  },
  description: { fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 22 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  membersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  memberCounter: {
    color: DEFAULT_COLORS.grays._200,
    fontSize: 13,
  },
  membersScrollContainer: {
    gap: 12,
    paddingRight: 20,
  },
  inlineItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  inlineTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  inlineDescription: {
    marginTop: 3,
    fontSize: 13,
    color: "rgba(255,255,255,0.58)",
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
  },
  requestItem: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
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
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  playerCard: { width: (width - 40 - 32 - 16) / 2, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden", marginBottom: 16 },
  playerCardImagePlaceholder: { width: "100%", height: 100, backgroundColor: "rgba(255,255,255,0.1)" },
  playerCardContent: { padding: 10, alignItems: "center" },
  charName: { fontSize: 14, color: DEFAULT_COLORS.white, marginBottom: 4, textAlign: "center" },
  charDetails: { fontSize: 11, color: "rgba(255,255,255,0.7)", textAlign: "center" },

  calendarContainer: { borderRadius: 8 },
  calendarHeader: { alignItems: "center", marginBottom: 16 },
  monthPill: { backgroundColor: DEFAULT_COLORS.black, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  monthText: { fontSize: 14, color: DEFAULT_COLORS.white },
  daysHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  dayOfWeekText: { width: "14%", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)" },
  daysRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  dayCell: { width: "14%", alignItems: "center", justifyContent: "center", aspectRatio: 1, borderRadius: 8 },
  selectedDayCell: { backgroundColor: DEFAULT_COLORS.black },
  dayText: { fontSize: 14, color: DEFAULT_COLORS.white },
  otherMonthText: { color: "rgba(255,255,255,0.2)" },
  selectedDayText: { color: DEFAULT_COLORS.white, fontWeight: "bold" },
  
  sessionItem: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)", paddingVertical: 12, alignItems: "center", marginTop: 4 },
  sessionDateBox: { width: 80, borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.2)", paddingRight: 12, alignItems: "center" },
  sessionContentBox: { flex: 1, paddingLeft: 12 },
  sessionActionsBox: { flexDirection: "row", gap: 12, paddingLeft: 12 }
});

function translateJoinStatus(status: string) {
  const labels: Record<string, string> = {
    Pending: "PENDENTE",
    Approved: "APROVADA",
    Rejected: "REJEITADA",
  };
  return labels[status] ?? status;
}

function getMemberCharacter(
  member: ICampaignMember,
  characters: ICharacter[],
): ICharacter {
  const character = characters.find(
    (item) => item.id === member.characterId,
  );

  if (character) return character;

  return {
    id: member.characterId ?? member.userId,
    name: member.username || "Membro",
    classId: 0,
    className: member.role === "Master" ? "Mestre" : "Jogador",
    raceId: 0,
    raceName: "Membro da mesa",
    userId: member.userId,
    userUsername: member.username,
  };
}
