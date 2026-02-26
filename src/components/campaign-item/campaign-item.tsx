import { ICampaign } from "@/src/interfaces";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Image, Pressable, View, StyleSheet } from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";

import { useRouter } from "expo-router";
import { Tag } from "../tag/tag";
import { ThemedText } from "../themed-text/themed-text";

interface IProps {
  data: ICampaign;
  cardColor?: string;
  tagColor?: string;
}
export const CampaignItem = ({
  data,
  cardColor = DEFAULT_COLORS.primary,
  tagColor = "rgba(251, 69, 1, 0.4)",
}: IProps) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/campaign/[id]",
          params: { id: data.id.toString() },
        })
      }
      style={({ pressed }) => [
        styles.wrapper,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
        { backgroundColor: cardColor },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <ThemedText
            weight="bold"
            style={{ fontSize: 18, color: DEFAULT_COLORS.white }}
          >
            {data.title}
          </ThemedText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <FontAwesome6
              name="crown"
              size={10}
              color={DEFAULT_COLORS.tertiary}
            />
            <ThemedText
              style={{
                fontSize: 12,
                color: DEFAULT_COLORS.white,
                opacity: 0.6,
              }}
            >
              por {data.gameMaster || "Mestre Desconhecido"}
            </ThemedText>
          </View>
        </View>

        {/* status */}
        {/* <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: DEFAULT_COLORS.tertiary,
          }}
        /> */}
      </View>

      <View style={styles.bottomWrapper}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={{ uri: data.image }} />
        </View>

        <View style={styles.contentWrapper}>
          <ThemedText
            fontSize={13}
            numberOfLines={2}
            style={{ opacity: 0.8, color: DEFAULT_COLORS.white }}
          >
            {data.summary}
          </ThemedText>

          <View style={styles.tags}>
            <Tag
              icon={() => (
                <FontAwesome6 name="location-dot" size={12} color={tagColor} />
              )}
              text={data.location}
            />
            <Tag
              icon={() => (
                <FontAwesome5 name="book-reader" size={12} color={tagColor} />
              )}
              text={data.system}
            />
            <Tag
              icon={() => (
                <Fontisto name="persons" size={12} color={tagColor} />
              )}
              text={`${data.currentPartySize}/${data.maxPartySize}`}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    width: "100%",
    marginBottom: 10,

    borderLeftWidth: 4,
    borderLeftColor: DEFAULT_COLORS.tertiary,

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 10,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(251, 69, 1, 0.4)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  tags: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
});
