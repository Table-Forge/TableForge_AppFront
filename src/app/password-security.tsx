import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { Input } from "@/src/components/input/input";
import { Button } from "@/src/components/button/button";
import { Label } from "@/src/components/label/label";
import { MainContainer } from "@/src/components/main-container/main-container";
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
    <MainContainer>
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
          <ThemedText style={styles.headerTitle}>Senha e Segurança</ThemedText>
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
              Alterar Palavra-Passe
            </ThemedText>
          </View>

          <InfoCard style={{ backgroundColor: DEFAULT_COLORS.primary }}>
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
                      error={errors?.newPassword?.message?.toString()}
                    />
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
            text="Forjar Nova Senha"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: DEFAULT_COLORS.white,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
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
    fontWeight: "bold",
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
