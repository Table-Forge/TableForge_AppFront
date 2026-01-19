import { ICampaign } from "@/src/interfaces";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Image, Pressable, View } from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";

import { useRouter } from "expo-router";
import { Tag } from "../tag/tag";
import { ThemedText } from "../themed-text/themed-text";
import { styles } from "./campaign-item.styles";

const colors = DEFAULT_COLORS;

export const CampaignItem = ({ data }: { data: ICampaign }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/campaign/[id]",
          params: { id: data.id.toString() },
        })
      }
      style={({ pressed }) => [styles.wrapper, pressed && { opacity: 0.7 }]}
    >
      <ThemedText
        weight="bold"
        style={{ fontSize: 16, alignSelf: "flex-start" }}
      >
        {data.title}
      </ThemedText>

      <View style={styles.bottomWrapper}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={{
              uri: data.image,
            }}
          />
        </View>

        <View style={styles.contentWrapper}>
          <ThemedText fontSize={12} numberOfLines={2}>
            {data.summary}
          </ThemedText>

          <View style={styles.tags}>
            <Tag
              icon={<FontAwesome6 name="location-dot" color={colors.primary} />}
              text={data.location}
            />
            <Tag
              icon={<FontAwesome5 name="book-reader" color={colors.primary} />}
              text={data.system}
            />
            <Tag
              icon={<FontAwesome6 name="stairs" color={colors.primary} />}
              text={data.level}
            />
            <Tag
              icon={<Fontisto name="persons" color={colors.primary} />}
              text={`${data.currentPartySize}/${data.maxPartySize}`}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};
