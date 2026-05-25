import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/src/components/themed-text/themed-text';
import { ICampaign } from '@/src/features/campaigns/schemas/campaign.schema';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { DEFAULT_COLORS } from '@/src/theme/colors';

export function InicioTab({ campaign, announcements, isMaster }: { campaign: ICampaign, announcements: any[], isMaster: boolean }) {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <ThemedText weight="bold" style={styles.title}>{campaign.title}</ThemedText>

      <View style={styles.pillsRow}>
        <View style={styles.pill}>
           <FontAwesome6 name="location-dot" size={12} color={DEFAULT_COLORS.white} />
           <ThemedText style={styles.pillText}>{campaign.locationName || campaign.address || "-"}</ThemedText>
        </View>
        <View style={styles.pill}>
           <FontAwesome5 name="book-reader" size={12} color={DEFAULT_COLORS.white} />
           <ThemedText style={styles.pillText}>{campaign.gameSystemName || "-"}</ThemedText>
        </View>
        <View style={styles.pill}>
           <FontAwesome6 name="shield" size={12} color={DEFAULT_COLORS.white} />
           <ThemedText style={styles.pillText}>{campaign.difficulty || "-"}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.sectionTitle}>História</ThemedText>
      <ThemedText style={styles.description}>{campaign.description || "Sem descrição."}</ThemedText>

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Tabuleiro de Anúncios</ThemedText>
        {isMaster && (
          <TouchableOpacity onPress={() => router.push({ pathname: "/campaign-announcement/create", params: { campaignId: campaign.id } })}>
            <View style={styles.iconButton}>
              <FontAwesome6 name="plus" size={16} color={DEFAULT_COLORS.background} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {announcements.length ? (
        <View style={styles.announcementCard}>
          <ThemedText weight="bold" style={styles.announcementTitle}>{announcements[0].title}</ThemedText>
          <ThemedText style={styles.announcementDesc} numberOfLines={3}>{announcements[0].content}</ThemedText>
          <ThemedText style={styles.announcementDate}>
            {new Date(announcements[0].createdAt || Date.now()).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}
          </ThemedText>
        </View>
      ) : (
        <ThemedText style={styles.description}>Nenhum anúncio publicado.</ThemedText>
      )}

      {announcements.length > 0 && (
         <TouchableOpacity onPress={() => router.push({ pathname: "/campaign-announcements/[campaignId]", params: { campaignId: campaign.id } } as any)}>
           <ThemedText weight="bold" style={styles.seeAll}>Ver todos</ThemedText>
         </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 16, marginTop: 16 },
  title: { fontSize: 24, color: DEFAULT_COLORS.white, marginBottom: 8 },
  pillsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  pill: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, gap: 6 },
  pillText: { fontSize: 12, color: DEFAULT_COLORS.white },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  sectionTitle: { fontSize: 18, color: DEFAULT_COLORS.white },
  description: { fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 20 },
  iconButton: { backgroundColor: "rgba(255,255,255,0.8)", width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  announcementCard: { backgroundColor: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 8, gap: 8 },
  announcementTitle: { fontSize: 16, color: DEFAULT_COLORS.white },
  announcementDesc: { fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 20 },
  announcementDate: { fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "right", marginTop: 8 },
  seeAll: { fontSize: 14, color: DEFAULT_COLORS.white, textAlign: "right", textDecorationLine: "underline" }
});
