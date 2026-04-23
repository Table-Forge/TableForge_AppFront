import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COLORS } from "@/src/theme/colors";

import {
  ILoginRequest,
  LoginRequestSchema,
} from "@/src/features/users/schemas/auth.schema";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { Input } from "@/src/components/input/input";
import { Button } from "@/src/components/button/button";
import LogoIcon from "@/src/assets/images/logo2.png";
import { BrandName } from "@/src/components/brand-name/brand-name";
import { useRouter } from "expo-router";
import { Label } from "@/src/components/label/label";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { MainContainer } from "@/src/components/main-container/main-container";

export default function LoginScreen() {
  const { loginMutation, isLoadingLoginMutation } = useUsersMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = async (data: ILoginRequest) => {
    loginMutation.mutate(data);
  };

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
              Identifique-se, aventureiro. Sua party te espera.
            </ThemedText>
          </View>

          <View style={styles.formCard}>
            <Controller
              control={control}
              name="login"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Usuário ou E-mail" />
                  <Input
                    placeholder="Seu nome de herói"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    removeSpaces
                    error={errors.login?.message?.toString()}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Segredo (Senha)" />
                  <Input
                    placeholder="Sua palavra-passe"
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    removeSpaces
                    error={errors.password?.message?.toString()}
                  />
                </View>
              )}
            />

            <Button
              variant="tertiary"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoadingLoginMutation}
              text="INICIAR JORNADA"
            />
          </View>

          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={() => router.navigate("/create-account")}
              style={styles.linkButton}
            >
              <ThemedText style={styles.linkTextPrefix}>
                Novo por aqui?
              </ThemedText>
              <ThemedText style={styles.linkText}>Crie sua conta</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.navigate("/recover-password")}
            >
              <ThemedText style={styles.forgotText}>
                Perdeu seu segredo?
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: DEFAULT_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: DEFAULT_COLORS.tertiary,
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    marginTop: 20,
    color: DEFAULT_COLORS.white,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: "rgba(26, 26, 46, 0.8)",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.2)",
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  fieldContainer: {
    width: "100%",
  },
  loginButton: {
    marginTop: 10,
    height: 56,
  },
  footerLinks: {
    marginTop: 30,
    alignItems: "center",
    gap: 15,
  },
  linkButton: {
    flexDirection: "row",
    gap: 5,
  },
  linkTextPrefix: {
    color: DEFAULT_COLORS.grays._100,
    fontSize: 14,
  },
  linkText: {
    color: DEFAULT_COLORS.tertiary,
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  forgotText: {
    color: DEFAULT_COLORS.grays._300,
    fontSize: 13,
  },
});
