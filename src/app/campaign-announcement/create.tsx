import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { Label } from "@/src/components/label/label";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ScrollToFocusedInputProvider } from "@/src/context/scroll-to-focused-input";
import { useCampaignAnnouncements } from "@/src/features/campaign-announcements/hooks/use-campaign-announcements";
import { useCampaignAnnouncementsMutation } from "@/src/features/campaign-announcements/hooks/use-campaign-announcements-mutations";
import { CampaignAnnouncementCreateSchema } from "@/src/features/campaign-announcements/schemas/campaign-announcement.schema";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignMembers } from "@/src/features/campaign-members/hooks/use-campaign-members";
import { useAuth } from "@/src/context/auth";
import { notify } from "@/src/features/notifications/helpers/notify";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";

type ICampaignAnnouncementCreateInput = z.input<
  typeof CampaignAnnouncementCreateSchema
>;
type ICampaignAnnouncementCreate = z.output<
  typeof CampaignAnnouncementCreateSchema
>;

export default function CreateCampaignAnnouncementScreen() {
  const { user } = useAuth();
  const { campaignId, editId } = useLocalSearchParams();
  const parsedCampaignId = Number(campaignId);
  const editingId = editId ? Number(editId) : undefined;
  const isEditMode = !!editingId;

  const { handleBack } = useBackRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { data: campaign } = useCampaign(parsedCampaignId);
  const { data: members = [] } = useCampaignMembers({
    campaignId: parsedCampaignId,
  });
  
  const { data: announcementsData, isLoading: isLoadingAnnouncements } = useCampaignAnnouncements({ 
    campaignId: parsedCampaignId, 
    enabled: isEditMode 
  });
  const existingAnnouncement = useMemo(
    () => announcementsData?.pages.flatMap((page) => page.items).find((a) => a.id === editingId),
    [announcementsData, editingId]
  );

  const { createCampaignAnnouncementMutation, updateCampaignAnnouncementMutation, isCreatingCampaignAnnouncement, isUpdatingCampaignAnnouncement } =
    useCampaignAnnouncementsMutation(parsedCampaignId);

  const hookForm = useForm<
    ICampaignAnnouncementCreateInput,
    unknown,
    ICampaignAnnouncementCreate
  >({
    resolver: zodResolver(CampaignAnnouncementCreateSchema),
    defaultValues: {
      campaignId: parsedCampaignId,
      title: "",
      content: "",
      date: new Date().toISOString(),
    },
  });
  const { handleSubmit, setValue, reset } = hookForm;

  useEffect(() => {
    if (!parsedCampaignId) return;

    setValue("campaignId", parsedCampaignId);
  }, [parsedCampaignId, setValue]);

  useEffect(() => {
    if (isEditMode && existingAnnouncement) {
      reset({
        campaignId: existingAnnouncement.campaignId,
        title: existingAnnouncement.title,
        content: existingAnnouncement.content,
        date: existingAnnouncement.date,
      });
    }
  }, [existingAnnouncement, isEditMode, reset]);

  const isSubmitting = isCreatingCampaignAnnouncement || isUpdatingCampaignAnnouncement;

  const onSubmit: SubmitHandler<ICampaignAnnouncementCreate> = (data) => {
    if (isEditMode && existingAnnouncement) {
      updateCampaignAnnouncementMutation.mutate(
        { ...data, id: existingAnnouncement.id },
        { onSuccess: () => handleBack() }
      );
      return;
    }

    createCampaignAnnouncementMutation.mutate(data, {
      onSuccess: () => {
        if (campaign) {
          const senderId = user?.id ? Number(user.id) : undefined;
          const recipientIds = members
            .map((member) => member.userId)
            .filter((id) => id !== senderId);
          notify.newAnnouncement({
            memberIds: recipientIds,
            campaignId: parsedCampaignId,
            campaignTitle: campaign.title,
            announcementTitle: data.title,
          });
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
              {isEditMode ? "Editar anúncio" : "Criar anúncio"}
            </ThemedText>
            <View style={styles.headerSpacer} />
          </HeaderActions>
        </Screen.Header>

        {isEditMode && isLoadingAnnouncements ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator
              color={DEFAULT_COLORS.purpleBright}
              size="large"
            />
            <ThemedText style={styles.loadingText}>
              Carregando anúncio...
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <InfoCard style={styles.formCard}>
              <View style={styles.fieldContainer}>
                <Label text="Título" />
                <ControlledInput
                  hookForm={hookForm}
                  name="title"
                  placeholder="Título do anúncio"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Conteúdo" />
                <ControlledInput
                  hookForm={hookForm}
                  name="content"
                  placeholder="Escreva o anúncio da mesa"
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
              text={isEditMode ? "Salvar alterações" : "Criar anúncio"}
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
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
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 24,
  },
  formCard: {
    backgroundColor: SURFACES.card,
    borderColor: BORDERS.highlight,
    gap: 18,
    marginBottom: 18,
  },
  fieldContainer: {
    width: "100%",
  },
  multilineInputContainer: {
    height: 140,
    alignItems: "flex-start",
  },
  multilineInput: {
    height: 130,
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
