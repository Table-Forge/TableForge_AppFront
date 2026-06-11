import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { CampaignItem } from "@/src/components/campaign-item/campaign-item";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import {
  CAMPAIGNS_PAGE_SIZE,
  useInfiniteCampaigns,
} from "@/src/features/campaigns/hooks/use-infinite-campaigns";
import { useInfinitePlayerCampaigns } from "@/src/features/campaigns/hooks/use-infinite-player-campaigns";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface IProps {
  userId?: number;
}

export const CampaignsTab = ({ userId: userIdProp }: IProps = {}) => {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id ? Number(user.id) : undefined;
  const targetUserId = userIdProp ?? currentUserId;
  const isCurrentUser = !userIdProp || userIdProp === currentUserId;

  const playerQuery = useInfinitePlayerCampaigns({
    size: CAMPAIGNS_PAGE_SIZE,
    filter: ["Creator", "Member"],
    enabled: isCurrentUser && Boolean(currentUserId),
  });

  const creatorQuery = useInfiniteCampaigns({
    size: CAMPAIGNS_PAGE_SIZE,
    creatorId: targetUserId,
    enabled: !isCurrentUser && Boolean(targetUserId),
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = isCurrentUser ? playerQuery : creatorQuery;

  const campaigns = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const filteredItems = data?.pages[0]?.pagination?.filteredItems ?? 0;

  return (
    <>
      <View style={styles.titleWrapper}>
        <View>
          <ThemedText style={styles.sectionTitle}>Campanhas</ThemedText>
          <ThemedText style={styles.counterText}>
            {campaigns.length}/{filteredItems}
          </ThemedText>
        </View>

        {isCurrentUser && (
          <ActionButton
            variant="pill"
            label="Criar"
            active
            icon={<Entypo name="plus" size={20} color={DEFAULT_COLORS.white} />}
            onPress={() => router.push("/campaign/create")}
          />
        )}
      </View>

      {isLoading ? (
        <View style={styles.feedbackWrapper}>
          <ActivityIndicator color={DEFAULT_COLORS.purpleBright} size="small" />
          <ThemedText style={styles.feedbackText}>
            Carregando campanhas...
          </ThemedText>
        </View>
      ) : campaigns.length ? (
        <View style={styles.listWrapper}>
          {campaigns.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <CampaignItem data={item} />
            </View>
          ))}

          {hasNextPage ? (
            <Button
              variant="tertiary"
              size="sm"
              text="Carregar mais"
              onPress={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.feedbackWrapper}>
          <ThemedText style={styles.feedbackText}>
            {isError
              ? "Não foi possível carregar as campanhas."
              : isCurrentUser
                ? "Você ainda não criou campanhas."
                : "Esse aventureiro ainda não criou campanhas."}
          </ThemedText>
        </View>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  counterText: {
    color: DEFAULT_COLORS.textMuted,
    marginTop: 2,
    fontSize: 12,
  },
  listWrapper: {
    width: "100%",
  },
  itemWrapper: {
    marginBottom: 10,
  },
  feedbackWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    borderRadius: RADII.lg,
    padding: 18,
    alignItems: "center",
    gap: 12,
    backgroundColor: SURFACES.fill,
  },
  feedbackText: {
    color: DEFAULT_COLORS.textMuted,
    textAlign: "center",
  },
});
