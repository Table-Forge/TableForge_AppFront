import { ActionButton } from "@/src/components/action-button/action-button";
import { CampaignItem } from "@/src/components/campaign-item/campaign-item";
import { MainContainer } from "@/src/components/main-container/main-container";
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
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

export default function Campaigns() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
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
  } = useInfiniteCampaigns({ size: CAMPAIGNS_PAGE_SIZE });

  const campaigns = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const locationString = `${location?.city || ""}${
    location?.city && location?.region ? ", " : ""
  }${location?.region || ""}`;

  const carouselWidth = SCREEN_WIDTH - 40;
  const carouselHeight = Math.min(560, Math.max(430, SCREEN_HEIGHT * 0.62));
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

  return (
    <MainContainer style={styles.container}>
      <View style={styles.topWrapper}>
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
      </View>

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
        <>
          <View style={styles.deckWrapper}>
            <Carousel
              width={carouselWidth}
              height={carouselHeight}
              data={campaigns}
              loop={false}
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

          <View style={styles.metaRow}>
            <ThemedText style={styles.swipeHint}>
              Deslize para esquerda ou direita
            </ThemedText>

            {isFetchingNextPage ? (
              <ThemedText style={styles.loadingMoreText}>
                Carregando mais...
              </ThemedText>
            ) : null}
          </View>
        </>
      ) : (
        <View style={styles.emptyWrapper}>
          <ThemedText style={styles.emptyText}>
            {isError
              ? "Nao foi possivel carregar campanhas"
              : "Nenhuma campanha disponivel"}
          </ThemedText>
        </View>
      )}
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: DEFAULT_COLORS.background,
  },
  topWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  locationWrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  locationLabel: {
    fontSize: 11,
    color: DEFAULT_COLORS.grays?._200 || "rgba(255,255,255,0.5)",
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
    textShadowColor: "rgba(126, 135, 226, 0.5)",
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
    backgroundColor: "rgba(26, 26, 46, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.3)",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
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
    backgroundColor: "rgba(251, 69, 1, 0.2)",
  },
  deckWrapper: {
    alignItems: "center",
  },
  cardSlot: {
    height: "100%",
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  metaRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 20,
  },
  swipeHint: {
    color: DEFAULT_COLORS.grays?._200 || "rgba(255,255,255,0.65)",
    fontSize: 12,
  },
  loadingMoreText: {
    color: DEFAULT_COLORS.tertiary,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyWrapper: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 18,
    backgroundColor: "rgba(26, 26, 46, 0.45)",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: DEFAULT_COLORS.grays?._200 || "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
});
