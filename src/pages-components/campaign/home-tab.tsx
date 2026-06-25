import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";

import { Button } from "@/src/components/button/button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { ICampaignAnnouncement } from "@/src/features/campaign-announcements/schemas/campaign-announcement.schema";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { TOptions } from "@/src/interfaces";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

const ICON_COLOR = DEFAULT_COLORS.purpleBright;

interface HomeTabProps {
  announcements: ICampaignAnnouncement[];
  campaign: ICampaign;
  canSeePrivateModules: boolean;
  difficultyLevelEnum: TOptions[];
  isMaster: boolean;
  onCreateAnnouncement: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
}

export function HomeTab({
  announcements,
  campaign,
  canSeePrivateModules,
  difficultyLevelEnum,
  isMaster,
  onCreateAnnouncement,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}: HomeTabProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<ICampaignAnnouncement | null>(null);

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
              <Pressable
                key={announcement.id}
                onPress={() => setSelectedAnnouncement(announcement)}
                style={({ pressed }) => [
                  pressed && { opacity: 0.7 },
                ]}
              >
                <InlineItem
                  title={announcement.title}
                  description={announcement.content}
                />
              </Pressable>
            ))
          ) : (
            <EmptyText text="Nenhum anúncio publicado." />
          )}
          {!!hasNextPage && !!onFetchNextPage && (
            <View style={styles.loadMoreContainer}>
              <Button
                size="sm"
                variant="secondary"
                text={isFetchingNextPage ? "Carregando..." : "Carregar mais"}
                isLoading={isFetchingNextPage}
                onPress={onFetchNextPage}
              />
            </View>
          )}
        </View>
      )}

      <ModalBase
        visible={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.title ?? ""}
        description={selectedAnnouncement?.content ?? ""}
        eyebrow="Comunicado"
        cancelText="Fechar"
        showFooter={true}
      />
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
    textTransform: "uppercase",
    ...fonts.bold,
  },
  description: {
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
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
  inlineItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDERS.divider,
  },
  inlineTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  inlineDescription: {
    marginTop: 3,
    fontSize: 13,
    color: DEFAULT_COLORS.white_64,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 14,
    color: DEFAULT_COLORS.textMuted,
  },
  loadMoreContainer: {
    marginTop: 12,
    alignItems: "center",
  },
});
