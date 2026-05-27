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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../themed-text/themed-text";
import { ICampaignItemProps } from "./campaign-item.types";

export const CampaignItemTinder = ({
  data,
  cardColor = DEFAULT_COLORS.primary,
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
      <View style={styles.tinderImageWrapper}>
        {bannerUrl ? (
          <Image style={styles.tinderImage} source={{ uri: bannerUrl }} />
        ) : (
          <View style={styles.tinderImagePlaceholder} />
        )}

        <View style={styles.tinderImageDim} />
        <View style={styles.difficultyBadge}>
          <MaterialCommunityIcons
            name="sword-cross"
            size={14}
            color={DEFAULT_COLORS.white}
          />
          <ThemedText style={styles.difficultyBadgeText} numberOfLines={1}>
            {difficulty}
          </ThemedText>
        </View>
        <View style={styles.bookmarkButton}>
          <FontAwesome5
            name="bookmark"
            size={22}
            color={DEFAULT_COLORS.white}
          />
        </View>
      </View>

      <View style={styles.tinderBody}>
        <ThemedText style={styles.tinderEyebrow}>Campanha</ThemedText>
        <ThemedText
          weight="bold"
          numberOfLines={2}
          style={styles.tinderTitleText}
        >
          {data.title}
        </ThemedText>

        <Pressable
          style={({ pressed }) => [
            styles.tinderMasterRow,
            pressed && { opacity: 0.75 },
          ]}
          onPress={openMasterProfile}
        >
          <View style={styles.masterAvatar}>
            <SwordDiceIcon size={18} color={DEFAULT_COLORS.tertiary} />
          </View>
          <ThemedText style={styles.tinderMasterText}>
            por {gameMaster}
          </ThemedText>
        </Pressable>

        <View style={styles.tinderDivider} />

        <ThemedText
          fontSize={14}
          numberOfLines={2}
          style={styles.tinderSummaryText}
        >
          {summary}
        </ThemedText>

        <View style={styles.tinderStats}>
          <CampaignStat icon="location-dot" text={location} />
          <CampaignStat icon="cloud-bolt" text={system} />
          <CampaignStat icon="users" text={`${partySize} vagas`} />
        </View>
      </View>
    </Pressable>
  );
};

const CampaignStat = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.tinderStatItem}>
    <FontAwesome6 name={icon} size={20} color={DEFAULT_COLORS.purple} />
    <ThemedText style={styles.tinderStatText} numberOfLines={1}>
      {text}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 28,
    elevation: 7,
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    overflow: "hidden",
    height: "100%",
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white_08,
    backgroundColor: DEFAULT_COLORS.cardDark,
  },
  tinderImageWrapper: {
    height: "45%",
    minHeight: 236,
    position: "relative",
    backgroundColor: DEFAULT_COLORS.cardImageDark,
  },
  tinderImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  tinderImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: DEFAULT_COLORS.background,
  },
  tinderImageDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DEFAULT_COLORS.black_14,
  },
  difficultyBadge: {
    position: "absolute",
    top: 22,
    left: 22,
    maxWidth: "62%",
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary,
    backgroundColor: DEFAULT_COLORS.tertiary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookmarkButton: {
    position: "absolute",
    top: 20,
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white_16,
    backgroundColor: DEFAULT_COLORS.primary_58,
  },
  difficultyBadgeText: {
    color: DEFAULT_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  tinderBody: {
    flex: 1,
    marginTop: -28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: "flex-start",
    gap: 12,
    borderTopLeftRadius: 42,
    backgroundColor: DEFAULT_COLORS.cardDarkAlt,
  },
  tinderEyebrow: {
    color: DEFAULT_COLORS.purple,
    fontSize: 13,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  tinderTitleText: {
    fontSize: 29,
    lineHeight: 34,
    color: DEFAULT_COLORS.white,
    marginTop: 8,
  },
  tinderMasterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  masterAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.white_12,
  },
  tinderMasterText: {
    color: DEFAULT_COLORS.white_64,
    fontSize: 15,
  },
  tinderDivider: {
    height: 1,
    marginVertical: 4,
    backgroundColor: DEFAULT_COLORS.white_12,
  },
  tinderSummaryText: {
    color: DEFAULT_COLORS.white_68,
    lineHeight: 22,
  },
  tinderStats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  tinderStatItem: {
    flex: 1,
    minHeight: 64,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white_08,
    backgroundColor: DEFAULT_COLORS.white_06,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  tinderStatText: {
    color: DEFAULT_COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
  },
});
