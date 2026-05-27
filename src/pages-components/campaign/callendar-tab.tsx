import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import dayjs from "dayjs";

import { Button } from "@/src/components/button/button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

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

  const handleCreateSession = (date?: string) => {
    if (!isMaster) return;

    router.push({
      pathname: "/campaign-session/create",
      params: date ? { campaignId, date } : { campaignId },
    } as any);
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
      <View style={styles.module}>
        <ThemedText style={styles.moduleTitle}>Agenda</ThemedText>
        <CalendarWidget
          isMaster={isMaster}
          sessions={sessions}
          onSelectDate={handleCreateSession}
        />
      </View>

      <View style={styles.module}>
        <ModuleHeader
          title="Sessões agendadas"
          actionText={isMaster ? "Nova sessão" : undefined}
          onActionPress={isMaster ? () => handleCreateSession() : undefined}
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
                setSelectedSessionId((currentId) =>
                  currentId === session.id ? undefined : session.id,
                )
              }
              onEditSession={() =>
                router.push({
                  pathname: "/campaign-session/[sessionId]/edit",
                  params: { sessionId: session.id },
                } as any)
              }
            />
          ))
        ) : (
          <EmptyText text="Nenhuma sessão agendada." />
        )}
      </View>
    </>
  );
}

const CalendarWidget = ({
  isMaster,
  onSelectDate,
  sessions,
}: {
  isMaster: boolean;
  onSelectDate: (date: string) => void;
  sessions: ICampaignSessionList[];
}) => {
  const daysOfWeek = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const [visibleMonth, setVisibleMonth] = useState(() =>
    dayjs().startOf("month"),
  );
  const sessionsByDate = useMemo(() => {
    return sessions.reduce<Record<string, ICampaignSessionList[]>>(
      (acc, session) => {
        const dateKey = dayjs(session.date).format("YYYY-MM-DD");
        acc[dateKey] = [...(acc[dateKey] ?? []), session];
        return acc;
      },
      {},
    );
  }, [sessions]);
  const calendarDays = useMemo(() => {
    const firstDay = visibleMonth.startOf("month");
    const gridStart = firstDay.subtract(firstDay.day(), "day");
    const today = dayjs().startOf("day");

    return Array.from({ length: 42 }, (_, index) => {
      const date = gridStart.add(index, "day");
      const dateKey = date.format("YYYY-MM-DD");

      return {
        date,
        dateKey,
        isBeforeToday: date.isBefore(today, "day"),
        isCurrentMonth: date.month() === visibleMonth.month(),
        sessions: sessionsByDate[dateKey] ?? [],
      };
    });
  }, [sessionsByDate, visibleMonth]);

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() =>
            setVisibleMonth((currentMonth) =>
              currentMonth.subtract(1, "month"),
            )
          }
        >
          <FontAwesome5
            name="chevron-left"
            size={12}
            color={DEFAULT_COLORS.white}
          />
        </TouchableOpacity>
        <ThemedText style={styles.monthText}>
          {monthNames[visibleMonth.month()]} {visibleMonth.year()}
        </ThemedText>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() =>
            setVisibleMonth((currentMonth) => currentMonth.add(1, "month"))
          }
        >
          <FontAwesome5
            name="chevron-right"
            size={12}
            color={DEFAULT_COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeaderRow}>
        {daysOfWeek.map((day) => (
          <ThemedText key={day} style={styles.dayOfWeekText}>
            {day}
          </ThemedText>
        ))}
      </View>

      {Array.from({ length: 6 }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.daysRow}>
          {calendarDays
            .slice(rowIndex * 7, rowIndex * 7 + 7)
            .map(
              ({
                date,
                dateKey,
                isBeforeToday,
                isCurrentMonth,
                sessions: daySessions,
              }) => {
              const hasSession = daySessions.length > 0;
              const isDisabled = !isMaster || isBeforeToday;

              return (
                <TouchableOpacity
                  key={dateKey}
                  activeOpacity={0.75}
                  disabled={isDisabled}
                  style={[
                    styles.dayCell,
                    !isCurrentMonth && styles.otherMonthCell,
                    isBeforeToday && styles.pastDayCell,
                    hasSession && styles.dayWithSessionCell,
                  ]}
                  onPress={() => onSelectDate(date.toISOString())}
                >
                  <ThemedText
                    style={[
                      styles.dayText,
                      !isCurrentMonth && styles.otherMonthText,
                      isBeforeToday && styles.pastDayText,
                      hasSession && styles.dayWithSessionText,
                    ]}
                  >
                    {date.date()}
                  </ThemedText>
                  {hasSession && <View style={styles.sessionMarker} />}
                </TouchableOpacity>
              );
            },
            )}
        </View>
      ))}
    </View>
  );
};

const SessionItem = ({
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
  const sessionDate = dayjs(session.date);
  const sessionPlace = session.link || session.location;

  return (
    <Pressable onPress={onPress} style={styles.sessionItem}>
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
        {isMaster && (
          <View style={styles.sessionActionsBox}>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                onDeleteSession(session);
              }}
            >
              <FontAwesome5
                name="trash"
                size={16}
                color={DEFAULT_COLORS.textMutedLight}
              />
            </Pressable>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                onEditSession();
              }}
            >
              <FontAwesome5
                name="pen"
                size={16}
                color={DEFAULT_COLORS.textMutedLight}
              />
            </Pressable>
          </View>
        )}
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
  description: {
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 14,
    color: DEFAULT_COLORS.textMuted,
  },
  calendarContainer: {
    borderRadius: RADII.md,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SURFACES.fill,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: BORDERS.subtle,
  },
  monthText: {
    flex: 1,
    fontSize: 14,
    color: DEFAULT_COLORS.white,
    textAlign: "center",
    textTransform: "capitalize",
    ...fonts.bold,
  },
  daysHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayOfWeekText: {
    width: "14%",
    textAlign: "center",
    fontSize: 11,
    color: DEFAULT_COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dayCell: {
    width: "14%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    borderRadius: RADII.sm,
    position: "relative",
  },
  otherMonthCell: {
    opacity: 0.45,
  },
  pastDayCell: {
    opacity: 0.3,
  },
  dayWithSessionCell: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.orange,
  },
  dayText: {
    fontSize: 13,
    color: DEFAULT_COLORS.white,
  },
  otherMonthText: {
    color: DEFAULT_COLORS.white_25,
  },
  pastDayText: {
    color: DEFAULT_COLORS.white_25,
  },
  dayWithSessionText: {
    color: DEFAULT_COLORS.white,
    fontWeight: "bold",
  },
  sessionMarker: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: DEFAULT_COLORS.orange,
    position: "absolute",
    bottom: 5,
  },
  sessionItem: {
    borderTopWidth: 1,
    borderTopColor: BORDERS.divider,
    paddingVertical: 14,
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
