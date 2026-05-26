import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "@/src/components/button/button";
import { BrandName } from "@/src/components/brand-name/brand-name";
import { Input } from "@/src/components/input/input";
import { Label } from "@/src/components/label/label";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import {
  IPasswordRecoveryForm,
  PasswordRecoveryFormSchema,
  RECOVERY_CODE_LENGTH,
} from "@/src/features/users/schemas/auth.schema";
import LogoIcon from "@/src/assets/images/logo2.png";
import { DEFAULT_COLORS } from "@/src/theme/colors";

const normalizeCode = (value: string) =>
  value.replace(/\D/g, "").slice(0, RECOVERY_CODE_LENGTH);

export default function RecoverPasswordScreen() {
  const router = useRouter();
  const {
    sendRecoveryCodeMutation,
    validateRecoveryCodeMutation,
    updateRecoveryPasswordMutation,
  } = useUsersMutation();

  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [lastAttemptedCode, setLastAttemptedCode] = useState("");

  const codeInputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IPasswordRecoveryForm>({
    resolver: zodResolver(PasswordRecoveryFormSchema),
    mode: "onChange",
    defaultValues: {
      step: 1,
      email: "",
      code: "",
      newPassword: "",
    },
  });

  const step = watch("step");
  const email = watch("email");
  const code = normalizeCode(watch("code") ?? "");

  const codeDigits = useMemo(
    () =>
      Array.from({ length: RECOVERY_CODE_LENGTH }, (_, index) => code[index] ?? ""),
    [code],
  );

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 8,
        duration: 35,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -8,
        duration: 35,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 35,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnimation]);

  useEffect(() => {
    if (step !== 2) return;
    if (code.length !== RECOVERY_CODE_LENGTH) return;
    if (validateRecoveryCodeMutation.isPending) return;
    if (!email?.trim()) return;
    if (lastAttemptedCode === code) return;

    setLastAttemptedCode(code);

    validateRecoveryCodeMutation.mutate(
      {
        email: email.trim(),
        code,
      },
      {
        onSuccess: () => {
          setIsCodeInvalid(false);
          clearErrors("code");
          setValue("step", 3, { shouldDirty: false, shouldTouch: false });

          Toast.show({
            type: "success",
            text1: "Código válido",
            text2: "Agora você pode definir sua nova senha.",
            position: "top",
          });
        },
        onError: () => {
          setIsCodeInvalid(true);
          triggerShake();
          setError("code", {
            type: "manual",
            message: "Código inválido. Verifique e tente novamente.",
          });
        },
      },
    );
  }, [
    clearErrors,
    code,
    email,
    lastAttemptedCode,
    setError,
    setValue,
    step,
    triggerShake,
    validateRecoveryCodeMutation,
  ]);

  useEffect(() => {
    if (!isCodeInvalid) return;
    if (code === lastAttemptedCode) return;

    setIsCodeInvalid(false);
    clearErrors("code");
  }, [clearErrors, code, isCodeInvalid, lastAttemptedCode]);

  const onSendCode = handleSubmit(async () => {
    const isValidEmail = await trigger("email");
    if (!isValidEmail) return;

    sendRecoveryCodeMutation.mutate(email.trim(), {
      onSuccess: () => {
        setValue("step", 2, { shouldDirty: false, shouldTouch: false });
        setIsCodeInvalid(false);
        setLastAttemptedCode("");
        setValue("code", "", { shouldDirty: true, shouldTouch: true });
        clearErrors(["code", "newPassword"]);

        Toast.show({
          type: "success",
          text1: "Código enviado!",
          text2: "Confira seu e-mail para continuar.",
          position: "top",
        });

        setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
      },
    });
  });

  const onSavePassword = handleSubmit(async () => {
    setValue("step", 3, { shouldDirty: false, shouldTouch: false });

    const isValid = await trigger(["code", "newPassword"]);
    if (!isValid) return;

    updateRecoveryPasswordMutation.mutate(
      {
        email: email.trim(),
        code,
        newPassword: (watch("newPassword") ?? "").trim(),
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Senha atualizada!",
            text2: "Use a nova senha no próximo login.",
            position: "top",
          });

          router.replace("/login");
        },
      },
    );
  });

  const updateCodeDigit = (index: number, rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    const nextDigits = [...codeDigits];

    if (!digits.length) {
      nextDigits[index] = "";
      setValue("code", nextDigits.join(""), {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    const availableDigits = RECOVERY_CODE_LENGTH - index;
    const chunk = digits.slice(0, availableDigits).split("");

    chunk.forEach((digit, chunkIndex) => {
      nextDigits[index + chunkIndex] = digit;
    });

    setValue("code", nextDigits.join(""), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    const nextFocusIndex = Math.min(
      index + chunk.length,
      RECOVERY_CODE_LENGTH - 1,
    );

    codeInputRefs.current[nextFocusIndex]?.focus();
  };

  const handleCodeKeyPress = (key: string, index: number) => {
    if (key !== "Backspace") return;

    if (!codeDigits[index] && index > 0) {
      const nextDigits = [...codeDigits];
      nextDigits[index - 1] = "";
      setValue("code", nextDigits.join(""), {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const isBusy =
    sendRecoveryCodeMutation.isPending ||
    validateRecoveryCodeMutation.isPending ||
    updateRecoveryPasswordMutation.isPending;

  return (
    <MainContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <Image
                source={LogoIcon}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <BrandName style={styles.title} />
            <ThemedText style={styles.subtitle}>
              Recuperação de senha em 3 etapas.
            </ThemedText>
          </View>

          <View style={styles.formCard}>
            <View style={styles.stepsContainer}>
              {[1, 2, 3].map((item) => {
                const isActive = step === item;
                const isDone = step > item;
                return (
                  <View
                    key={item}
                    style={[
                      styles.stepBar,
                      (isActive || isDone) && styles.stepBarActive,
                    ]}
                  />
                );
              })}
            </View>

            {step === 1 ? (
              <>
                <ThemedText style={styles.instructionText}>
                  Informe seu e-mail para receber o código de recuperação.
                </ThemedText>

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.fieldContainer}>
                      <Label text="E-mail" />
                      <Input
                        placeholder="seu@email.com"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        removeSpaces
                        error={errors.email?.message?.toString()}
                        disabled={isBusy}
                      />
                    </View>
                  )}
                />

                <Button
                  variant="tertiary"
                  onPress={onSendCode}
                  isLoading={sendRecoveryCodeMutation.isPending}
                  text="Enviar código"
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <ThemedText style={styles.instructionText}>
                  Digite os {RECOVERY_CODE_LENGTH} dígitos enviados para {email}.
                </ThemedText>

                <Animated.View
                  style={[
                    styles.codeWrapper,
                    { transform: [{ translateX: shakeAnimation }] },
                  ]}
                >
                  <View style={styles.codeInputRow}>
                    {codeDigits.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(element) => {
                          codeInputRefs.current[index] = element;
                        }}
                        style={[
                          styles.codeInput,
                          isCodeInvalid && styles.codeInputInvalid,
                        ]}
                        value={digit}
                        onChangeText={(value) => updateCodeDigit(index, value)}
                        onKeyPress={({ nativeEvent }) =>
                          handleCodeKeyPress(nativeEvent.key, index)
                        }
                        keyboardType="number-pad"
                        autoComplete="one-time-code"
                        textContentType="oneTimeCode"
                        maxLength={RECOVERY_CODE_LENGTH}
                        editable={!isBusy}
                        selectionColor={DEFAULT_COLORS.tertiary}
                      />
                    ))}
                  </View>

                  {errors.code?.message ? (
                    <ThemedText style={styles.codeErrorText}>
                      {errors.code.message.toString()}
                    </ThemedText>
                  ) : null}
                </Animated.View>

                <View style={styles.stepActions}>
                  <TouchableOpacity
                    onPress={() =>
                      setValue("step", 1, {
                        shouldDirty: false,
                        shouldTouch: false,
                      })
                    }
                    disabled={isBusy}
                  >
                    <ThemedText style={styles.stepLinkText}>Alterar e-mail</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      sendRecoveryCodeMutation.mutate(email.trim(), {
                        onSuccess: () => {
                          Toast.show({
                            type: "success",
                            text1: "Código reenviado!",
                            text2: "Confira novamente seu e-mail.",
                            position: "top",
                          });
                        },
                      })
                    }
                    disabled={isBusy}
                  >
                    <ThemedText style={styles.stepLinkTextHighlight}>
                      Reenviar código
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {validateRecoveryCodeMutation.isPending ? (
                  <ThemedText style={styles.validatingText}>
                    Validando código...
                  </ThemedText>
                ) : null}
              </>
            ) : null}

            {step === 3 ? (
              <>
                <ThemedText style={styles.instructionText}>
                  Código validado. Agora defina sua nova senha.
                </ThemedText>

                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.fieldContainer}>
                      <Label text="Nova senha" />
                      <Input
                        placeholder="Digite sua nova senha"
                        isPassword
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="none"
                        removeSpaces
                        error={errors.newPassword?.message?.toString()}
                        disabled={isBusy}
                      />
                    </View>
                  )}
                />

                <Button
                  variant="tertiary"
                  onPress={onSavePassword}
                  isLoading={updateRecoveryPasswordMutation.isPending}
                  text="Salvar nova senha"
                />
              </>
            ) : null}
          </View>

          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={() => router.navigate("/login")}
              style={styles.backButton}
            >
              <ThemedText style={styles.linkText}>
                Lembrou sua senha?{" "}
                <ThemedText style={styles.linkTextBold}>
                  Voltar para o login
                </ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: DEFAULT_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: DEFAULT_COLORS.tertiary,
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  logoImage: { width: 70, height: 70 },
  title: { fontSize: 32, marginTop: 16 },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
    fontSize: 14,
  },
  formCard: {
    backgroundColor: "rgba(26, 26, 46, 0.85)",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.2)",
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  stepBar: {
    width: 70,
    height: 8,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  stepBarActive: {
    backgroundColor: DEFAULT_COLORS.secondary,
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 22,
    color: DEFAULT_COLORS.grays._100,
    textAlign: "center",
  },
  fieldContainer: {
    width: "100%",
  },
  codeWrapper: {
    gap: 10,
  },
  codeInputRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  codeInput: {
    width: 44,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    color: DEFAULT_COLORS.white,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  codeInputInvalid: {
    borderColor: DEFAULT_COLORS.danger,
    color: DEFAULT_COLORS.danger,
  },
  codeErrorText: {
    textAlign: "center",
    color: DEFAULT_COLORS.danger,
    fontSize: 12,
  },
  stepActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepLinkText: {
    color: DEFAULT_COLORS.grays._100,
    fontSize: 13,
  },
  stepLinkTextHighlight: {
    color: DEFAULT_COLORS.secondary,
    fontSize: 13,
    fontWeight: "700",
  },
  validatingText: {
    textAlign: "center",
    color: DEFAULT_COLORS.grays._100,
    fontSize: 12,
  },
  footerLinks: {
    marginTop: 30,
    alignItems: "center",
  },
  backButton: {
    padding: 10,
  },
  linkText: {
    color: DEFAULT_COLORS.grays._200,
    fontSize: 14,
  },
  linkTextBold: {
    color: DEFAULT_COLORS.tertiary,
    fontWeight: "bold",
  },
});
