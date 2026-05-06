import React from "react";
import {
  ActivityIndicator,
  Image,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { useAvatarPicker } from "@/src/features/users/hooks/use-avatar-picker";
import { useUser } from "@/src/features/users/hooks/use-user";
import { Input } from "@/src/components/input/input";
import { DateInput } from "@/src/components/input/input.date";
import { Button } from "@/src/components/button/button";
import { Label } from "@/src/components/label/label";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { ActionButton } from "@/src/components/action-button/action-button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { InfoCard } from "@/src/components/info-card/info-card";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { useAuth } from "@/src/context/auth";
import { KnightHeadIcon } from "@/src/components/icons";
import {
  IUserUpdateInput,
  IUserUpdateOutput,
  UserUpdateSchema,
} from "@/src/features/users/schemas/user.schema";
import { Select } from "@/src/components/select/select";
import { GENDER_OPTIONS } from "@/src/constants/select-options";

export default function MyAccountScreen() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const { updateUserMutation, isUpdatingUser } = useUsersMutation();
  const userId = user?.id ? Number(user.id) : undefined;
  const { data: userData, isPending: isLoadingUser } = useUser(userId);

  const [avatarPreview, setAvatarPreview] = React.useState<string>();
  const { selectAvatar, isUpdatingAvatar } = useAvatarPicker({
    userId,
    onPreview: setAvatarPreview,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserUpdateInput>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: userData,
  });

  React.useEffect(() => {
    if (!userData) return;

    reset(userData);
  }, [reset, userData]);

  const onSubmit: SubmitHandler<IUserUpdateInput> = async (data) => {
    updateUserMutation.mutate(data as IUserUpdateOutput);
  };

  const currentAvatar = avatarPreview ?? userData?.avatarUrl;

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
                <Pressable
                  onPress={selectAvatar}
                  disabled={isUpdatingAvatar}
                  style={({ pressed }) => [
                    styles.avatarButton,
                    pressed && styles.avatarButtonPressed,
                  ]}
                >
                  {currentAvatar ? (
                    <Image
                      source={{ uri: currentAvatar }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <KnightHeadIcon
                        color={DEFAULT_COLORS.primary}
                        size={62}
                      />
                    </View>
                  )}

                  <View style={styles.avatarEditBadge}>
                    {isUpdatingAvatar ? (
                      <ActivityIndicator
                        size="small"
                        color={DEFAULT_COLORS.white}
                      />
                    ) : (
                      <Ionicons
                        name="camera"
                        size={18}
                        color={DEFAULT_COLORS.white}
                      />
                    )}
                  </View>
                </Pressable>
              </View>

              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Label
                      text="Nome de Usuário"
                      infoText="Seu @único. Se mudar aqui, outros aventureiros podem ter dificuldade em te achar."
                    />
                    <Input
                      placeholder="ex.: avalon_mestre"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      removeSpaces
                      disabled={isLoadingUser}
                      error={errors?.username?.message}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="nickname"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Label
                      text="Alcunha (Nickname)"
                      infoText="Como as tavernas devem anunciar sua chegada."
                    />
                    <Input
                      placeholder="ex.: Avalon, O Mestre"
                      value={value}
                      onChangeText={onChange}
                      disabled={isLoadingUser}
                      error={errors?.nickname?.message}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Label text="Endereço de Mensageiro (E-mail)" />
                    <Input
                      placeholder="seu@pergaminho.com"
                      disabled
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      removeSpaces
                      error={errors?.email?.message}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <DateInput
                    label="Ciclos de Vida"
                    value={value}
                    onChange={onChange}
                    error={errors?.birthDate?.message}
                    maxDate={new Date()}
                  />
                )}
              />

              <Controller
                control={control}
                name="gender"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View style={styles.fieldContainer}>
                    <Label text="Identidade de Gênero" />
                    <Select
                      value={value}
                      onSelect={onChange}
                      error={error?.message}
                      options={GENDER_OPTIONS}
                      disabled={isLoadingUser}
                    />
                  </View>
                )}
              />
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
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  avatarButton: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 3,
    borderColor: DEFAULT_COLORS.tertiary,
    backgroundColor: DEFAULT_COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 58,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.background,
  },
  avatarEditBadge: {
    position: "absolute",
    right: 0,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: DEFAULT_COLORS.tertiary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: DEFAULT_COLORS.primary,
  },
});
