import { View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { Input } from "@/src/components/input/input";
import { PasswordRequirements } from "@/src/components/input/password-requirements";
import { Button } from "@/src/components/button/button";
import { Label } from "@/src/components/label/label";
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
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";

export default function PasswordAndSecurityScreen() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const { updatePasswordMutation, isUpdatingPassword } = useUsersMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdatePassword>({
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
          <ThemedText style={styles.headerTitle}>Senha e Segurança</ThemedText>
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
              Alterar Palavra-Passe
            </ThemedText>
          </View>

          <InfoCard style={styles.formCard}>
            <View style={styles.formContent}>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Label
                      text="Segredo Atual"
                      infoText="Digite sua palavra-passe atual para provar que você é o dono desta guilda."
                    />
                    <Input
                      placeholder="Qual seu segredo atual?"
                      isPassword
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      removeSpaces
                      error={errors?.currentPassword?.message?.toString()}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Label
                      text="Novo Segredo da Guilda"
                      infoText="Sua nova senha deve ser robusta! Use símbolos e números para evitar invasores."
                    />
                    <Input
                      placeholder="Digite o novo segredo..."
                      isPassword
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      error={errors?.newPassword?.message?.toString()}
                    />
                    <PasswordRequirements value={value} />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Label text="Confirmação do Segredo" />
                    <Input
                      placeholder="Repita o novo segredo..."
                      isPassword
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      error={errors?.confirmPassword?.message?.toString()}
                    />
                  </View>
                )}
              />
            </View>
          </InfoCard>

          <Button
            variant="tertiary"
            onPress={handleSubmit(onSubmit)}
            isLoading={isUpdatingPassword}
            text="Forjar nova senha"
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
