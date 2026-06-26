import React, { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";

import { formatDate } from "@/src/utils/format";

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
  onDeleteAnnouncement: (announcement: ICampaignAnnouncement) => void;
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
  onDeleteAnnouncement,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}: HomeTabProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<ICampaignAnnouncement | null>(null);

  const renderRightActions = (announcement: ICampaignAnnouncement) => {
    return (
      <View style={styles.swipeActionsContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.swipeActionBtn, styles.deleteActionBtn]}
          onPress={() => onDeleteAnnouncement(announcement)}
        >
          <FontAwesome5 name="trash" size={16} color={DEFAULT_COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

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
            announcements.map((announcement) => {
              const card = (
                <Pressable
                  onPress={() => setSelectedAnnouncement(announcement)}
                  style={({ pressed }) => [
                    pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
                  ]}
                >
                  <AnnouncementCard
                    title={announcement.title}
                    content={announcement.content}
                    date={announcement.date}
                    style={isMaster && styles.announcementCardNormal}
                  />
                </Pressable>
              );

              if (isMaster) {
                return (
                  <Swipeable
                    key={announcement.id}
                    renderRightActions={() => renderRightActions(announcement)}
                    containerStyle={styles.swipeContainer}
                  >
                    {card}
                  </Swipeable>
                );
              }

              return (
                <View key={announcement.id} style={{ marginBottom: 12 }}>
                  {card}
                </View>
              );
            })
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
        eyebrow="Comunicado"
        cancelText="Fechar"
        showFooter={true}
      >
        {selectedAnnouncement && (
          <View style={styles.modalContentContainer}>
            <ThemedText style={styles.modalDateText}>
              Publicado em {formatDate(selectedAnnouncement.date, true)}
            </ThemedText>
            <ThemedText style={styles.modalBodyText}>
              {selectedAnnouncement.content}
            </ThemedText>
          </View>
        )}
      </ModalBase>
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

const AnnouncementCard = ({
  title,
  content,
  date,
  style,
}: {
  title: string;
  content: string;
  date: string;
  style?: any;
}) => {
  const formattedDate = formatDate(date, true);
  return (
    <View style={[styles.announcementCard, style]}>
      <View style={styles.announcementHeader}>
        <View style={styles.announcementBadge}>
          <FontAwesome5 name="bullhorn" size={10} color={DEFAULT_COLORS.purpleBright} />
          <ThemedText style={styles.announcementBadgeText}>Comunicado</ThemedText>
        </View>
        <ThemedText style={styles.announcementDate}>
          {formattedDate}
        </ThemedText>
      </View>

      <ThemedText weight="bold" style={styles.announcementTitle}>
        {title}
      </ThemedText>

      <ThemedText style={styles.announcementDescription} numberOfLines={3}>
        {content}
      </ThemedText>

      <View style={styles.announcementFooter}>
        <ThemedText style={styles.readMoreText}>Ler completo</ThemedText>
        <FontAwesome6 name="arrow-right" size={10} color={DEFAULT_COLORS.purpleBright} />
      </View>
    </View>
  );
};

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
  announcementCard: {
    backgroundColor: SURFACES.fill,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: BORDERS.subtle,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  announcementBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(155, 114, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  announcementBadgeText: {
    fontSize: 10,
    color: DEFAULT_COLORS.purpleBright,
    ...fonts.bold,
    textTransform: "uppercase",
  },
  announcementDate: {
    fontSize: 11,
    color: DEFAULT_COLORS.textMuted,
  },
  announcementTitle: {
    fontSize: 16,
    color: DEFAULT_COLORS.white,
    lineHeight: 22,
  },
  announcementDescription: {
    fontSize: 13,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 18,
  },
  announcementFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    ...fonts.bold,
  },
  modalContentContainer: {
    gap: 12,
    marginTop: 8,
  },
  modalDateText: {
    fontSize: 12,
    color: DEFAULT_COLORS.textMuted,
    ...fonts.bold,
  },
  modalBodyText: {
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 14,
    color: DEFAULT_COLORS.textMuted,
  },
  loadMoreContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  swipeContainer: {
    marginBottom: 12,
  },
  swipeActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  swipeActionBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
    borderRadius: RADII.md,
  },
  deleteActionBtn: {
    backgroundColor: "#ef4444",
  },
  announcementCardNormal: {
    marginBottom: 0,
  },
});
