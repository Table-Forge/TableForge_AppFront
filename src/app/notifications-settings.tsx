import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { ActionButton } from "@/src/components/action-button/action-button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { InfoCard } from "@/src/components/info-card/info-card";
import { Screen } from "@/src/components/screen/screen";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { Ionicons } from "@expo/vector-icons";
import {
  UpdatePasswordSchema,
  IUpdatePassword,
} from "@/src/features/users/schemas/user.schema";
import { useAuth } from "@/src/context/auth";
import { ControlledToggle } from "@/src/components/toggle/controlled-toggle";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";

export default function NotificationsSettingsScreen() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();

  const { control } = useForm<IUpdatePassword>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      userId: user?.id,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  return (
    <Screen keyboardAware>
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
          <ThemedText style={styles.headerTitle}>Notificações</ThemedText>
          <View style={{ width: 45 }} />
        </HeaderActions>
      </Screen.Header>

      <Screen.Body
        scroll
        contentContainerStyle={styles.container}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Configurar push de notificações
            </ThemedText>
          </View>

          <InfoCard style={styles.formCard}>
            <View style={styles.formContent}>
              <ControlledToggle
                name="privateMessages"
                control={control}
                label="Mensagens Privadas"
                description="Receba um corvo mensageiro sempre que alguém te enviar um sussurro."
              />

              <ControlledToggle
                name="motivationalMessages"
                control={control}
                label="Conselhos do Mago Avalon"
                description="Palavras de sabedoria e incentivo vindas diretamente da Torre Arcana."
              />

              <ControlledToggle
                name="systemUpdates"
                control={control}
                label="Alertas da Guilda"
                description="Fique por dentro de novas leis, pergaminhos de atualização e mudanças no reino."
              />

              <ControlledToggle
                name="campaignReminders"
                control={control}
                label="Cronograma de Aventuras"
                description="Lembretes automáticos para você nunca se atrasar para o início de uma quest."
              />
            </View>
          </InfoCard>

          <Button
            variant="tertiary"
            // onPress={handleSubmit(onSubmit)}
            onPress={() => console.log("apertei")}
            isLoading={isUpdatingPassword}
            text="Salvar Alterações"
          />
      </Screen.Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 40,
    paddingTop: 10,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 15,
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
  },
  formContent: {
    gap: 20,
    paddingVertical: 10,
  },
  fieldContainer: {
    width: "100%",
  },
});
