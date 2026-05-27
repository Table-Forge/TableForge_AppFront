import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "../themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface IProps {
  data: ICharacter;
  cardColor?: string;
  disabled?: boolean;
  onPress?: () => void;
  showOwner?: boolean;
}
export const CharacterItem = ({
  data,
  cardColor = DEFAULT_COLORS.cardImageDark,
  disabled = false,
  onPress,
  showOwner = false,
}: IProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const ownerUsername = data.userUsername;
  const currentUserId = currentUser?.id ? Number(currentUser.id) : undefined;
  const isOwner = currentUserId === data.userId;

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

  const openOwner = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (!data.userId) return;
    router.push({
      pathname: "/user/[id]",
      params: { id: data.userId.toString() },
    } as any);
  };

  const openEdit = (event: GestureResponderEvent) => {
    event.stopPropagation();
    router.push({
      pathname: "/character/create",
      params: { editId: data.id.toString() },
    } as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.wrapper,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.97 }], opacity: 0.92 },
      ]}
    >
      <View style={[styles.imageContainer, { backgroundColor: cardColor }]}>
        {data.imageUrl && (
          <Image style={styles.image} source={{ uri: data.imageUrl }} />
        )}

        {isOwner && (
          <Pressable
            onPress={openEdit}
            hitSlop={8}
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

        <View style={styles.classBadge}>
          <ThemedText style={styles.classBadgeText}>
            {data.className || "-"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <ThemedText style={styles.eyebrow}>Personagem</ThemedText>
        <ThemedText weight="bold" style={styles.title} numberOfLines={1}>
          {data.name}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{data.raceName || "-"}</ThemedText>

        {showOwner && ownerUsername && (
          <Pressable
            onPress={openOwner}
            style={({ pressed }) => [
              styles.ownerRow,
              pressed && { opacity: 0.7 },
            ]}
          >
            <ThemedText style={styles.ownerText} numberOfLines={1}>
              por @{ownerUsername}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 160,
    borderRadius: RADII.lg,
    overflow: "hidden",
    backgroundColor: SURFACES.card,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.card,
  },
  disabled: {
    opacity: 0.6,
  },
  imageContainer: {
    width: "100%",
    height: 168,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    padding: 12,
    backgroundColor: SURFACES.cardAlt,
    borderTopWidth: 1,
    borderTopColor: BORDERS.subtle,
    gap: 2,
  },
  eyebrow: {
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    color: DEFAULT_COLORS.white,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.textMuted,
    textAlign: "left",
  },
  ownerRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDERS.divider,
  },
  ownerText: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    ...fonts.bold,
  },
  classBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: DEFAULT_COLORS.primary_78,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: BORDERS.cta,
  },
  editButton: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: RADII.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.primary_78,
    borderWidth: 1,
    borderColor: BORDERS.highlightStrong,
    zIndex: 2,
  },
  classBadgeText: {
    fontSize: 10,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
