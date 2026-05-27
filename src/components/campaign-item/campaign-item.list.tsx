import { SwordDiceIcon } from "@/src/components/icons";
import { DEFAULT_COLORS } from "@/src/theme/colors";
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

export const CampaignItemList = ({
  data,
  cardColor = DEFAULT_COLORS.primary,
  tagColor = DEFAULT_COLORS.tertiary_30,
}: ICampaignItemProps) => {
  const router = useRouter();
  const bannerUrl = data.bannerUrl || "";
  const gameMaster = data.creatorUsername || "Mestre Desconhecido";
  const location = data.locationName || data.address || "-";
  const system = data.gameSystemName || `Sistema ${data.gameSystemId}`;
  const partySize = `0/${data.playersLimit}`;
  const difficulty = data.difficulty || "-";
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

  return (
    <Pressable
      onPress={openCampaign}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 },
        { backgroundColor: cardColor },
      ]}
    >
      <View style={styles.headerList}>
        <View style={styles.listTitleBlock}>
          <ThemedText
            weight="bold"
            style={styles.listTitleText}
            numberOfLines={2}
          >
            {data.title}
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.masterRow,
              pressed && { opacity: 0.75 },
            ]}
            onPress={openMasterProfile}
          >
            <SwordDiceIcon size={24} color={DEFAULT_COLORS.tertiary} />
            <ThemedText style={styles.masterText}>por {gameMaster}</ThemedText>
          </Pressable>
        </View>
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
      </View>

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
                <FontAwesome6 name="location-dot" size={12} color={tagColor} />
              )}
              text={location}
            />
            <Tag
              icon={() => (
                <FontAwesome5 name="book-reader" size={12} color={tagColor} />
              )}
              text={system}
            />
            <Tag
              icon={() => (
                <Fontisto name="persons" size={12} color={tagColor} />
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
    borderRadius: 8,
    elevation: 7,
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    overflow: "hidden",
    flexDirection: "column",
    gap: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.secondary_18,
  },
  headerList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  listTitleBlock: {
    flex: 1,
  },
  listTitleText: {
    fontSize: 18,
    color: DEFAULT_COLORS.white,
    lineHeight: 22,
  },
  masterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  masterText: {
    fontSize: 12,
    color: DEFAULT_COLORS.white,
    opacity: 0.72,
  },
  listDifficultyBadge: {
    maxWidth: 120,
    minHeight: 30,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: DEFAULT_COLORS.tertiary,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  difficultyBadgeText: {
    color: DEFAULT_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  bottomWrapper: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: 112,
    height: 126,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: DEFAULT_COLORS.tertiary_30,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: DEFAULT_COLORS.primary,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
  },
  summaryText: {
    opacity: 0.78,
    color: DEFAULT_COLORS.white,
    lineHeight: 19,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
});
