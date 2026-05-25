import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ControlledDateInput } from "@/src/components/input/input.date.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { Label } from "@/src/components/label/label";
import { ControlledSelect } from "@/src/components/select/select.controlled";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { GENDER_OPTIONS } from "@/src/constants/select-options";
import { useAuth } from "@/src/context/auth";
import { useUser } from "@/src/features/users/hooks/use-user";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import {
  IUserUpdateInput,
  IUserUpdateOutput,
  UserUpdateSchema,
} from "@/src/features/users/schemas/user.schema";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function MyAccountScreen() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const {
    updateAvatarMutation,
    updateUserMutation,
    isUpdatingAvatar,
    isUpdatingUser,
  } = useUsersMutation();
  const userId = user?.id ? Number(user.id) : undefined;
  const { data: userData, isPending: isLoadingUser } = useUser(userId);

  const hookForm = useForm<IUserUpdateInput>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: userData,
  });
  const { handleSubmit, reset } = hookForm;

  React.useEffect(() => {
    if (!userData) return;

    reset(userData);
  }, [reset, userData]);

  const onSubmit: SubmitHandler<IUserUpdateInput> = async (data) => {
    updateUserMutation.mutate(data as IUserUpdateOutput);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <ThemedText style={styles.headerTitle}>Meus Dados</ThemedText>
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
              ALTERAR IDENTIDADE NO REINO
            </ThemedText>
          </View>

          <InfoCard style={styles.formCard}>
            <View style={styles.formContent}>
              <View style={styles.avatarSection}>
                <ControlledImageInput
                  hookForm={hookForm}
                  name="avatarUrl"
                  aspect={[1, 1]}
                  disabled={isLoadingUser}
                  height={170}
                  isLoading={isUpdatingAvatar}
                  placeholder="Toque para selecionar sua foto"
                  valueMode="uri"
                  onImageChange={(image) => {
                    if (!userId) return;
                    updateAvatarMutation.mutate({
                      id: userId,
                      content: image.content,
                    });
                  }}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label
                  text="Nome de Usuário"
                  infoText="Seu @único. Se mudar aqui, outros aventureiros podem ter dificuldade em te achar."
                />
                <ControlledInput
                  hookForm={hookForm}
                  name="username"
                  placeholder="ex.: avalon_mestre"
                  autoCapitalize="none"
                  removeSpaces
                  disabled={isLoadingUser}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label
                  text="Alcunha (Nickname)"
                  infoText="Como as tavernas devem anunciar sua chegada."
                />
                <ControlledInput
                  hookForm={hookForm}
                  name="nickname"
                  placeholder="ex.: Avalon, O Mestre"
                  disabled={isLoadingUser}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label text="Endereço de Mensageiro (E-mail)" />
                <ControlledInput
                  hookForm={hookForm}
                  name="email"
                  placeholder="seu@pergaminho.com"
                  disabled
                  keyboardType="email-address"
                  autoCapitalize="none"
                  removeSpaces
                />
              </View>

              <ControlledDateInput
                hookForm={hookForm}
                name="birthDate"
                label="Ciclos de Vida"
                maxDate={new Date()}
              />

              <View style={styles.fieldContainer}>
                <Label text="Identidade de Gênero" />
                <ControlledSelect
                  hookForm={hookForm}
                  name="gender"
                  options={GENDER_OPTIONS}
                  disabled={isLoadingUser}
                />
              </View>
            </View>
          </InfoCard>

          <Button
            variant="tertiary"
            onPress={handleSubmit(onSubmit)}
            isLoading={isUpdatingUser || isLoadingUser}
            disabled={isLoadingUser}
            text="ATUALIZAR PERGAMINHO"
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
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.2)",
  },
  formContent: {
    gap: 20,
    paddingVertical: 10,
  },
  fieldContainer: {
    width: "100%",
  },
  avatarSection: {
    width: "100%",
    marginBottom: 6,
  },
});
