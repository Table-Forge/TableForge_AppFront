import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

import { CampaignCalendarSection } from "./sections/campaign-calendar";
import { CampaignSessionsSection, SessionItem } from "./sections/campaign-sessions";

dayjs.extend(utc);

interface CallendarTabProps {
  campaignId: number;
  canSeePrivateModules: boolean;
  isMaster: boolean;
  onDeleteSession: (session: ICampaignSessionList) => void;
  sessions: ICampaignSessionList[];
}

export function CallendarTab({
  campaignId,
  canSeePrivateModules,
  isMaster,
  onDeleteSession,
  sessions,
}: CallendarTabProps) {
  const router = useRouter();
  const [selectedSessionId, setSelectedSessionId] = useState<number>();
  const [selectedDateSessions, setSelectedDateSessions] = useState<{
    date: dayjs.Dayjs;
    sessions: ICampaignSessionList[];
  } | null>(null);

  const handleCreateSession = (date?: dayjs.Dayjs) => {
    if (!isMaster) return;

    router.push({
      pathname: "/campaign-session/create",
      params: date ? { campaignId, date: date.toISOString() } : { campaignId },
    } as any);
  };

  const handleSelectDate = (date: dayjs.Dayjs, daySessions: ICampaignSessionList[]) => {
    if (daySessions.length > 0) {
      setSelectedDateSessions({ date, sessions: daySessions });
    } else if (isMaster && !date.isBefore(dayjs().startOf("day"), "day")) {
      handleCreateSession(date);
    }
  };

  if (!canSeePrivateModules) {
    return (
      <View style={styles.module}>
        <ThemedText style={styles.moduleTitle}>Acesso à mesa</ThemedText>
        <ThemedText style={styles.description}>
          Solicite entrada para visualizar as sessões e o calendário.
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      <CampaignCalendarSection
        isMaster={isMaster}
        sessions={sessions}
        onSelectDate={handleSelectDate}
      />

      <CampaignSessionsSection
        isMaster={isMaster}
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={setSelectedSessionId}
        onEditSession={(session) =>
          router.push({
            pathname: "/campaign-session/create",
            params: { editId: session.id, campaignId },
          } as any)
        }
        onDeleteSession={onDeleteSession}
        onCreateSession={() => handleCreateSession()}
      />

      <ModalBase
        visible={!!selectedDateSessions}
        onClose={() => setSelectedDateSessions(null)}
        title={`Sessões em ${selectedDateSessions?.date.format("DD/MM/YYYY")}`}
        eyebrow="Calendário"
        cancelText="Fechar"
        showFooter={true}
      >
        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {selectedDateSessions?.sessions.map((session) => (
            <SessionItem
              key={session.id}
              isExpanded={selectedSessionId === session.id}
              isMaster={isMaster}
              session={session}
              onDeleteSession={(s) => {
                onDeleteSession(s);
                setSelectedDateSessions((curr) => {
                  if (!curr) return null;
                  const remaining = curr.sessions.filter((x) => x.id !== s.id);
                  if (remaining.length === 0) return null;
                  return { ...curr, sessions: remaining };
                });
              }}
              onPress={() =>
                setSelectedSessionId((currentId) =>
                  currentId === session.id ? undefined : session.id,
                )
              }
              onEditSession={() => {
                setSelectedDateSessions(null);
                router.push({
                  pathname: "/campaign-session/create",
                  params: { editId: session.id, campaignId },
                } as any);
              }}
            />
          ))}
        </ScrollView>
      </ModalBase>
    </>
  );
}

const styles = StyleSheet.create({
  module: {
    padding: 18,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  moduleTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  description: {
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
  },
  modalScroll: {
    maxHeight: 350,
    width: "100%",
  },
});
