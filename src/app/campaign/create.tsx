import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { Label } from "@/src/components/label/label";
import { ControlledLocationAutocomplete } from "@/src/components/location-autocomplete/location-autocomplete.controlled";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ControlledProgressInput } from "@/src/components/progress-input/progress-input.controlled";
import { ControlledSelect } from "@/src/components/select/select.controlled";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ControlledToggle } from "@/src/components/toggle/controlled-toggle";
import { useAuth } from "@/src/context/auth";
import { ScrollToFocusedInputProvider } from "@/src/context/scroll-to-focused-input";
import { useCampaignDifficultyLevelEnum } from "@/src/features/campaigns/hooks/enums/use-campaign-difficulty-level-enum";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { CampaignCreateSchema } from "@/src/features/campaigns/schemas/campaign.schema";
import { useGameSystemsSelect } from "@/src/features/game-systems/hooks/use-game-systems-select";
import { useImagesMutation } from "@/src/features/images/hooks/use-images-mutations";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

const CampaignCreateFormSchema = CampaignCreateSchema.extend({
  bannerImage: z
    .object({
      content: z.string(),
      uri: z.string(),
    })
    .optional(),
});

type ICampaignCreateFormInput = z.input<typeof CampaignCreateFormSchema>;
type ICampaignCreateForm = z.output<typeof CampaignCreateFormSchema>;

