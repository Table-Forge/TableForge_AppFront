import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { parseUTCDate } from "@/src/utils/format";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";

dayjs.extend(utc);

export interface CalendarWidgetProps {
  isMaster: boolean;
  onSelectDate: (date: dayjs.Dayjs, daySessions: ICampaignSessionList[]) => void;
  sessions: ICampaignSessionList[];
}

export function CalendarWidget({
  isMaster,
  onSelectDate,
  sessions,
}: CalendarWidgetProps) {
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
        const dateKey = parseUTCDate(session.date).format("YYYY-MM-DD");
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
        isToday: date.isSame(today, "day"),
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
                isToday,
                sessions: daySessions,
              }) => {
                const hasSession = daySessions.length > 0;
                const isDisabled = (!isMaster || isBeforeToday) && !hasSession;

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
                      isToday && styles.todayCell,
                    ]}
                    onPress={() => onSelectDate(date, daySessions)}
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
}

const styles = StyleSheet.create({
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
    borderColor: DEFAULT_COLORS.orangeBorder_45,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBright,
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
});
