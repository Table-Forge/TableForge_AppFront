import React from "react";
import { StyleSheet, View } from "react-native";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { CalendarWidget } from "@/src/components/calendar-widget/calendar-widget";
import { ICampaignSessionList } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

dayjs.extend(utc);

interface CampaignCalendarSectionProps {
  isMaster: boolean;
  sessions: ICampaignSessionList[];
  onSelectDate: (date: dayjs.Dayjs, daySessions: ICampaignSessionList[]) => void;
}

export function CampaignCalendarSection({
  isMaster,
  sessions,
  onSelectDate,
}: CampaignCalendarSectionProps) {
  return (
    <View style={styles.module}>
      <ThemedText style={styles.moduleTitle}>Agenda</ThemedText>
      <CalendarWidget
        isMaster={isMaster}
        sessions={sessions}
        onSelectDate={onSelectDate}
      />
    </View>
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
});
