import React from "react";
import { StyleSheet, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";

import { Button } from "@/src/components/button/button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignAnnouncement } from "@/src/features/campaign-announcements/schemas/campaign-announcement.schema";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { TOptions } from "@/src/interfaces";
import { DEFAULT_COLORS } from "@/src/theme/colors";

const BORDER_COLOR = DEFAULT_COLORS.tertiary_30;

interface HomeTabProps {
  announcements: ICampaignAnnouncement[];
  campaign: ICampaign;
  canSeePrivateModules: boolean;
  difficultyLevelEnum: TOptions[];
  isMaster: boolean;
  onCreateAnnouncement: () => void;
}

export function HomeTab({
  announcements,
  campaign,
  canSeePrivateModules,
  difficultyLevelEnum,
  isMaster,
  onCreateAnnouncement,
}: HomeTabProps) {
  const difficultyLabel =
    difficultyLevelEnum.find((opt) => opt.value === campaign.difficulty)
      ?.name || "-";

  return (
    <>
      <View style={styles.module}>
        <ThemedText style={styles.moduleTitle}>Descrição</ThemedText>
        <ThemedText style={styles.description}>
          {campaign.description || "Sem descrição."}
        </ThemedText>
      </View>

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
            value={`${campaign.playersLimit || 0} jogadores`}
          />
        </View>
      </View>

      {canSeePrivateModules && (
        <View style={styles.module}>
          <ModuleHeader
            title="Anúncios"
            actionText={isMaster ? "Criar" : undefined}
            onActionPress={isMaster ? onCreateAnnouncement : undefined}
          />
          {announcements.length ? (
            announcements.map((announcement) => (
              <InlineItem
                key={announcement.id}
                title={announcement.title}
                description={announcement.content}
              />
            ))
          ) : (
            <EmptyText text="Nenhum anúncio publicado." />
          )}
        </View>
      )}
    </>
  );
}

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
    <ThemedText style={[styles.moduleTitle]}>{title}</ThemedText>
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

const InlineItem = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <View style={styles.inlineItem}>
    <ThemedText weight="bold" style={styles.inlineTitle}>
      {title}
    </ThemedText>
    {!!description && (
      <ThemedText style={styles.inlineDescription} numberOfLines={2}>
        {description}
      </ThemedText>
    )}
  </View>
);

const EmptyText = ({ text }: { text: string }) => (
  <ThemedText style={styles.emptyText}>{text}</ThemedText>
);

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
      {icon && <View style={styles.iconContainer}>{icon(BORDER_COLOR)}</View>}
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    </View>
    <ThemedText weight="bold" style={styles.infoValue}>
      {value}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  module: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.1)",
    gap: 4,
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
    textTransform: "uppercase",
  },
  description: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsSecondRow: {
    marginTop: 15,
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
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 14,
  },
  inlineItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  inlineTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  inlineDescription: {
    marginTop: 3,
    fontSize: 13,
    color: "rgba(255,255,255,0.58)",
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
  },
});
