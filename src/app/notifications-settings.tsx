import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { ActionButton } from "@/src/components/action-button/action-button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { InfoCard } from "@/src/components/info-card/info-card";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { Ionicons } from "@expo/vector-icons";
import {
  UpdatePasswordSchema,
  IUpdatePassword,
} from "@/src/features/users/schemas/user.schema";
import { useAuth } from "@/src/context/auth";
import { ControlledToggle } from "@/src/components/toggle/controlled-toggle";
import { fonts } from "@/src/theme/fonts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsSettingsScreen() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const { updatePasswordMutation, isUpdatingPassword } = useUsersMutation();

  const { control, handleSubmit } = useForm<IUpdatePassword>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      userId: user?.id,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: IUpdatePassword) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
          <ThemedText style={styles.headerTitle}>Notificações</ThemedText>
          <View style={{ width: 45 }} />
        </HeaderActions>

        <ScrollView
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

          <InfoCard style={{ backgroundColor: DEFAULT_COLORS.primary }}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontSize: 16,
    opacity: 0.7,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  formContent: {
    gap: 20,
    paddingVertical: 10,
  },
  fieldContainer: {
    width: "100%",
  },
});