export default function CreateCampaignScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const { handleBack } = useBackRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const campaignId = Number(id);
  const isEditing = Number.isFinite(campaignId) && campaignId > 0;
  const { data: campaign, isLoading: isLoadingCampaign } = useCampaign(
    isEditing ? campaignId : undefined,
  );
  const {
    createCampaignMutation,
    updateCampaignMutation,
    isCreatingCampaign,
    isUpdatingCampaign,
  } = useCampaignsMutation();
  const { difficultyLevelEnum, isLoadingDifficultyLevelEnum } =
    useCampaignDifficultyLevelEnum();
  const { gameSystemOptions, isLoadingGameSystemsSelect } =
    useGameSystemsSelect();
  const { createImageMutation, isCreatingImage } = useImagesMutation();

  const hookForm = useForm<
    ICampaignCreateFormInput,
    unknown,
    ICampaignCreateForm
  >({
    resolver: zodResolver(CampaignCreateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      playersLimit: 4,
      status: "Active",
      isPrivate: false,
      isChatEnabled: true,
      creatorId: user?.id ?? 0,
      locationName: "",
      address: "",
      latitude: "",
      longitude: "",
      creationLatitude: 0,
      creationLongitude: 0,
      blockedClasses: [],
      blockedRaces: [],
      bannerId: 0,
      bannerImage: undefined,
      gameSystemId: 0,
    },
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = hookForm;

  useEffect(() => {
    if (!user?.id || isEditing) return;

    setValue("creatorId", user.id, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    });
  }, [isEditing, setValue, user?.id]);

  useEffect(() => {
    if (!campaign) return;

    reset({
      title: campaign.title ?? "",
      description: campaign.description ?? "",
      difficulty: campaign.difficulty ?? "",
      playersLimit: campaign.playersLimit ?? 4,
      status: campaign.status ?? "Active",
      isPrivate: campaign.isPrivate ?? false,
      isChatEnabled: campaign.isChatEnabled ?? true,
      creatorId: campaign.creatorId,
      locationName: campaign.locationName ?? "",
      address: campaign.address ?? "",
      latitude: campaign.latitude ?? "",
      longitude: campaign.longitude ?? "",
      creationLatitude: campaign.creationLatitude ?? 0,
      creationLongitude: campaign.creationLongitude ?? 0,
      blockedClasses: campaign.blockedClasses ?? [],
      blockedRaces: campaign.blockedRaces ?? [],
      bannerId: campaign.bannerId ?? 0,
      bannerImage: undefined,
      gameSystemId: campaign.gameSystemId ?? 0,
    });
  }, [campaign, reset]);

  const onSubmit: SubmitHandler<ICampaignCreateForm> = async ({
    bannerImage,
    ...data
  }) => {
    if (!isEditing && !bannerImage?.content) {
      Toast.show({
        type: "error",
        text1: "Banner obrigatório",
        text2: "Selecione uma imagem para o banner da campanha.",
      });
      return;
    }

    let creationLatitude = data.creationLatitude;
    let creationLongitude = data.creationLongitude;

    if (!isEditing) {
      const locationPermission =
        await Location.requestForegroundPermissionsAsync();

      if (!locationPermission.granted) {
        Toast.show({
          type: "error",
          text1: "Permissão necessária",
          text2: "Permita o acesso à localização para criar a campanha.",
        });
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        creationLatitude = currentLocation.coords.latitude;
        creationLongitude = currentLocation.coords.longitude;
      } catch {
        Toast.show({
          type: "error",
          text1: "Localização indisponível",
          text2: "Não foi possível capturar sua localização atual.",
        });
        return;
      }
    }

    let bannerId = data.bannerId;

    if (bannerImage?.content) {
      let imageResponse: unknown;

      try {
        imageResponse = await createImageMutation.mutateAsync({
          type: "CampaignBanner",
          name: `${data.title || "campanha"}-banner`,
          content: bannerImage.content,
        });
      } catch {
        Toast.show({
          type: "error",
          text1: "Erro ao enviar banner",
          text2: "Não foi possível cadastrar a imagem da campanha.",
        });
        return;
      }

      bannerId = getImageIdFromResponse(imageResponse) ?? 0;
    }

    if (!bannerId) {
      Toast.show({
        type: "error",
        text1: "Banner inválido",
        text2: "Não foi possível identificar o banner enviado.",
      });
      return;
    }

    const payload = {
      ...data,
      status: "Active",
      bannerId,
      creationLatitude,
      creationLongitude,
    };

    if (isEditing) {
      updateCampaignMutation.mutate(
        {
          id: campaignId,
          ...payload,
        },
        {
          onSuccess: () => handleBack(),
        },
      );
      return;
    }

    createCampaignMutation.mutate(payload);
  };

  const isSubmitting = isCreatingCampaign || isUpdatingCampaign || isCreatingImage;
  const locationSelectionError =
    errors.address?.message ||
    errors.latitude?.message ||
    errors.longitude?.message;

  return (
    <MainContainer style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardWrapper}
      >
        <ScrollToFocusedInputProvider scrollViewRef={scrollViewRef}>
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
              {isEditing ? "Editar campanha" : "Criar campanha"}
            </ThemedText>
            <View style={styles.headerSpacer} />
          </HeaderActions>

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Dados da campanha
              </ThemedText>
            </View>

            <InfoCard style={styles.formCard}>
              <View style={styles.fieldContainer}>
                <Label text="Título" />
                <ControlledInput
                  hookForm={hookForm}
                  name="title"
                  placeholder="ex.: A cripta dos dados perdidos"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Descrição" />
                <ControlledInput
                  hookForm={hookForm}
                  name="description"
                  placeholder="Conte o gancho principal da aventura"
                  multiline
                  maxLength={200}
                  containerStyle={styles.multilineInputContainer}
                  textAlignVertical="top"
                  style={styles.multilineInput}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Dificuldade" />
                <ControlledSelect
                  hookForm={hookForm}
                  name="difficulty"
                  options={difficultyLevelEnum}
                  disabled={isLoadingDifficultyLevelEnum}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Banner" />
                <ControlledImageInput
                  hookForm={hookForm}
                  name="bannerImage"
                  disabled={isSubmitting || isLoadingCampaign}
                  isLoading={isCreatingImage}
                  placeholder="Toque para selecionar o banner"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Limite de jogadores" />
                <ControlledProgressInput
                  hookForm={hookForm}
                  name="playersLimit"
                  min={1}
                  max={8}
                />
              </View>

              <ControlledToggle
                hookForm={hookForm}
                name="isPrivate"
                label="Campanha privada"
                description="A campanha fica fora das buscas públicas."
              />

              <ControlledToggle
                hookForm={hookForm}
                name="isChatEnabled"
                label="Chat habilitado"
                description="Permite conversa entre participantes."
              />
            </InfoCard>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Localização da campanha
              </ThemedText>
            </View>

            <InfoCard style={styles.formCard}>
              <ControlledLocationAutocomplete
                hookForm={hookForm}
                name="locationName"
                hasSelectionError={!!locationSelectionError}
                onClearSelection={() => {
                  setValue("address", "", { shouldValidate: false });
                  setValue("latitude", "", { shouldValidate: false });
                  setValue("longitude", "", { shouldValidate: false });
                }}
                onSelectLocation={(location) => {
                  setValue("address", location.address, {
                    shouldValidate: true,
                  });
                  setValue("latitude", location.latitude, {
                    shouldValidate: true,
                  });
                  setValue("longitude", location.longitude, {
                    shouldValidate: true,
                  });
                }}
              />
            </InfoCard>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Vínculos do painel
              </ThemedText>
            </View>

            <InfoCard style={styles.formCard}>
              <View style={styles.fieldContainer}>
                <Label text="Sistema de jogo" />
                <ControlledSelect
                  hookForm={hookForm}
                  name="gameSystemId"
                  options={gameSystemOptions}
                  disabled={isLoadingGameSystemsSelect}
                />
              </View>
            </InfoCard>

            <Button
              variant="tertiary"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              disabled={isLoadingCampaign}
              text={isEditing ? "Salvar campanha" : "Criar campanha"}
            />
          </ScrollView>
        </ScrollToFocusedInputProvider>
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
    textTransform: "uppercase",
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
