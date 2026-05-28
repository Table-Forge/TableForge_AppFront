import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import {
  CAMPAIGNS_PAGE_SIZE,
  useInfiniteCampaigns,
} from "@/src/features/campaigns/hooks/use-infinite-campaigns";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

export default function Messages() {
  const router = useRouter();
  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteCampaigns({ size: CAMPAIGNS_PAGE_SIZE });

  const chatCampaigns = useMemo(
    () =>
      (data?.pages.flatMap((page) => page.items) ?? []).filter(
        (campaign) => campaign.isChatEnabled,
      ),
    [data?.pages],
  );

  const handleEndReached = () => {
    if (!hasNextPage) return;

    fetchNextPage();
  };

  const summary =
    chatCampaigns.length > 0
      ? `${chatCampaigns.length} taverna${chatCampaigns.length === 1 ? "" : "s"} ativa${chatCampaigns.length === 1 ? "" : "s"}`
      : "Sem conversas ativas";

  return (
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
      </Screen.Header>

      <Screen.Body>
        <View style={styles.sectionHeader}>
          <ThemedText weight="bold" style={styles.sectionTitle}>
            Tavernas abertas
          </ThemedText>
          <View style={styles.sectionLine} />
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.list}
          data={chatCampaigns}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CampaignChatItem
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/campaign-chat/[campaignId]",
                  params: { campaignId: item.id },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <ThemedText style={styles.emptyText}>
                Nenhum chat disponível por aqui.
              </ThemedText>
            </View>
          }
          refreshing={isLoading}
          onRefresh={refetch}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
        />
      </Screen.Body>
    </Screen>
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
