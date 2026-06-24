import { SwordDiceIcon } from "@/src/components/icons";
import { useAuth } from "@/src/context/auth";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Tag } from "../tag/tag";
import { ThemedText } from "../themed-text/themed-text";
import { ICampaignItemProps } from "./campaign-item.types";
import { useCampaignDifficultyLevelEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-difficulty-level-enum";

export const CampaignItemList = ({
  data,
  cardColor,
  tagColor = DEFAULT_COLORS.purpleBright,
}: ICampaignItemProps) => {
  const { difficultyLevelEnum } = useCampaignDifficultyLevelEnum();

  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id ? Number(user.id) : undefined;
  const isOwner = currentUserId === data.creatorId;
  const bannerUrl = data.bannerUrl || "";
  const gameMaster = data.creatorUsername || "Mestre Desconhecido";
  const location = data.locationName || data.address || "-";
  const system = data.gameSystemName || `Sistema ${data.gameSystemId}`;
  const partySize = `0/${data.playersLimit}`;
  const difficulty = data.difficulty
    ? difficultyLevelEnum.find((item) => item.value === data.difficulty)?.name
    : "-";
  const summary = data.description || "Sem sinopse cadastrada.";

  const openCampaign = () =>
    router.push({
      pathname: "/campaign/[id]",
      params: { id: data.id.toString() },
    });

  const openMasterProfile = (event: GestureResponderEvent) => {
    event.stopPropagation();
    router.push({
      pathname: "/user/[id]",
      params: { id: data.creatorId.toString() },
    } as any);
  };

  const openSettings = (event: GestureResponderEvent) => {
    event.stopPropagation();
    router.push({
      pathname: "/campaign/[id]/settings",
      params: { id: data.id.toString() },
    } as any);
  };

  return (
    <Pressable
      onPress={openCampaign}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 },
        cardColor ? { backgroundColor: cardColor } : null,
      ]}
    >
      <View style={styles.headerList}>
        <View style={styles.listTitleBlock}>
          <ThemedText style={styles.eyebrow}>Campanha</ThemedText>
          <ThemedText
            weight="bold"
            style={styles.listTitleText}
            numberOfLines={2}
          >
            {data.title}
          </ThemedText>

          <Pressable
            disabled={isOwner}
            style={({ pressed }) => [
              styles.masterRow,
              pressed && !isOwner && { opacity: 0.75 },
            ]}
            onPress={openMasterProfile}
          >
            <View style={styles.masterAvatar}>
              <SwordDiceIcon size={16} color={DEFAULT_COLORS.purpleBright} />
            </View>
            <ThemedText style={styles.masterText}>
              Mestre {gameMaster}
            </ThemedText>
          </Pressable>
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.listDifficultyBadge}>
            <MaterialCommunityIcons
              name="sword-cross"
              size={13}
              color={DEFAULT_COLORS.white}
            />
            <ThemedText style={styles.difficultyBadgeText} numberOfLines={1}>
              {difficulty}
            </ThemedText>
          </View>
          {isOwner && (
            <Pressable
              onPress={openSettings}
              hitSlop={6}
              style={({ pressed }) => [
                styles.editButton,
                pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={DEFAULT_COLORS.white}
              />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomWrapper}>
        <View style={styles.imageWrapper}>
          {bannerUrl ? (
            <Image style={styles.image} source={{ uri: bannerUrl }} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        <View style={styles.contentWrapper}>
          <ThemedText
            fontSize={13}
            numberOfLines={2}
            style={styles.summaryText}
          >
            {summary}
          </ThemedText>

          <View style={styles.tags}>
            <Tag
              icon={() => (
                <FontAwesome6 name="location-dot" size={11} color={tagColor} />
              )}
              text={location}
            />
            <Tag
              icon={() => (
                <FontAwesome5 name="book-reader" size={11} color={tagColor} />
              )}
              text={system}
            />
            <Tag
              icon={() => (
                <Fontisto name="persons" size={11} color={tagColor} />
              )}
              text={partySize}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: RADII.lg,
    overflow: "hidden",
    flexDirection: "column",
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    backgroundColor: SURFACES.card,
    ...SHADOWS.card,
  },
  headerList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  listTitleBlock: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  listTitleText: {
    fontSize: 18,
    color: DEFAULT_COLORS.white,
    lineHeight: 22,
  },
  masterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  masterAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.white_12,
  },
  masterText: {
    fontSize: 12,
    color: DEFAULT_COLORS.white_64,
  },
  rightColumn: {
    alignItems: "flex-end",
    gap: 8,
  },
  listDifficultyBadge: {
    maxWidth: 120,
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    backgroundColor: DEFAULT_COLORS.orange,
    borderWidth: 1,
    borderColor: BORDERS.cta,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: RADII.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.primary_78,
    borderWidth: 1,
    borderColor: BORDERS.highlightStrong,
  },
  difficultyBadgeText: {
    color: DEFAULT_COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: BORDERS.divider,
  },
  bottomWrapper: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: 100,
    height: 116,
    borderRadius: RADII.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDERS.subtle,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: DEFAULT_COLORS.cardImageDark,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  summaryText: {
    color: DEFAULT_COLORS.white_68,
    lineHeight: 19,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
});
