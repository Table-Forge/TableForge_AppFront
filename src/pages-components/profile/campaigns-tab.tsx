import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { CampaignItem } from "@/src/components/campaign-item/campaign-item";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import {
  CAMPAIGNS_PAGE_SIZE,
  useInfiniteCampaigns,
} from "@/src/features/campaigns/hooks/use-infinite-campaigns";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const CampaignsTab = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : undefined;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCampaigns({
    size: CAMPAIGNS_PAGE_SIZE,
    creatorId: userId,
    enabled: Boolean(userId),
  });

  const campaigns = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const filteredItems = data?.pages[0]?.pagination?.filteredItems ?? 0;

  return (
    <>
      <View style={styles.titleWrapper}>
        <View>
          <ThemedText fontSize={16} weight="bold">
            Campanhas
          </ThemedText>

          <ThemedText style={styles.counterText}>
            {campaigns.length}/{filteredItems}
          </ThemedText>
        </View>

        <ActionButton
          variant="pill"
          label="Criar"
          icon={<Entypo name="plus" size={20} color={DEFAULT_COLORS.white} />}
          onPress={() => router.push("/campaign/create")}
          backgroundColor={DEFAULT_COLORS.tertiary}
        />
      </View>

      {isLoading ? (
        <View style={styles.feedbackWrapper}>
          <ActivityIndicator color={DEFAULT_COLORS.tertiary} size="small" />
          <ThemedText style={styles.feedbackText}>
            Carregando campanhas...
          </ThemedText>
        </View>
      ) : campaigns.length ? (
        <View style={styles.listWrapper}>
          {campaigns.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <CampaignItem data={item} cardColor={DEFAULT_COLORS.background} />
            </View>
          ))}

          {hasNextPage ? (
            <Button
              variant="tertiary"
              size="sm"
              text="CARREGAR MAIS"
              onPress={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.feedbackWrapper}>
          <ThemedText style={styles.feedbackText}>
            {isError
              ? "Não foi possível carregar suas campanhas."
              : "Você ainda não criou campanhas."}
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
  counterText: {
    color: DEFAULT_COLORS.grays._200,
    marginTop: 2,
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
    borderColor: "rgba(126, 135, 226, 0.2)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  feedbackText: {
    color: DEFAULT_COLORS.grays._200,
    textAlign: "center",
  },
});
