import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";

interface CampaignDescriptionSectionProps {
  campaign: ICampaign;
}

export function CampaignDescriptionSection({ campaign }: CampaignDescriptionSectionProps) {
  return (
    <View style={styles.module}>
      <ThemedText style={styles.moduleTitle}>Descrição</ThemedText>
      <ThemedText style={styles.description}>
        {campaign.description || "Sem descrição."}
      </ThemedText>
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
  description: {
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
  },
});
