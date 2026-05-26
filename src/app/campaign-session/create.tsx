import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ControlledDateInput } from "@/src/components/input/input.date.controlled";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { Label } from "@/src/components/label/label";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ScrollToFocusedInputProvider } from "@/src/context/scroll-to-focused-input";
import { useCampaignSessionsMutation } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions-mutations";
import { CampaignSessionCreateSchema } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

type ICampaignSessionCreateInput = z.input<typeof CampaignSessionCreateSchema>;
type ICampaignSessionCreate = z.output<typeof CampaignSessionCreateSchema>;

export default function CreateCampaignSessionScreen() {
  const { campaignId } = useLocalSearchParams();
  const parsedCampaignId = Number(campaignId);
  const { handleBack } = useBackRouter();
  const scrollViewRef = useRef<ScrollView>(null);
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
      date: new Date().toISOString(),
    },
  });
  const { handleSubmit, setValue } = hookForm;

  useEffect(() => {
    if (!parsedCampaignId) return;

    setValue("campaignId", parsedCampaignId);
  }, [parsedCampaignId, setValue]);

  const onSubmit: SubmitHandler<ICampaignSessionCreate> = (data) => {
    createCampaignSessionMutation.mutate(data, {
      onSuccess: () => handleBack(),
    });
  };

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
            <ThemedText style={styles.headerTitle}>Marcar sessão</ThemedText>
            <View style={styles.headerSpacer} />
          </HeaderActions>

          <ScrollView
            ref={scrollViewRef}
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

              <ControlledDateInput
                hookForm={hookForm}
                name="date"
                label="Data"
                placeholder="Selecione a data"
              />

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
    paddingTop: 30,
  },
  formCard: {
    backgroundColor: "rgba(26, 26, 46, 0.95)",
    borderColor: "rgba(126, 135, 226, 0.2)",
    gap: 18,
    marginBottom: 18,
  },
  fieldContainer: {
    width: "100%",
  },
});
