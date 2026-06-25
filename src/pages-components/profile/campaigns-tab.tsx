import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { CampaignItem } from "@/src/components/campaign-item/campaign-item";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { ICampaignPlayer } from "@/src/features/campaigns/schemas/campaign.schema";
import {
  CAMPAIGNS_PAGE_SIZE,
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

const CAMPAIGN_LIMIT = 2;

export const CampaignsTab = ({ userId: userIdProp }: IProps = {}) => {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id ? Number(user.id) : undefined;
  const targetUserId = userIdProp ?? currentUserId;
  const isCurrentUser = !userIdProp || userIdProp === currentUserId;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePlayerCampaigns({
    size: CAMPAIGNS_PAGE_SIZE,
    filter: ["Creator", "Member"],
    userId: targetUserId,
    enabled: Boolean(targetUserId),
  });

  const campaigns = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const { masterCampaigns, playerCampaigns } = useMemo(() => {
    const master: typeof campaigns = [];
    const player: typeof campaigns = [];

    campaigns.forEach((item) => {
      const isCreator = (item as ICampaignPlayer).userRelationship === "Creator";

      if (isCreator) {
        master.push(item);
      } else {
        player.push(item);
      }
    });

    return { masterCampaigns: master, playerCampaigns: player };
  }, [campaigns]);

  return (
    <>
      <View style={styles.titleWrapper}>
        <View>
          <ThemedText style={styles.sectionTitle}>Campanhas</ThemedText>
          <ThemedText style={styles.counterText}>
            {isCurrentUser
              ? `Mestre: ${masterCampaigns.length}/${CAMPAIGN_LIMIT} | Jogador: ${playerCampaigns.length}`
              : `Mestre: ${masterCampaigns.length} | Jogador: ${playerCampaigns.length}`}
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
          {masterCampaigns.length > 0 && (
            <View style={styles.sectionGroup}>
              <ThemedText style={styles.groupTitle}>Como Mestre</ThemedText>
              {masterCampaigns.map((item) => (
                <View key={item.id} style={styles.itemWrapper}>
                  <CampaignItem data={item} />
                </View>
              ))}
            </View>
          )}

          {playerCampaigns.length > 0 && (
            <View style={[styles.sectionGroup, masterCampaigns.length > 0 && { marginTop: 22 }]}>
              <ThemedText style={styles.groupTitle}>Como Jogador</ThemedText>
              {playerCampaigns.map((item) => (
                <View key={item.id} style={styles.itemWrapper}>
                  <CampaignItem data={item} />
                </View>
              ))}
            </View>
          )}

          {hasNextPage ? (
            <View style={{ marginTop: 14 }}>
              <Button
                variant="tertiary"
                size="sm"
                text="Carregar mais"
                onPress={() => {
                  fetchNextPage();
                }}
                isLoading={isFetchingNextPage}
              />
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.feedbackWrapper}>
          <ThemedText style={styles.feedbackText}>
            {isError
              ? "Não foi possível carregar as campanhas."
              : isCurrentUser
                ? "Você ainda não tem campanhas."
                : "Esse aventureiro ainda não tem campanhas."}
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
  sectionGroup: {
    width: "100%",
  },
  groupTitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.purpleBright,
    ...fonts.bold,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
