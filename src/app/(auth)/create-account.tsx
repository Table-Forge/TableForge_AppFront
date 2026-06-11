import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { Input } from "@/src/components/input/input";
import { PasswordRequirements } from "@/src/components/input/password-requirements";
import { Button } from "@/src/components/button/button";
import LogoIcon from "@/src/assets/images/logo2.png";
import { BrandName } from "@/src/components/brand-name/brand-name";
import { useRouter } from "expo-router";
import { IUser, UserSchema } from "@/src/features/users/schemas/user.schema";
import { DateInput } from "@/src/components/input/input.date";
import { Label } from "@/src/components/label/label";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";

export default function CreateAccountScreen() {
  const { newUserMutation, isLoadingNewUserMutation } = useUsersMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      nickname: "",
      email: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: IUser) => {
    newUserMutation.mutate(data);
  };

  return (
    <Screen keyboardAware>
      <Screen.Body
        scroll
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
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
              Sua jornada épica começa com um simples registro no pergaminho.
            </ThemedText>
          </View>

          <View style={styles.formCard}>
            <ThemedText weight="bold" style={styles.sectionTitle}>
              Dados do aventureiro
            </ThemedText>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label
                    text="Nome de Usuário"
                    infoText="Seu @único no reino. Use letras, números e underscores."
                  />
                  <Input
                    placeholder="ex.: avalon_mestre"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    removeSpaces
                    error={errors?.username?.message?.toString()}
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
                    text="Nickname (Alcunha)"
                    infoText="Como você será chamado nas tavernas e mesas."
                  />
                  <Input
                    placeholder="ex.: Avalon, O Mestre"
                    value={value}
                    onChangeText={onChange}
                    error={errors?.nickname?.message?.toString()}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Endereço de Mensageiro" />
                  <Input
                    placeholder="seu@pergaminho.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    removeSpaces
                    error={errors?.email?.message?.toString()}
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

            <View style={styles.divider} />

            <ThemedText weight="bold" style={styles.sectionTitle}>
              Segredos da conta
            </ThemedText>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Label text="Palavra-Passe" />
                  <Input
                    placeholder="Proteja seus tesouros..."
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    error={errors?.password?.message?.toString()}
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
                  <Label text="Confirmar Segredo" />
                  <Input
                    placeholder="Repita a palavra-passe"
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    error={errors?.confirmPassword?.message?.toString()}
                  />
                </View>
              )}
            />

            <Button
              variant="tertiary"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoadingNewUserMutation}
              text="Registrar herói"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.navigate("/login")}
            style={styles.footerLink}
          >
            <ThemedText style={styles.footerText}>
              Já é da guilda?{" "}
              <ThemedText style={styles.footerLinkBold}>Faça login!</ThemedText>
            </ThemedText>
          </TouchableOpacity>
      </Screen.Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: SURFACES.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDERS.highlightStrong,
    shadowColor: DEFAULT_COLORS.purpleBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  logoImage: { width: 60, height: 60 },
  title: { fontSize: 28, marginTop: 15, color: DEFAULT_COLORS.white },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    color: DEFAULT_COLORS.textMutedLight,
    fontSize: 14,
    paddingHorizontal: 30,
  },
  formCard: {
    backgroundColor: SURFACES.card,
    borderRadius: RADII.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    gap: 16,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  fieldContainer: { width: "100%" },
  divider: {
    height: 1,
    backgroundColor: BORDERS.divider,
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 10,
    height: 56,
  },
  footerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: DEFAULT_COLORS.textMutedLight,
    fontSize: 14,
  },
  footerLinkBold: {
    color: DEFAULT_COLORS.purpleBright,
    fontWeight: "bold",
  },
});
