import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Image, Pressable, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "../themed-text/themed-text";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { fonts } from "@/src/theme/fonts";

interface IProps {
  data: ICharacter;
  cardColor?: string;
  disabled?: boolean;
  onPress?: () => void;
}
export const CharacterItem = ({
  data,
  cardColor = "#666666",
  disabled = false,
  onPress,
}: IProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (disabled) return;

    if (onPress) {
      onPress();
      return;
    }

    router.push({
      pathname: "/character/[id]",
      params: { id: data.id.toString() },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.wrapper,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.97 }], opacity: 0.9 },
      ]}
    >
      <View style={[styles.imageContainer, { backgroundColor: cardColor }]}>
        {data.imageUrl && (
          <Image style={styles.image} source={{ uri: data.imageUrl }} />
        )}

        <View style={styles.classBadge}>
          <ThemedText
            style={{
              fontSize: 10,
              color: DEFAULT_COLORS.tertiary,
              ...fonts.bold,
            }}
          >
            {data.className?.toUpperCase() || "-"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <ThemedText weight="bold" style={styles.title} numberOfLines={1}>
          {data.name}
        </ThemedText>

        <ThemedText style={styles.subtitle}>{data.raceName || "-"}</ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 155,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: DEFAULT_COLORS.background,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary_30,

    elevation: 5,
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  disabled: {
    opacity: 0.9,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  contentWrapper: {
    padding: 12,
    backgroundColor: DEFAULT_COLORS.background,
    borderTopWidth: 2,
    borderTopColor: DEFAULT_COLORS.tertiary,
  },
  title: {
    fontSize: 16,
    color: DEFAULT_COLORS.white,
    textAlign: "left",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  subtitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.white,
    opacity: 0.6,
    textAlign: "left",
  },
  classBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary,
  },
});
