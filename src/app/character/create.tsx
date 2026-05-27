import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useRef } from "react";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { Label } from "@/src/components/label/label";
import { Screen } from "@/src/components/screen/screen";
import { ControlledSelect } from "@/src/components/select/select.controlled";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { ScrollToFocusedInputProvider } from "@/src/context/scroll-to-focused-input";
import { useCharacter } from "@/src/features/characters/hooks/use-character";
import { useCharactersMutation } from "@/src/features/characters/hooks/use-characters-mutations";
import {
  CharacterCreateSchema,
  ICharacterCreate,
  ICharacterCreateInput,
} from "@/src/features/characters/schemas/character.schema";
import { useClassesSelect } from "@/src/features/classes/hooks/use-classes-select";
import { useRacesSelect } from "@/src/features/races/hooks/use-races-select";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";

export default function CreateCharacterScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { returnTo, campaignId, editId } = useLocalSearchParams();
  const { handleBack } = useBackRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    createCharacterMutation,
    updateCharacterMutation,
    isCreatingCharacter,
    isUpdatingCharacter,
  } = useCharactersMutation();
  const { classOptions, isLoadingClassesSelect } = useClassesSelect();
  const { raceOptions, isLoadingRacesSelect } = useRacesSelect();

  const editingId = editId ? Number(editId) : undefined;
  const isEditMode = !!editingId;
  const { data: existingCharacter, isPending: isLoadingExisting } =
    useCharacter(editingId);

  const hookForm = useForm<ICharacterCreateInput, unknown, ICharacterCreate>({
    resolver: zodResolver(CharacterCreateSchema),
    defaultValues: {
      name: "",
      classId: "",
      raceId: "",
      alignment: "",
      bio: "",
      imageUrl: "",
      userId: user?.id ?? 0,
    },
  });
  const { handleSubmit, setValue, reset } = hookForm;

  useEffect(() => {
    if (!user?.id) return;

    setValue("userId", user.id);
  }, [setValue, user?.id]);

  useEffect(() => {
    if (!isEditMode || !existingCharacter) return;

    reset({
      name: existingCharacter.name,
      classId: String(existingCharacter.classId),
      raceId: String(existingCharacter.raceId),
      alignment: existingCharacter.alignment ?? "",
      bio: existingCharacter.bio ?? "",
      imageUrl: existingCharacter.imageUrl ?? "",
      userId: existingCharacter.userId,
    });
  }, [existingCharacter, isEditMode, reset]);

  const isSubmitting = isCreatingCharacter || isUpdatingCharacter;

  const onSubmit: SubmitHandler<ICharacterCreate> = (data) => {
    if (isEditMode && existingCharacter) {
      updateCharacterMutation.mutate(
        { ...existingCharacter, ...data },
        { onSuccess: () => handleBack() },
      );
      return;
    }

    createCharacterMutation.mutate(data, {
      onSuccess: (createdCharacter) => {
        if (returnTo === "campaignJoinRequest" && campaignId) {
          router.replace({
            pathname: "/campaign/[id]/join-request",
            params: {
              id: campaignId,
              selectedCharacterId: createdCharacter.id,
            },
          } as any);
          return;
        }

        handleBack();
      },
    });
  };

  return (
    <Screen style={styles.screen} keyboardAware>
      <ScrollToFocusedInputProvider scrollViewRef={scrollViewRef}>
        <Screen.Header>
          <HeaderActions>
            <ActionButton
              variant="circle"
              icon={
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={DEFAULT_COLORS.white}
                />
              }
              onPress={handleBack}
            />
            <ThemedText style={styles.headerTitle}>
              {isEditMode ? "Editar personagem" : "Criar personagem"}
            </ThemedText>
            <View style={styles.headerSpacer} />
          </HeaderActions>
        </Screen.Header>

        {isEditMode && isLoadingExisting ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator
              color={DEFAULT_COLORS.purpleBright}
              size="large"
            />
            <ThemedText style={styles.loadingText}>
              Carregando personagem...
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Dados do personagem
              </ThemedText>
            </View>

            <InfoCard style={styles.formCard}>
              <View style={styles.fieldContainer}>
                <Label text="Nome" />
                <ControlledInput
                  hookForm={hookForm}
                  name="name"
                  placeholder="Nome do personagem"
                />
              </View>

              <View style={styles.row}>
                <View style={styles.rowField}>
                  <Label text="Classe" />
                  <ControlledSelect
                    hookForm={hookForm}
                    name="classId"
                    options={classOptions}
                    placeholder="Selecione"
                    disabled={isLoadingClassesSelect}
                  />
                </View>

                <View style={styles.rowField}>
                  <Label text="Raça" />
                  <ControlledSelect
                    hookForm={hookForm}
                    name="raceId"
                    options={raceOptions}
                    placeholder="Selecione"
                    disabled={isLoadingRacesSelect}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Alinhamento" />
                <ControlledInput
                  hookForm={hookForm}
                  name="alignment"
                  placeholder="ex.: Leal e Bom"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Imagem" />
                <ControlledImageInput
                  hookForm={hookForm}
                  name="imageUrl"
                  aspect={[3, 4]}
                  height={220}
                  placeholder="Toque para selecionar a imagem"
                  valueMode="uri"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="História" />
                <ControlledInput
                  hookForm={hookForm}
                  name="bio"
                  placeholder="Conte a história do personagem"
                  multiline
                  maxLength={200}
                  textAlignVertical="top"
                  containerStyle={styles.multilineInputContainer}
                  style={styles.multilineInput}
                />
              </View>
            </InfoCard>

            <Button
              variant="tertiary"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              text={isEditMode ? "Salvar alterações" : "Criar personagem"}
            />
          </ScrollView>
        )}
      </ScrollToFocusedInputProvider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: SURFACES.background,
  },
  keyboardWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  headerSpacer: {
    width: 45,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
    paddingTop: 10,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 2,
    ...fonts.bold,
    color: DEFAULT_COLORS.purpleBright,
    textTransform: "uppercase",
  },
  formCard: {
    backgroundColor: SURFACES.card,
    borderColor: BORDERS.highlight,
    gap: 18,
  },
  fieldContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowField: {
    flex: 1,
  },
  multilineInputContainer: {
    height: 120,
    alignItems: "flex-start",
  },
  multilineInput: {
    height: 110,
    paddingTop: 14,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: DEFAULT_COLORS.textMuted,
    fontSize: 13,
  },
});
