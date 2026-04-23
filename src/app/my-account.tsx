import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserUpdateInput>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      id: user?.id,
      username: user?.username ?? "",
      nickname: user?.nickname ?? "",
      email: user?.email ?? "",
      birthDate: user?.birthDate ? new Date(user.birthDate).toISOString() : "",
    },
  });

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
                    />
                  </View>
                )}
              />
            </View>
          </InfoCard>

          <Button
            variant="tertiary"
            onPress={handleSubmit(onSubmit)}
            isLoading={isUpdatingUser}
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
});
