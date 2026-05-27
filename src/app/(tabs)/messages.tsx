import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useInfiniteCampaigns } from "@/src/features/campaigns/hooks/use-infinite-campaigns";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function Messages() {
  const router = useRouter();
  const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteCampaigns({
      size: 50,
    });

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

  return (
    <MainContainer>
      <HeaderActions>
        <ThemedText style={styles.headerTitle}>Mensagens</ThemedText>
        <View style={styles.headerSpacer} />
      </HeaderActions>

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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            Nenhum chat disponível por aqui.
          </ThemedText>
        }
        refreshing={isLoading}
        onRefresh={refetch}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
      />
    </MainContainer>
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
    activeOpacity={0.75}
    onPress={onPress}
  >
    <View style={styles.avatarContainer}>
      <FontAwesome5 name="dice-d20" size={20} color={DEFAULT_COLORS.tertiary} />
    </View>

    <View style={styles.content}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.campaignTitle} numberOfLines={1}>
          {item.title}
        </ThemedText>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={DEFAULT_COLORS.grays._400}
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
  headerTitle: {
    fontSize: 20,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  headerSpacer: {
    width: 45,
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageCard: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DEFAULT_COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary_30,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  campaignTitle: {
    ...fonts.bold,
    fontSize: 16,
    color: DEFAULT_COLORS.white,
    flex: 1,
    marginRight: 10,
  },
  lastMessage: {
    fontSize: 14,
    color: DEFAULT_COLORS.grays._300,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: DEFAULT_COLORS.white_05,
    width: "90%",
    alignSelf: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: DEFAULT_COLORS.grays._300,
  },
});
