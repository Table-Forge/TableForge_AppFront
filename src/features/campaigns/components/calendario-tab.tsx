import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/src/components/themed-text/themed-text';
import { ICampaignSessionList } from '@/src/features/campaign-sessions/schemas/campaign-session.schema';
import { useCampaignSessionsMutation } from '@/src/features/campaign-sessions/hooks/use-campaign-sessions-mutations';
import { ModalBase } from '@/src/components/modals/modal-base/modal-base';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { DEFAULT_COLORS } from '@/src/theme/colors';
import dayjs from 'dayjs';

// Simple calendar widget
const CalendarWidget = () => {
   // Minimal placeholder calendar
   const daysOfWeek = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
   // A mock matrix for the calendar dates
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

export function CalendarioTab({ sessions, isMaster }: { sessions: ICampaignSessionList[], isMaster: boolean }) {
  const router = useRouter();
  const [sessionToDelete, setSessionToDelete] = useState<ICampaignSessionList | null>(null);
  const { deleteCampaignSessionMutation } = useCampaignSessionsMutation();

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      deleteCampaignSessionMutation.mutate(sessionToDelete.id, {
        onSuccess: () => setSessionToDelete(null)
      });
    }
  };  
  return (
    <View style={styles.container}>
      <ThemedText weight="bold" style={styles.title}>Calendário</ThemedText>
      
      <CalendarWidget />

      <ThemedText style={styles.sectionTitle}>Sessões Agendadas</ThemedText>
      
      <ThemedText style={styles.subSectionTitle}>Este mês</ThemedText>
      
      <View style={styles.sessionCard}>
         <View style={styles.sessionDateBox}>
            <ThemedText style={styles.sessionDateText}>30/02</ThemedText>
            <ThemedText style={styles.sessionDateText}>- 18:00</ThemedText>
         </View>
         <View style={styles.sessionContentBox}>
            <ThemedText style={styles.sessionTitleText}>Sessão 24 - O Retorno do Rei</ThemedText>
            <View style={{flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4}}>
               <FontAwesome5 name="map-marker-alt" size={10} color="rgba(255,255,255,0.7)" />
               <ThemedText style={styles.sessionLocationText}>Av. Paraná, 123</ThemedText>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4}}>
               <FontAwesome5 name="link" size={10} color="rgba(255,255,255,0.7)" />
               <ThemedText style={styles.sessionLocationText}>www.link.com</ThemedText>
            </View>
         </View>
         {isMaster && (
            <View style={styles.sessionActionsBox}>
               <TouchableOpacity><FontAwesome5 name="trash" size={16} color={DEFAULT_COLORS.white} /></TouchableOpacity>
               <TouchableOpacity><FontAwesome5 name="pen" size={16} color={DEFAULT_COLORS.white} /></TouchableOpacity>
            </View>
         )}
      </View>

      <ThemedText style={styles.subSectionTitle}>Próximas</ThemedText>
      
      {sessions.map(session => (
         <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionDateBox}>
               <ThemedText style={styles.sessionDateText}>{dayjs(session.date).format('DD/MM')}</ThemedText>
               <ThemedText style={styles.sessionDateText}>- {dayjs(session.date).format('HH:mm')}</ThemedText>
            </View>
            <View style={styles.sessionContentBox}>
               <ThemedText style={styles.sessionTitleText}>{session.title}</ThemedText>
               <ThemedText style={styles.sessionLocationText}>{session.location}</ThemedText>
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
      ))}

      <ModalBase
        visible={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        title="Excluir Agendamento"
        description={`Tem certeza que deseja excluir a sessão "${sessionToDelete?.title}"?`}
        confirmText="Excluir"
        onConfirm={handleDeleteConfirm}
        // Assuming there is a loading prop or we just let it close
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 16, marginTop: 16 },
  title: { fontSize: 24, color: DEFAULT_COLORS.white, marginBottom: 8 },
  sectionTitle: { fontSize: 18, color: DEFAULT_COLORS.white, marginTop: 8 },
  subSectionTitle: { fontSize: 16, color: DEFAULT_COLORS.white, marginTop: 8 },
  
  calendarContainer: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 16 },
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

  sessionCard: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 16, alignItems: "center" },
  sessionDateBox: { width: 100, borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.2)", paddingRight: 16, alignItems: "center" },
  sessionDateText: { fontSize: 14, color: DEFAULT_COLORS.white },
  sessionContentBox: { flex: 1, paddingLeft: 16 },
  sessionTitleText: { fontSize: 14, color: DEFAULT_COLORS.white, fontWeight: "bold" },
  sessionLocationText: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  sessionActionsBox: { flexDirection: "row", gap: 12, paddingLeft: 16 }
});
