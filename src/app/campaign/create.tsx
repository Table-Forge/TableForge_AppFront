import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { Input } from "@/src/components/input/input";
import { Label } from "@/src/components/label/label";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ProgressInput } from "@/src/components/progress-input/progress-input";
import { Select } from "@/src/components/select/select";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ControlledToggle } from "@/src/components/toggle/controlled-toggle";
import { useAuth } from "@/src/context/auth";
import { useCampaignDifficultyLevelEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-difficulty-level-enum";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import {
  CampaignCreateSchema,
  ICampaignCreate,
  ICampaignCreateInput,
} from "@/src/features/campaigns/schemas/campaign.schema";
import { useGameSystemsSelect } from "@/src/features/game-systems/hooks/use-game-systems-select";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function CreateCampaignScreen() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const { createCampaignMutation, isCreatingCampaign } = useCampaignsMutation();
  const { difficultyLevelEnum, isLoadingDifficultyLevelEnum } =
    useCampaignDifficultyLevelEnum();
  const { gameSystemOptions, isLoadingGameSystemsSelect } =
    useGameSystemsSelect();
  const { createImageMutation, isCreatingImage } = useImagesMutation();
  const [bannerPreview, setBannerPreview] = useState<string>();
  const [bannerContent, setBannerContent] = useState<string>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICampaignCreateInput, unknown, ICampaignCreate>({
    resolver: zodResolver(CampaignCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      playersLimit: 4,
      status: "Active",
      isPrivate: false,
      isChatEnabled: true,
      creatorId: user?.id ?? 0,
      locationId: 0,
      bannerId: 0,
      gameSystemId: 0,
    },
  });

  useEffect(() => {
    if (!user?.id) return;

    setValue("creatorId", user.id, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    });
  }, [setValue, user?.id]);

  const handleSelectBanner = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permissão necessária",
        text2: "Permita o acesso às imagens para adicionar o banner.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset?.base64) {
      Toast.show({
        type: "error",
        text1: "Imagem inválida",
        text2: "Não foi possível ler a imagem selecionada.",
      });
      return;
    }

    setBannerPreview(asset.uri);
    setBannerContent(
      `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`,
    );
  };

  const onSubmit: SubmitHandler<ICampaignCreate> = async (data) => {
    if (!bannerContent) {
      Toast.show({
        type: "error",
        text1: "Banner obrigatório",
        text2: "Selecione uma imagem para o banner da campanha.",
      });
      return;
    }

    let imageResponse: unknown;

    try {
      imageResponse = await createImageMutation.mutateAsync({
        type: "CampaignBanner",
        name: `${data.title || "campanha"}-banner`,
        content: bannerContent,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao enviar banner",
        text2: "Não foi possível cadastrar a imagem da campanha.",
      });
      return;
    }

    const bannerId = getImageIdFromResponse(imageResponse);

    if (!bannerId) {
      Toast.show({
        type: "error",
        text1: "Banner inválido",
        text2: "Não foi possível identificar o banner enviado.",
      });
      return;
    }

    createCampaignMutation.mutate({
      ...data,
      status: "Active",
      bannerId,
    });
  };

  const isSubmitting = isCreatingCampaign || isCreatingImage;

  return (
    <MainContainer style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardWrapper}
      >
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
          <ThemedText style={styles.headerTitle}>Criar campanha</ThemedText>
          <View style={styles.headerSpacer} />
        </HeaderActions>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              DADOS DA CAMPANHA
            </ThemedText>
          </View>

          <InfoCard style={styles.formCard}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Título" />
                  <Input
                    placeholder="ex.: A cripta dos dados perdidos"
                    value={value}
                    onChangeText={onChange}
                    error={errors.title?.message}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Descrição" />
                  <Input
                    placeholder="Conte o gancho principal da aventura"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    containerStyle={styles.multilineInputContainer}
                    textAlignVertical="top"
                    style={styles.multilineInput}
                    error={errors.description?.message}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="difficulty"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Dificuldade" />
                  <Select
                    value={value}
                    onSelect={onChange}
                    options={difficultyLevelEnum}
                    disabled={isLoadingDifficultyLevelEnum}
                    error={errors.difficulty?.message}
                  />
                </View>
              )}
            />

            <View style={styles.fieldContainer}>
              <Label text="Banner" />
              <Pressable
                onPress={handleSelectBanner}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.bannerPicker,
                  pressed && styles.bannerPickerPressed,
                ]}
              >
                {bannerPreview ? (
                  <Image
                    source={{ uri: bannerPreview }}
                    style={styles.bannerImage}
                  />
                ) : (
                  <View style={styles.bannerPlaceholder}>
                    <Ionicons
                      name="image-outline"
                      size={28}
                      color={DEFAULT_COLORS.grays._200}
                    />
                    <ThemedText style={styles.bannerPlaceholderText}>
                      Toque para selecionar o banner
                    </ThemedText>
                  </View>
                )}

                <View style={styles.bannerEditBadge}>
                  {isCreatingImage ? (
                    <ActivityIndicator
                      size="small"
                      color={DEFAULT_COLORS.white}
                    />
                  ) : (
                    <Ionicons
                      name="camera"
                      size={18}
                      color={DEFAULT_COLORS.white}
                    />
                  )}
                </View>
              </Pressable>
            </View>

            <Controller
              control={control}
              name="playersLimit"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Limite de jogadores" />
                  <ProgressInput
                    value={Number(value) || 4}
                    onChange={onChange}
                    min={1}
                    max={8}
                    error={errors.playersLimit?.message}
                  />
                </View>
              )}
            />

            <ControlledToggle
              control={control}
              name="isPrivate"
              label="Campanha privada"
              description="A campanha fica fora das buscas públicas."
            />

            <ControlledToggle
              control={control}
              name="isChatEnabled"
              label="Chat habilitado"
              description="Permite conversa entre participantes."
            />
          </InfoCard>

          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              VÍNCULOS DO PAINEL
            </ThemedText>
          </View>

          <InfoCard style={styles.formCard}>
            <Controller
              control={control}
              name="locationId"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="ID da localização" />
                  <Input
                    placeholder="0"
                    value={value?.toString() ?? ""}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    error={errors.locationId?.message}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="gameSystemId"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Sistema de jogo" />
                  <Select
                    value={typeof value === "number" ? value : undefined}
                    onSelect={(selectedValue) => onChange(selectedValue ?? 0)}
                    options={gameSystemOptions}
                    disabled={isLoadingGameSystemsSelect}
                    error={errors.gameSystemId?.message}
                  />
                </View>
              )}
            />
          </InfoCard>

          <Button
            variant="tertiary"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            text="CRIAR CAMPANHA"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: DEFAULT_COLORS.background,
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
    fontSize: 14,
    letterSpacing: 1.2,
    ...fonts.bold,
    color: DEFAULT_COLORS.secondary,
  },
  formCard: {
    backgroundColor: "rgba(26, 26, 46, 0.95)",
    borderColor: "rgba(126, 135, 226, 0.2)",
    gap: 18,
  },
  fieldContainer: {
    width: "100%",
  },
  multilineInput: {
    height: 110,
    paddingTop: 14,
  },
  multilineInputContainer: {
    height: 120,
    alignItems: "flex-start",
  },
  bannerPicker: {
    width: "100%",
    height: 170,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerPickerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  bannerPlaceholderText: {
    color: DEFAULT_COLORS.grays._200,
    textAlign: "center",
  },
  bannerEditBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DEFAULT_COLORS.tertiary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: DEFAULT_COLORS.primary,
  },
});

function getImageIdFromResponse(response: unknown) {
  if (typeof response === "number") return response;

  if (typeof response === "string") {
    const parsed = Number(response);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  if (response && typeof response === "object" && "id" in response) {
    const parsed = Number((response as { id?: unknown }).id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
