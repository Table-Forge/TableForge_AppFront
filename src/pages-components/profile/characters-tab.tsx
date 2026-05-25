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

export const CharactersTab = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : undefined;
  const { data, isLoading, isError } = useCharacters({ page: 1, size: 100 });

  const characters = useMemo(
    () =>
      userId
        ? (data?.items ?? []).filter((character) => character.userId === userId)
        : [],
    [data?.items, userId],
  );

  return (
    <>
      <View style={styles.titleWrapper}>
        <View>
          <ThemedText fontSize={16} weight="bold">
            Personagens
          </ThemedText>

          <ThemedText style={styles.counterText}>
            {characters.length}/{characters.length}
          </ThemedText>
        </View>

        <ActionButton
          variant="pill"
          label="Criar"
          icon={<Entypo name="plus" size={20} color={DEFAULT_COLORS.white} />}
          onPress={() => router.push("/character/create")}
          backgroundColor={DEFAULT_COLORS.tertiary}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={DEFAULT_COLORS.tertiary} size="small" />
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
                cardColor={DEFAULT_COLORS.background}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <ThemedText style={styles.feedbackText}>
          {isError
            ? "Não foi possível carregar seus personagens."
            : "Você ainda não criou personagens."}
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
  counterText: {
    color: DEFAULT_COLORS.grays._200,
    marginTop: 2,
  },
  scrollContainer: {
    paddingRight: 20,
    gap: 12,
  },
  feedbackText: {
    color: DEFAULT_COLORS.grays._200,
  },
});
