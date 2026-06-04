import React from "react";
import { StyleSheet, View } from "react-native";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ControlledDateInput } from "@/src/components/input/input.date.controlled";
import { ControlledImageInput } from "@/src/components/input/input.image.controlled";
import { ControlledInput } from "@/src/components/input/input.controlled";
import { Label } from "@/src/components/label/label";
import { Screen } from "@/src/components/screen/screen";
import { ControlledSelect } from "@/src/components/select/select.controlled";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useUserGenderEnum } from "@/src/features/users/hooks/enums/use-user-gender-enum";
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
import { BORDERS, SURFACES } from "@/src/theme/tokens";
import { MAX_AVATAR_SIZE_BYTES } from "@/src/utils/image";

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
  const { userGenderEnum, isLoadingUserGenderEnum } = useUserGenderEnum();

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
          <ThemedText style={styles.headerTitle}>Meus Dados</ThemedText>
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
              Alterar identidade no reino
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
                  maxSizeBytes={MAX_AVATAR_SIZE_BYTES}
                  placeholder="Toque para selecionar sua foto"
                  valueMode="uri"
                  onImageChange={(image) => {
                    if (!userId) return;
                    updateAvatarMutation.mutate({
                      id: userId,
                      file: image.file,
                    });
                  }}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Label
                  text="Nome de Usuário"
                  infoText="Seu @único. Ele não pode ser alterado depois da criação da conta."
                />
                <ControlledInput
                  hookForm={hookForm}
                  name="username"
                  placeholder="ex.: avalon_mestre"
                  autoCapitalize="none"
                  removeSpaces
                  disabled
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
                  options={userGenderEnum}
                  disabled={isLoadingUser || isLoadingUserGenderEnum}
                />
              </View>
            </View>
          </InfoCard>

          <Button
            variant="tertiary"
            onPress={handleSubmit(onSubmit)}
            isLoading={isUpdatingUser || isLoadingUser}
            disabled={isLoadingUser}
            text="Atualizar pergaminho"
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
    fontSize: 12,
    letterSpacing: 2,
    ...fonts.bold,
    color: DEFAULT_COLORS.purpleBright,
    textTransform: "uppercase",
  },
  formCard: {
    backgroundColor: SURFACES.card,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
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
