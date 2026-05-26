import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import dayjs from "dayjs";

import { Button } from "@/src/components/button/button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";

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
        <CalendarWidget />
      </View>

      <View style={styles.module}>
        <ModuleHeader
          title="Sessões agendadas"
          actionText={isMaster ? "Nova sessão" : undefined}
          onActionPress={
            isMaster
              ? () =>
                  router.push({
                    pathname: "/campaign-session/create",
                    params: { campaignId },
                  } as any)
              : undefined
          }
        />
        {sessions.length ? (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View style={styles.sessionDateBox}>
                <ThemedText style={styles.sessionDateText}>
                  {dayjs(session.date).format("DD/MM")}
                </ThemedText>
                <ThemedText style={styles.sessionDateText}>
                  - {dayjs(session.date).format("HH:mm")}
                </ThemedText>
              </View>
              <View style={styles.sessionContentBox}>
                <ThemedText style={styles.sessionTitle}>
                  {session.title}
                </ThemedText>
                <ThemedText style={styles.sessionLocation}>
                  {session.location}
                </ThemedText>
              </View>
              {isMaster && (
                <View style={styles.sessionActionsBox}>
                  <TouchableOpacity onPress={() => onDeleteSession(session)}>
                    <FontAwesome5
                      name="trash"
                      size={16}
                      color={DEFAULT_COLORS.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/campaign-session/[sessionId]/edit",
                        params: { sessionId: session.id },
                      } as any)
                    }
                  >
                    <FontAwesome5
                      name="pen"
                      size={16}
                      color={DEFAULT_COLORS.white}
                    />
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
  );
}

const CalendarWidget = () => {
  const daysOfWeek = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
  const calendarGrid = [
    [29, 30, 31, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 1],
    [2, 3, 4, 5, 6, 7, 8],
  ];

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <View style={styles.monthPill}>
          <ThemedText style={styles.monthText}>janeiro</ThemedText>
        </View>
      </View>
      <View style={styles.daysHeaderRow}>
        {daysOfWeek.map((day) => (
          <ThemedText key={day} style={styles.dayOfWeekText}>
            {day}
          </ThemedText>
        ))}
      </View>
      {calendarGrid.map((row, i) => (
        <View key={i} style={styles.daysRow}>
          {row.map((day, j) => {
            const isOtherMonth = (i === 0 && day > 20) || (i >= 4 && day < 15);
            const isSelected = day === 30 && !isOtherMonth;
            return (
              <View
                key={j}
                style={[styles.dayCell, isSelected && styles.selectedDayCell]}
              >
                <ThemedText
                  style={[
                    styles.dayText,
                    isOtherMonth && styles.otherMonthText,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {day}
                </ThemedText>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

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
    textTransform: "uppercase",
  },
  moduleTitleNoMargin: {
    marginBottom: 0,
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
  },
  calendarContainer: {
    borderRadius: 8,
  },
  calendarHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  monthPill: {
    backgroundColor: DEFAULT_COLORS.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  monthText: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  daysHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayOfWeekText: {
    width: "14%",
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayCell: {
    width: "14%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    borderRadius: 8,
  },
  selectedDayCell: {
    backgroundColor: DEFAULT_COLORS.black,
  },
  dayText: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  otherMonthText: {
    color: "rgba(255,255,255,0.2)",
  },
  selectedDayText: {
    color: DEFAULT_COLORS.white,
    fontWeight: "bold",
  },
  sessionItem: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  sessionDateBox: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
    paddingRight: 12,
    alignItems: "center",
  },
  sessionDateText: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  sessionContentBox: {
    flex: 1,
    paddingLeft: 12,
  },
  sessionTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
    fontWeight: "bold",
  },
  sessionLocation: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  sessionActionsBox: {
    flexDirection: "row",
    gap: 12,
    paddingLeft: 12,
  },
});
