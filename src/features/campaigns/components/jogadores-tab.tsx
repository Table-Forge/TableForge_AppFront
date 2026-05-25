import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/src/components/themed-text/themed-text';
import { ICampaign } from '@/src/features/campaigns/schemas/campaign.schema';
import { ICampaignMember } from '@/src/features/campaign-members/schemas/campaign-member.schema';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { DEFAULT_COLORS } from '@/src/theme/colors';

const { width } = Dimensions.get('window');

export function JogadoresTab({ campaign, members }: { campaign: ICampaign, members: ICampaignMember[] }) {
  const players = members.filter(m => m.role === 'Player' || m.role === 'Master'); // Or just players if master is excluded?
  const playersLimit = campaign.playersLimit || 5;

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
        <ThemedText style={styles.sectionTitle}>Jogadores</ThemedText>
        <ThemedText style={styles.playerCount}>{players.length}/{playersLimit}</ThemedText>
      </View>

      <View style={styles.grid}>
        {players.map((member) => (
          <View key={member.id} style={styles.card}>
             <View style={styles.cardImagePlaceholder}>
                {member.characterImageUrl && (
                   // Normally an Image component here, using View placeholder
                   <View style={{width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.1)'}} />
                )}
             </View>
             <View style={styles.cardContent}>
                <ThemedText weight="bold" style={styles.charName}>{member.characterName || member.username || 'Desconhecido'}</ThemedText>
                {member.className && <ThemedText style={styles.charDetails}>{member.className}</ThemedText>}
                {member.raceName && <ThemedText style={styles.charDetails}>{member.raceName}</ThemedText>}
             </View>
          </View>
        ))}
      </View>
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
  playerCount: { fontSize: 18, color: DEFAULT_COLORS.white },
  description: { fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: (width - 40 - 16) / 2, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden", marginBottom: 16 },
  cardImagePlaceholder: { width: "100%", height: 120, backgroundColor: "rgba(255,255,255,0.1)" },
  cardContent: { padding: 12, alignItems: "center" },
  charName: { fontSize: 16, color: DEFAULT_COLORS.white, marginBottom: 4 },
  charDetails: { fontSize: 12, color: "rgba(255,255,255,0.7)" }
});
