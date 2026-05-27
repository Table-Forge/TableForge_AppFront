import { ActionButton } from "@/src/components/action-button/action-button";
import { CampaignItem } from "@/src/components/campaign-item/campaign-item";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/src/constants/screen-size";
import {
  CAMPAIGNS_PAGE_SIZE,
  useInfiniteCampaigns,
} from "@/src/features/campaigns/hooks/use-infinite-campaigns";
import { useLocation } from "@/src/hooks/use-location";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

export default function Campaigns() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const { location, loading } = useLocation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteCampaigns({ size: CAMPAIGNS_PAGE_SIZE });

  const campaigns = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const locationString = `${location?.city || ""}${
    location?.city && location?.region ? ", " : ""
  }${location?.region || ""}`;

  const carouselWidth = SCREEN_WIDTH - 40;
  const carouselHeight = Math.min(620, Math.max(540, SCREEN_HEIGHT * 0.68));
  const hasCampaigns = campaigns.length > 0;

  useEffect(() => {
    if (activeIndex < campaigns.length) return;
    setActiveIndex(Math.max(campaigns.length - 1, 0));
  }, [activeIndex, campaigns.length]);

  const handleSnapToItem = useCallback(
    async (index: number) => {
      setActiveIndex(index);

      const lastLoadedCardIndex = campaigns.length - 1;
      const reachedLastLoadedCard = index >= lastLoadedCardIndex;

      if (!reachedLastLoadedCard) return;
      if (!hasNextPage || isFetchingNextPage) return;

      await fetchNextPage();
    },
    [campaigns.length, fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  const handleRefresh = useCallback(async () => {
    setActiveIndex(0);
    await refetch();
  }, [refetch]);

  return (
    <Screen style={styles.container}>
      <Screen.Header style={styles.topWrapper}>
        <View style={styles.locationWrapper}>
          <ThemedText weight="bold" style={styles.locationLabel}>
            Região rastreada
          </ThemedText>
          <View style={styles.locationTextContainer}>
            {loading ? (
              <ActivityIndicator color={DEFAULT_COLORS.tertiary} size="small" />
            ) : (
              <>
                <FontAwesome6
                  name="location-dot"
                  color={DEFAULT_COLORS.secondary}
                  size={16}
                  style={styles.locationIcon}
                />
                <ThemedText style={styles.locationValue} weight="bold">
                  {locationString || "Desconhecida"}
                </ThemedText>
              </>
            )}
          </View>
        </View>

        <View style={styles.headerActions}>
          <ActionButton
            variant="circle"
            icon={<Entypo name="plus" size={22} color={DEFAULT_COLORS.white} />}
            onPress={() => router.push("/campaign/create")}
            style={styles.headerButton}
          />
          <ActionButton
            variant="circle"
            icon={<Entypo name="bell" size={20} color={DEFAULT_COLORS.white} />}
            onPress={() => navigation.navigate("notifications")}
            style={styles.headerButton}
          />
        </View>
      </Screen.Header>

      <Screen.Body
        scroll
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={DEFAULT_COLORS.tertiary}
            colors={[DEFAULT_COLORS.tertiary]}
          />
        }
      >
        <View style={styles.listHeader}>
          <ThemedText weight="bold" style={styles.listTitle}>
            Mesas disponíveis
          </ThemedText>
          <View style={styles.listTitleLine} />
        </View>

        {isLoading && !hasCampaigns ? (
          <View style={styles.emptyWrapper}>
            <ActivityIndicator color={DEFAULT_COLORS.tertiary} size="large" />
            <ThemedText style={styles.emptyText}>
              Carregando campanhas...
            </ThemedText>
          </View>
        ) : hasCampaigns ? (
          <View style={styles.deckWrapper}>
            <Carousel
              width={carouselWidth}
              height={carouselHeight}
              data={campaigns}
              loop={true}
              mode="horizontal-stack"
              modeConfig={{
                showLength: 3,
                snapDirection: "left",
                stackInterval: 18,
                scaleInterval: 0.08,
                opacityInterval: 0.12,
                rotateZDeg: 8,
              }}
              onSnapToItem={handleSnapToItem}
              onConfigurePanGesture={(gesture) => {
                gesture.activeOffsetX([-10, 10]);
              }}
              renderItem={({ item }) => (
                <View style={styles.cardSlot}>
                  <CampaignItem data={item} variant="tinder" />
                </View>
              )}
            />
          </View>
        ) : (
          <View style={styles.emptyWrapper}>
            <ThemedText style={styles.emptyText}>
              {isError
                ? "Nao foi possivel carregar campanhas"
                : "Nenhuma campanha disponivel"}
            </ThemedText>
          </View>
        )}
      </Screen.Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 6,
  },
  locationWrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  locationLabel: {
    fontSize: 11,
    color: DEFAULT_COLORS.grays?._200 || DEFAULT_COLORS.white_65,
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  locationTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationIcon: {
    textShadowColor: DEFAULT_COLORS.secondary_50,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  locationValue: {
    fontSize: 18,
    color: DEFAULT_COLORS.white,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerButton: {
    backgroundColor: DEFAULT_COLORS.primary_80,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.secondary_30,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
    gap: 12,
  },
  listTitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  listTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: DEFAULT_COLORS.tertiary_20,
  },
  deckWrapper: {
    alignItems: "center",
  },
  cardSlot: {
    height: "100%",
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  emptyWrapper: {
    marginTop: 24,
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
