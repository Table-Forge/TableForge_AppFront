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
import { ControlledDateInput } from "@/src/components/input/input.date.controlled";
import { ControlledTimeInput } from "@/src/components/input/input.time.controlled";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { Label } from "@/src/components/label/label";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ScrollToFocusedInputProvider } from "@/src/context/scroll-to-focused-input";
import { useCampaignSessionsMutation } from "@/src/features/campaign-sessions/hooks/use-campaign-sessions-mutations";
import { useCampaignSession } from "@/src/features/campaign-sessions/hooks/use-campaign-session";
import { CampaignSessionCreateSchema } from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";

const FormSchema = CampaignSessionCreateSchema.omit({ date: true }).extend({
  dateOnly: z.string().trim().min(1, "A data é obrigatória."),
  timeOnly: z.string().trim().min(1, "A hora é obrigatória."),
});

type IFormInput = z.input<typeof FormSchema>;
type IFormOutput = z.output<typeof FormSchema>;

export default function EditCampaignSessionScreen() {
  const { sessionId } = useLocalSearchParams();
  const parsedSessionId = Number(sessionId);
  const { handleBack } = useBackRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: session, isLoading: isLoadingSession } = useCampaignSession(parsedSessionId);
  const { updateCampaignSessionMutation, isUpdatingCampaignSession } =
    useCampaignSessionsMutation();

  const hookForm = useForm<
    IFormInput,
    unknown,
    IFormOutput
  >({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      location: "",
      link: "",
      dateOnly: new Date().toISOString(),
      timeOnly: new Date().toISOString(),
    },
  });
  const { handleSubmit, reset } = hookForm;

  useEffect(() => {
    if (session) {
      reset({
        campaignId: session.campaignId,
        title: session.title,
        location: session.location,
        link: session.link || "",
        dateOnly: session.date,
        timeOnly: session.date,
      });
    }
  }, [session, reset]);

  const onSubmit: SubmitHandler<IFormOutput> = async (data) => {
    if (!session) return;

    const dDate = new Date(data.dateOnly);
    const dTime = new Date(data.timeOnly);

    const combinedDate = new Date(
      dDate.getFullYear(),
      dDate.getMonth(),
      dDate.getDate(),
      dTime.getHours(),
      dTime.getMinutes(),
      0,
      0
    );

    const payload = {
      id: session.id,
      campaignId: session.campaignId,
      title: data.title,
      location: data.location,
      link: data.link,
      date: combinedDate.toISOString(),
    };

    try {
      await updateCampaignSessionMutation.mutateAsync(payload);
      handleBack();
    } catch {
      // Silently ignore or handle error
    }
  };

  if (isLoadingSession) {
    return (
      <Screen style={styles.screen}>
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
            <ThemedText style={styles.headerTitle}>Editar sessão</ThemedText>
            <View style={styles.headerSpacer} />
          </HeaderActions>
        </Screen.Header>
        <View style={styles.loadingContainer}>
          <ThemedText>Carregando sessão...</ThemedText>
        </View>
      </Screen>
    );
  }

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
            <ThemedText style={styles.headerTitle}>Editar sessão</ThemedText>
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

            <ControlledDateInput
              hookForm={hookForm}
              name="dateOnly"
              label="Data"
              placeholder="Selecione a data"
            />

            <ControlledTimeInput
              hookForm={hookForm}
              name="timeOnly"
              label="Hora"
              placeholder="Selecione a hora"
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
            text="Salvar alterações"
            isLoading={isUpdatingCampaignSession}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
