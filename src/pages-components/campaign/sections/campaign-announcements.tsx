import React, { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import { formatDate } from "@/src/utils/format";
import { Button } from "@/src/components/button/button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { ICampaignAnnouncement } from "@/src/features/campaign-announcements/schemas/campaign-announcement.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface CampaignAnnouncementsSectionProps {
  announcements: ICampaignAnnouncement[];
  isMaster: boolean;
  onCreateAnnouncement: () => void;
  onEditAnnouncement?: (announcement: ICampaignAnnouncement) => void;
  onDeleteAnnouncement: (announcement: ICampaignAnnouncement) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
}

export function CampaignAnnouncementsSection({
  announcements,
  isMaster,
  onCreateAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}: CampaignAnnouncementsSectionProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<ICampaignAnnouncement | null>(null);

  const renderRightActions = (announcement: ICampaignAnnouncement) => {
    return (
      <View style={styles.swipeActionsContainer}>
        {onEditAnnouncement && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.swipeActionBtn, styles.editActionBtn]}
            onPress={() => onEditAnnouncement(announcement)}
          >
            <FontAwesome5 name="pen" size={14} color={DEFAULT_COLORS.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.swipeActionBtn, styles.deleteActionBtn]}
          onPress={() => onDeleteAnnouncement(announcement)}
        >
          <FontAwesome5 name="trash" size={14} color={DEFAULT_COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
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
    gap: 8,
    paddingHorizontal: 8,
    height: "100%",
  },
  swipeActionBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  deleteActionBtn: {
    backgroundColor: "#ef4444",
  },
  editActionBtn: {
    backgroundColor: DEFAULT_COLORS.purpleBright,
  },
  announcementCardNormal: {
    marginBottom: 0,
  },
});
