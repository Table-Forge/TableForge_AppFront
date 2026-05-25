import { SwordDiceIcon } from "@/src/components/icons";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";
import { Tag } from "../tag/tag";
import { ThemedText } from "../themed-text/themed-text";

interface IProps {
  data: ICampaign;
  cardColor?: string;
  tagColor?: string;
  variant?: "list" | "tinder";
}

export const CampaignItem = ({
  data,
  cardColor = DEFAULT_COLORS.primary,
  tagColor = DEFAULT_COLORS.tertiary_30,
  variant = "list",
}: IProps) => {
  const router = useRouter();
  const isTinder = variant === "tinder";
  const bannerUrl = data.bannerUrl || "";
  const description = data.description || "";
  const gameMaster = data.creatorUsername || "Mestre Desconhecido";
  const location = data.locationName || data.address || "-";
  const system = data.gameSystemName || `Sistema ${data.gameSystemId}`;
  const partySize = `0/${data.playersLimit}`;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/campaign/[id]",
          params: { id: data.id.toString() },
        })
      }
      style={({ pressed }) => [
        styles.wrapperBase,
        isTinder ? styles.wrapperTinder : styles.wrapperList,
        pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 },
        { backgroundColor: cardColor },
      ]}
    >
      {isTinder ? (
        <>
          <View style={styles.tinderImageWrapper}>
            {bannerUrl ? (
              <Image style={styles.tinderImage} source={{ uri: bannerUrl }} />
            ) : (
              <View style={styles.tinderImagePlaceholder} />
            )}

            <View style={styles.tinderImageDim} />
            <View style={styles.tinderImageBottomShade} />

            <View style={styles.tinderTitleBlock}>
              <ThemedText
                weight="bold"
                numberOfLines={2}
                style={styles.tinderTitleText}
              >
                {data.title}
              </ThemedText>

              <View style={styles.masterRow}>
                <SwordDiceIcon size={20} color={DEFAULT_COLORS.tertiary} />
                <ThemedText style={styles.masterText}>
                  por {gameMaster}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.tinderBody}>
            <ThemedText fontSize={14} numberOfLines={3} style={styles.summaryText}>
              {description}
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
                icon={() => <Fontisto name="persons" size={12} color={tagColor} />}
                text={partySize}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.headerList}>
            <View>
              <ThemedText weight="bold" style={styles.listTitleText}>
                {data.title}
              </ThemedText>

              <View style={styles.masterRow}>
                <SwordDiceIcon size={24} color={DEFAULT_COLORS.tertiary} />
                <ThemedText style={styles.masterText}>
                  por {gameMaster}
                </ThemedText>
              </View>
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
                {description}
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
        </>
      )}
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  wrapperBase: {
    width: "100%",
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    overflow: "hidden",
  },
  wrapperList: {
    flexDirection: "column",
    gap: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: DEFAULT_COLORS.tertiary,
  },
  wrapperTinder: {
    height: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitleText: {
    fontSize: 18,
    color: DEFAULT_COLORS.white,
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
  bottomWrapper: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: 100,
    height: 100,
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
    gap: 10,
    width: "100%",
  },
  summaryText: {
    opacity: 0.85,
    color: DEFAULT_COLORS.white,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tinderImageWrapper: {
    height: "64%",
    minHeight: 260,
    position: "relative",
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
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  tinderImageBottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  tinderTitleBlock: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
  },
  tinderTitleText: {
    fontSize: 24,
    lineHeight: 28,
    color: DEFAULT_COLORS.white,
  },
  tinderBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    justifyContent: "space-between",
    gap: 14,
    backgroundColor: "rgba(26, 26, 46, 0.98)",
  },
});
