import React from "react";
import { StyleSheet, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { TOptions } from "@/src/interfaces";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

const ICON_COLOR = DEFAULT_COLORS.purpleBright;

interface CampaignDetailsSectionProps {
  campaign: ICampaign;
  difficultyLevelEnum: TOptions[];
}

export function CampaignDetailsSection({ campaign, difficultyLevelEnum }: CampaignDetailsSectionProps) {
  const difficultyLabel =
    difficultyLevelEnum.find((opt) => opt.value === campaign.difficulty)
      ?.name || "-";

  return (
    <View style={styles.module}>
      <ThemedText style={styles.moduleTitle}>Detalhes da Party</ThemedText>
      <View style={styles.row}>
        <InfoItem
          icon={(color) => (
            <FontAwesome5 name="book-reader" size={14} color={color} />
          )}
          label="Sistema"
          value={
            campaign.gameSystemName ||
            (campaign.gameSystemId ? `Sistema ${campaign.gameSystemId}` : "-")
          }
        />
        <InfoItem
          icon={(color) => (
            <FontAwesome6 name="shield" size={14} color={color} />
          )}
          label="Nível"
          value={difficultyLabel}
        />
      </View>
      <View style={[styles.row, styles.detailsSecondRow]}>
        <InfoItem
          icon={(color) => (
            <FontAwesome6 name="location-dot" size={14} color={color} />
          )}
          label="Local"
          value={campaign.locationName || campaign.address || "-"}
        />
        <InfoItem
          icon={(color) => (
            <Fontisto name="persons" size={14} color={color} />
          )}
          label="Vagas"
          value={`${campaign.membersCount || 0}/${campaign.playersLimit || 0} jogadores`}
        />
      </View>
    </View>
  );
}

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon?: (color: string) => React.ReactNode;
  label: string;
  value: string;
}) => (
  <View style={styles.infoItem}>
    <View style={styles.infoHeader}>
      {icon && <View style={styles.iconContainer}>{icon(ICON_COLOR)}</View>}
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    </View>
    <ThemedText weight="bold" style={styles.infoValue}>
      {value}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  module: {
    padding: 18,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    gap: 6,
    ...SHADOWS.soft,
  },
  moduleTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsSecondRow: {
    marginTop: 16,
  },
  infoItem: {
    flex: 1,
    gap: 4,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: DEFAULT_COLORS.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
});
