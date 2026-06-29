import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";

import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import {
  PLAYER_CAMPAIGNS_PAGE_SIZE,
  useInfinitePlayerCampaigns,
} from "@/src/features/campaigns/hooks/use-infinite-player-campaigns";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import {
  CONVERSATIONS_PAGE_SIZE,
  useInfiniteConversations,
} from "@/src/features/conversations/hooks/use-infinite-conversations";
import { IConversation } from "@/src/features/conversations/schemas/conversation.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
import { NewDirectChatModal } from "@/src/components/modals/new-direct-chat-modal/new-direct-chat-modal";

export default function Messages() {
  const router = useRouter();
  const [isNewChatOpen, setNewChatOpen] = useState(false);
  
  const {
    data: campData,
    isLoading: isLoadingCamp,
    refetch: refetchCamp,
    fetchNextPage: fetchNextCampPage,
    hasNextPage: hasNextCampPage,
  } = useInfinitePlayerCampaigns({
    size: PLAYER_CAMPAIGNS_PAGE_SIZE,
    filter: ["Creator", "Member"],
  });

  const {
    data: convData,
    isLoading: isLoadingConv,
    refetch: refetchConv,
    fetchNextPage: fetchNextConvPage,
    hasNextPage: hasNextConvPage,
  } = useInfiniteConversations({ size: CONVERSATIONS_PAGE_SIZE });

  const chatCampaigns = useMemo(
    () =>
      (campData?.pages.flatMap((page) => page.items) ?? []).filter(
        (campaign) => campaign.isChatEnabled,
      ),
    [campData?.pages],
  );

  const directConversations = useMemo(
    () => convData?.pages.flatMap((page) => page.items) ?? [],
    [convData?.pages],
  );

  const handleEndReached = () => {
    if (hasNextCampPage) fetchNextCampPage();
    if (hasNextConvPage) fetchNextConvPage();
  };

  const handleRefresh = () => {
    refetchCamp();
    refetchConv();
  };

  const summaryCount = chatCampaigns.length + directConversations.length;
  const summary =
    summaryCount > 0
      ? `${summaryCount} chat${summaryCount === 1 ? "" : "s"} ativo${summaryCount === 1 ? "" : "s"}`
      : "Sem conversas ativas";

  const sections: any[] = [];
  
  if (directConversations.length > 0 || isLoadingConv) {
    sections.push({
      title: "Cartas Diretas",
      data: directConversations,
      type: "direct" as const,
    });
  }
  
  if (chatCampaigns.length > 0 || isLoadingCamp) {
    sections.push({
      title: "Tavernas abertas",
      data: chatCampaigns,
      type: "campaign" as const,
    });
  }

  return (
    <>
      <Screen style={styles.screen}>
        <Screen.Header style={styles.topWrapper}>
          <View style={styles.titleWrapper}>
            <ThemedText weight="bold" style={styles.eyebrow}>
              Guilda
            </ThemedText>
            <View style={styles.titleRow}>
              <FontAwesome6
                name="comments"
                size={16}
                color={DEFAULT_COLORS.secondary}
                style={styles.titleIcon}
              />
              <ThemedText weight="bold" style={styles.titleValue}>
                {summary}
              </ThemedText>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => setNewChatOpen(true)}
          >
            <FontAwesome6 name="plus" size={16} color={DEFAULT_COLORS.white} />
          </TouchableOpacity>
        </Screen.Header>

        <Screen.Body>
          <SectionList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            sections={sections}
            keyExtractor={(item) => String((item as any).id)}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <ThemedText weight="bold" style={styles.sectionTitle}>
                  {title}
                </ThemedText>
                <View style={styles.sectionLine} />
              </View>
            )}
            renderItem={({ item, section }) => {
              if (section.type === "campaign") {
                const campaign = item as ICampaign;
                return (
                  <CampaignChatItem
                    item={campaign}
                    onPress={() =>
                      router.push({
                        pathname: "/campaign-chat/[campaignId]",
                        params: { campaignId: campaign.id },
                      })
                    }
                  />
                );
              } else {
                const conv = item as IConversation;
                return (
                  <DirectChatItem
                    item={conv}
                    onPress={() =>
                      router.push({
                        pathname: "/direct-chat/[conversationId]",
                        params: { conversationId: conv.id, title: conv.name || "Usuário" },
                      })
                    }
                  />
                );
              }
            }}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              !(isLoadingCamp || isLoadingConv) ? (
                <View style={styles.emptyWrapper}>
                  <ThemedText style={styles.emptyText}>
                    Nenhum chat disponível por aqui.
                  </ThemedText>
                </View>
              ) : null
            }
            refreshing={isLoadingCamp || isLoadingConv}
            onRefresh={handleRefresh}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.4}
          />
        </Screen.Body>
      </Screen>

      <NewDirectChatModal
        visible={isNewChatOpen}
        onClose={() => setNewChatOpen(false)}
      />
    </>
  );
}

