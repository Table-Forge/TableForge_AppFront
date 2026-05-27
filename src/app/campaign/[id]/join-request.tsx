import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useCharacters } from "@/src/features/characters/hooks/use-characters";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { useJoinRequestsMutation } from "@/src/features/join-requests/hooks/use-join-requests-mutations";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function CampaignJoinRequestScreen() {
  const router = useRouter();
  const { handleBack } = useBackRouter();
  const { user } = useAuth();
  const { id, selectedCharacterId: selectedCharacterIdParam } =
    useLocalSearchParams();
  const campaignId = Number(id);
  const parsedSelectedCharacterId = Number(selectedCharacterIdParam);
  const userId = user?.id ? Number(user.id) : undefined;
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>();
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { data, isLoading, isError } = useCharacters({
    page: 1,
    size: 100,
    enabled: !!userId,
  });
  const { createJoinRequestMutation, isCreatingJoinRequest } =
    useJoinRequestsMutation(campaignId);

  const characters = useMemo(
    () =>
      userId
        ? (data?.items ?? []).filter((character) => character.userId === userId)
        : [],
    [data?.items, userId],
  );

  useEffect(() => {
    if (!Number.isFinite(parsedSelectedCharacterId)) return;

    setSelectedCharacterId(parsedSelectedCharacterId);
  }, [parsedSelectedCharacterId]);

  const handleSubmit = () => {
    if (!userId || !selectedCharacterId) return;

    createJoinRequestMutation.mutate(
      {
        campaignId,
        userId,
        characterId: selectedCharacterId,
        message: message.trim(),
      },
      {
        onSuccess: () => handleBack(),
      },
    );
  };

  const isSubmitDisabled =
    !selectedCharacterId || !acceptedTerms || isCreatingJoinRequest;

  return (
    <MainContainer style={styles.container}>
      <HeaderActions>
        <ActionButton
          variant="circle"
          icon={
            <Ionicons
              name="arrow-back"
              size={22}
              color={DEFAULT_COLORS.white}
            />
          }
          onPress={handleBack}
        />
        <ThemedText weight="bold" style={styles.headerTitle}>
          Quero entrar
        </ThemedText>
        <View style={styles.headerSpacer} />
      </HeaderActions>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>
            Solicitação de entrada
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Escolha um personagem para submeter à mesa.
          </ThemedText>
        </View>

        <View style={styles.charactersHeader}>
          <ThemedText weight="bold" style={styles.moduleTitle}>
            Seus personagens
          </ThemedText>
          <ActionButton
            variant="pill"
            label="Criar"
            icon={
              <Ionicons name="add" size={18} color={DEFAULT_COLORS.white} />
            }
            onPress={() =>
              router.push({
                pathname: "/character/create",
                params: {
                  returnTo: "campaignJoinRequest",
                  campaignId,
                },
              } as any)
            }
            backgroundColor={DEFAULT_COLORS.tertiary}
          />
        </View>

        {isLoading ? (
          <View style={styles.feedbackWrapper}>
            <ActivityIndicator color={DEFAULT_COLORS.tertiary} />
            <ThemedText style={styles.feedbackText}>Carregando...</ThemedText>
          </View>
        ) : characters.length ? (
          <View style={styles.characterGrid}>
            {characters.map((character) => (
              <SelectableCharacterCard
                key={character.id}
                character={character}
                isSelected={selectedCharacterId === character.id}
                onPress={() => setSelectedCharacterId(character.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.feedbackWrapper}>
            <ThemedText style={styles.feedbackText}>
              {isError
                ? "Não foi possível carregar seus personagens."
                : "Você ainda não criou personagens."}
            </ThemedText>
          </View>
        )}

        <View style={styles.messageWrapper}>
          <ThemedText style={styles.inputLabel}>Mensagem opcional</ThemedText>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Conte por que esse personagem combina com a mesa."
            placeholderTextColor="rgba(255,255,255,0.35)"
            multiline
            style={styles.messageInput}
            textAlignVertical="top"
          />
        </View>

        <Pressable
          style={styles.termsWrapper}
          onPress={() => setAcceptedTerms((current) => !current)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxOn]}>
            {acceptedTerms && (
              <Ionicons
                name="checkmark"
                size={14}
                color={DEFAULT_COLORS.white}
              />
            )}
          </View>
          <ThemedText style={styles.termsText}>
            Declaro que todas as informações são completas, verdadeiras e não
            infringem os termos de uso da plataforma.
          </ThemedText>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <Button variant="primary" text="Cancelar" onPress={handleBack} />
        </View>
        <View style={styles.footerButton}>
          <Button
            variant="tertiary"
            text="Enviar"
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            isLoading={isCreatingJoinRequest}
          />
        </View>
      </View>
    </MainContainer>
  );
}

const SelectableCharacterCard = ({
  character,
  isSelected,
  onPress,
}: {
  character: ICharacter;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.characterCard,
      isSelected && styles.characterCardSelected,
      pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
    ]}
  >
    <View style={styles.characterImageWrapper}>
      {character.imageUrl ? (
        <Image source={{ uri: character.imageUrl }} style={styles.characterImage} />
      ) : (
        <Ionicons
          name="person-circle-outline"
          size={54}
          color="rgba(255,255,255,0.35)"
        />
      )}
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Ionicons name="checkmark" size={14} color={DEFAULT_COLORS.white} />
        </View>
      )}
    </View>
    <View style={styles.characterContent}>
      <ThemedText weight="bold" style={styles.characterName} numberOfLines={1}>
        {character.name}
      </ThemedText>
      <ThemedText style={styles.characterMeta} numberOfLines={1}>
        {character.className || "-"}
      </ThemedText>
      <ThemedText style={styles.characterMeta} numberOfLines={1}>
        {character.raceName || "-"}
      </ThemedText>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    color: DEFAULT_COLORS.white,
    textAlign: "center",
  },
  headerSpacer: {
    width: 45,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 18,
  },
  sectionHeader: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 22,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  sectionDescription: {
    color: DEFAULT_COLORS.grays._200,
    lineHeight: 20,
  },
  charactersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  moduleTitle: {
    color: DEFAULT_COLORS.tertiary,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  characterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  characterCard: {
    width: "48%",
    minHeight: 220,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.2)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  characterCardSelected: {
    borderColor: DEFAULT_COLORS.tertiary,
    backgroundColor: "rgba(251, 69, 1, 0.12)",
  },
  characterImageWrapper: {
    height: 132,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.tertiary,
  },
  characterContent: {
    padding: 12,
    gap: 3,
  },
  characterName: {
    color: DEFAULT_COLORS.white,
    fontSize: 15,
  },
  characterMeta: {
    color: DEFAULT_COLORS.grays._200,
    fontSize: 12,
  },
  feedbackWrapper: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.12)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  feedbackText: {
    color: DEFAULT_COLORS.grays._200,
    textAlign: "center",
  },
  messageWrapper: {
    gap: 8,
  },
  inputLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
  },
  messageInput: {
    minHeight: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.35)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: DEFAULT_COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...fonts.regular,
  },
  termsWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxOn: {
    backgroundColor: DEFAULT_COLORS.tertiary,
    borderColor: DEFAULT_COLORS.tertiary,
  },
  termsText: {
    flex: 1,
    color: DEFAULT_COLORS.grays._200,
    lineHeight: 19,
  },
  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    flexDirection: "row",
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});
