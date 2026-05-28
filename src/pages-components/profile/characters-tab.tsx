import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { CharacterItem } from "@/src/components/character-item/character-item";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useCharacters } from "@/src/features/characters/hooks/use-characters";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

interface IProps {
  userId?: number;
}

export const CharactersTab = ({ userId: userIdProp }: IProps = {}) => {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id ? Number(user.id) : undefined;
  const targetUserId = userIdProp ?? currentUserId;
  const isCurrentUser = !userIdProp || userIdProp === currentUserId;
  const { data, isLoading, isError } = useCharacters({
    page: 1,
    size: 100,
    userId: targetUserId,
    enabled: !!targetUserId,
  });

  const characters = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    <>
      <View style={styles.titleWrapper}>
        <View>
          <ThemedText style={styles.sectionTitle}>Personagens</ThemedText>
          <ThemedText style={styles.counterText}>
            {characters.length}/{characters.length}
          </ThemedText>
        </View>

        {isCurrentUser && (
          <ActionButton
            variant="pill"
            label="Criar"
            active
            icon={<Entypo name="plus" size={20} color={DEFAULT_COLORS.white} />}
            onPress={() => router.push("/character/create")}
          />
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={DEFAULT_COLORS.purpleBright} size="small" />
      ) : characters.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {characters.map((item) => (
            <View key={item.id}>
              <CharacterItem
                data={item}
                cardColor={DEFAULT_COLORS.cardImageDark}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <ThemedText style={styles.feedbackText}>
          {isError
            ? "Não foi possível carregar os personagens."
            : isCurrentUser
              ? "Você ainda não criou personagens."
              : "Esse aventureiro ainda não tem personagens."}
        </ThemedText>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  counterText: {
    color: DEFAULT_COLORS.textMuted,
    marginTop: 2,
    fontSize: 12,
  },
  scrollContainer: {
    paddingRight: 20,
    gap: 12,
  },
  feedbackText: {
    color: DEFAULT_COLORS.textMuted,
  },
});