const CampaignChatItem = ({
  item,
  onPress,
}: {
  item: ICampaign;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.messageCard}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <View style={styles.avatarContainer}>
      <FontAwesome5
        name="dice-d20"
        size={22}
        color={DEFAULT_COLORS.purpleBright}
      />
    </View>

    <View style={styles.content}>
      <ThemedText style={styles.eyebrowSmall}>Taverna</ThemedText>
      <View style={styles.headerRow}>
        <ThemedText weight="bold" style={styles.campaignTitle} numberOfLines={1}>
          {item.title}
        </ThemedText>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={DEFAULT_COLORS.textMuted}
        />
      </View>
      <ThemedText style={styles.lastMessage} numberOfLines={1}>
        {item.creatorUsername
          ? `Mesa de ${item.creatorUsername}`
          : "Chat da campanha"}
      </ThemedText>
    </View>
  </TouchableOpacity>
);

const DirectChatItem = ({
  item,
  onPress,
}: {
  item: IConversation;
  onPress: () => void;
}) => {

  const unreadCount = item.unreadMessagesCount || 0;

  return (
    <TouchableOpacity
      style={styles.messageCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <FontAwesome5
          name="scroll"
          size={20}
          color={DEFAULT_COLORS.secondary}
        />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.eyebrowSmall}>Carta</ThemedText>
        <View style={styles.headerRow}>
          <ThemedText weight="bold" style={styles.campaignTitle} numberOfLines={1}>
            {item.name || "Usuário"}
          </ThemedText>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadBadgeText}>{unreadCount}</ThemedText>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color={DEFAULT_COLORS.textMuted}
          />
        </View>
        <ThemedText style={[styles.lastMessage, unreadCount > 0 && styles.lastMessageUnread]} numberOfLines={1}>
          {item.lastMessageContent || "Nenhuma mensagem"}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DEFAULT_COLORS.background,
  },
  topWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  eyebrow: {
    fontSize: 11,
    color: DEFAULT_COLORS.grays?._200 || DEFAULT_COLORS.white_65,
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titleIcon: {
    textShadowColor: DEFAULT_COLORS.secondary_50,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleValue: {
    fontSize: 18,
    color: DEFAULT_COLORS.white,
  },
  newChatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DEFAULT_COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.soft,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 14,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: DEFAULT_COLORS.tertiary_20,
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    flexGrow: 1,
    gap: 10,
  },
  messageCard: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
    marginBottom: 10, // Added for SectionList items gap
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: RADII.md,
    backgroundColor: SURFACES.fill,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  eyebrowSmall: {
    fontSize: 10,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  campaignTitle: {
    fontSize: 15,
    color: DEFAULT_COLORS.white,
    flex: 1,
    marginRight: 10,
  },
  lastMessage: {
    fontSize: 13,
    color: DEFAULT_COLORS.textMuted,
    lineHeight: 18,
  },
  lastMessageUnread: {
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  unreadBadge: {
    backgroundColor: DEFAULT_COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  unreadBadgeText: {
    color: DEFAULT_COLORS.white,
    fontSize: 10,
    ...fonts.bold,
  },
  emptyWrapper: {
    marginTop: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white_10,
    borderRadius: 12,
    padding: 18,
    backgroundColor: DEFAULT_COLORS.primary_45,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: DEFAULT_COLORS.grays?._200 || DEFAULT_COLORS.white_70,
    textAlign: "center",
  },
});
