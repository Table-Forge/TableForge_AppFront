import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { parseUTCDate } from "@/src/utils/format";
import { SwipeActionBtn, SwipeActionsContainer } from "@/src/components/swipe-actions/swipe-actions";

import { Button } from "@/src/components/button/button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface CampaignSessionsSectionProps {
  isMaster: boolean;
  sessions: ICampaignSessionList[];
  selectedSessionId?: number;
  onSelectSession: (id?: number) => void;
  onEditSession: (session: ICampaignSessionList) => void;
  onDeleteSession: (session: ICampaignSessionList) => void;
  onCreateSession: () => void;
}

export function CampaignSessionsSection({
  isMaster,
  sessions,
  selectedSessionId,
  onSelectSession,
  onEditSession,
  onDeleteSession,
  onCreateSession,
}: CampaignSessionsSectionProps) {
  return (
    <View style={styles.module}>
      <ModuleHeader
        title="Sessões agendadas"
        actionText={isMaster ? "Nova sessão" : undefined}
        onActionPress={isMaster ? onCreateSession : undefined}
      />
      {sessions.length ? (
        sessions.map((session) => (
          <SessionItem
            key={session.id}
            isExpanded={selectedSessionId === session.id}
            isMaster={isMaster}
            session={session}
            onDeleteSession={onDeleteSession}
            onPress={() =>
              onSelectSession(selectedSessionId === session.id ? undefined : session.id)
            }
            onEditSession={() => onEditSession(session)}
          />
        ))
      ) : (
        <EmptyText text="Nenhuma sessão agendada." />
      )}
    </View>
  );
}

export const SessionItem = ({
  isExpanded,
  isMaster,
  onDeleteSession,
  onEditSession,
  onPress,
  session,
}: {
  isExpanded: boolean;
  isMaster: boolean;
  onDeleteSession: (session: ICampaignSessionList) => void;
  onEditSession: () => void;
  onPress: () => void;
  session: ICampaignSessionList;
}) => {
  const sessionDate = parseUTCDate(session.date);
  const sessionPlace = session.link || session.location;

  const renderRightActions = () => {
    return (
      <SwipeActionsContainer>
        <SwipeActionBtn variant="edit" onPress={onEditSession}>
          <FontAwesome5 name="pen" size={14} color={DEFAULT_COLORS.white} />
        </SwipeActionBtn>
        <SwipeActionBtn variant="danger" onPress={() => onDeleteSession(session)}>
          <FontAwesome5 name="trash" size={14} color={DEFAULT_COLORS.white} />
        </SwipeActionBtn>
      </SwipeActionsContainer>
    );
  };

  const content = (
    <Pressable onPress={onPress} style={[styles.sessionItem, !isMaster && styles.sessionItemNormal]}>
      <View style={styles.sessionSummary}>
        <View style={styles.sessionDateBox}>
          <ThemedText style={styles.sessionDateText}>
            {sessionDate.format("DD/MM")}
          </ThemedText>
          <ThemedText style={styles.sessionDateText}>
            {sessionDate.format("HH:mm")}
          </ThemedText>
        </View>
        <View style={styles.sessionContentBox}>
          <ThemedText style={styles.sessionTitle}>{session.title}</ThemedText>
          <ThemedText style={styles.sessionLocation}>{sessionPlace}</ThemedText>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.sessionDetails}>
          <DetailItem label="Título" value={session.title} />
          <DetailItem
            label="Data"
            value={sessionDate.format("DD/MM/YYYY [às] HH:mm")}
          />
          <DetailItem
            label={session.link ? "Link" : "Local"}
            value={sessionPlace}
          />
        </View>
      )}
    </Pressable>
  );

  if (isMaster) {
    return (
      <Swipeable
        renderRightActions={renderRightActions}
        containerStyle={styles.swipeContainer}
      >
        {content}
      </Swipeable>
    );
  }

  return content;
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <ThemedText style={styles.detailLabel}>{label}</ThemedText>
    <ThemedText style={styles.detailValue}>{value || "-"}</ThemedText>
  </View>
);

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

const EmptyText = ({ text }: { text: string }) => (
  <ThemedText style={styles.emptyText}>{text}</ThemedText>
);

const styles = StyleSheet.create({
  module: {
    padding: 18,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
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
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  moduleTitleNoMargin: {
    marginBottom: 0,
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: DEFAULT_COLORS.textMuted,
  },
  sessionItem: {
    paddingVertical: 14,
    backgroundColor: SURFACES.card,
  },
  sessionItemNormal: {
    borderTopWidth: 1,
    borderTopColor: BORDERS.divider,
    marginTop: 4,
  },
  swipeContainer: {
    borderTopWidth: 1,
    borderTopColor: BORDERS.divider,
    marginTop: 4,
  },
  sessionSummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionDateBox: {
    width: 70,
    borderRightWidth: 1,
    borderRightColor: BORDERS.divider,
    paddingRight: 12,
    alignItems: "center",
    gap: 2,
  },
  sessionDateText: {
    fontSize: 13,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  sessionContentBox: {
    flex: 1,
    paddingLeft: 12,
    gap: 2,
  },
  sessionTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  sessionLocation: {
    fontSize: 12,
    color: DEFAULT_COLORS.white_64,
  },
  sessionActionsBox: {
    flexDirection: "row",
    gap: 14,
    paddingLeft: 12,
  },
  sessionDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDERS.divider,
    gap: 10,
  },
  detailItem: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  detailValue: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
});
