import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollView, StyleSheet, View } from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { Label } from "@/src/components/label/label";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ScrollToFocusedInputProvider } from "@/src/context/scroll-to-focused-input";
import { useCampaignSessionsMutation } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions-mutations";
import { CampaignSessionCreateSchema } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignMembers } from "@/src/features/campaign-members/hooks/use-campaign-members";
import { useAuth } from "@/src/context/auth";
import { notify } from "@/src/features/notifications/helpers/notify";
import { useBackRouter } from "@/src/hooks/use-back-route";
import dayjs from "dayjs";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";

type ICampaignSessionCreateInput = z.input<typeof CampaignSessionCreateSchema>;
type ICampaignSessionCreate = z.output<typeof CampaignSessionCreateSchema>;

export default function CreateCampaignSessionScreen() {
  const { user } = useAuth();
  const { campaignId, date } = useLocalSearchParams();
  const parsedCampaignId = Number(campaignId);
  const selectedDate = Array.isArray(date) ? date[0] : date;
  const { handleBack } = useBackRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { data: campaign } = useCampaign(parsedCampaignId);
  const { data: members = [] } = useCampaignMembers({
    campaignId: parsedCampaignId,
  });
  const { createCampaignSessionMutation, isCreatingCampaignSession } =
    useCampaignSessionsMutation();

  const hookForm = useForm<
    ICampaignSessionCreateInput,
    unknown,
    ICampaignSessionCreate
  >({
    resolver: zodResolver(CampaignSessionCreateSchema),
    defaultValues: {
      campaignId: parsedCampaignId,
      title: "",
      location: "",
      link: "",
      date: selectedDate || new Date().toISOString(),
    },
  });
  const { handleSubmit, setValue } = hookForm;

  useEffect(() => {
    if (!parsedCampaignId) return;

    setValue("campaignId", parsedCampaignId);
  }, [parsedCampaignId, setValue]);

  useEffect(() => {
    if (!selectedDate) return;

    setValue("date", selectedDate);
  }, [selectedDate, setValue]);

  const onSubmit: SubmitHandler<ICampaignSessionCreate> = (data) => {
    createCampaignSessionMutation.mutate(data, {
      onSuccess: () => {
        if (campaign) {
          const senderId = user?.id ? Number(user.id) : undefined;
          const recipientIds = members
            .map((member) => member.userId)
            .filter((id) => id !== senderId);
          notify.newSession({
            memberIds: recipientIds,
            campaignId: parsedCampaignId,
            campaignTitle: campaign.title,
            sessionTitle: data.title,
            sessionDate: dayjs(data.date).format("DD/MM/YYYY [às] HH:mm"),
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
            <ThemedText style={styles.headerTitle}>Marcar sessão</ThemedText>
            <View style={styles.headerSpacer} />
          </HeaderActions>
        </Screen.Header>

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
                  placeholder="ex.: Sessão 01"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Local" />
                <ControlledInput
                  hookForm={hookForm}
                  name="location"
                  placeholder="Local da sessão"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Link" />
                <ControlledInput
                  hookForm={hookForm}
                  name="link"
                  placeholder="Link da mesa online"
                  autoCapitalize="none"
                />
              </View>
            </InfoCard>

            <Button
              variant="tertiary"
              text="Marcar sessão"
              isLoading={isCreatingCampaignSession}
              onPress={handleSubmit(onSubmit)}
            />
        </ScrollView>
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
});
