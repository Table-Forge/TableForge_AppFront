import {
  View,
  Text,
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
import { fonts } from "@/src/theme/fonts";

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

export default function LoginScreen() {
  const { loginMutation, isLoadingLoginMutation } = useUsersMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: ILoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={LogoIcon}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <BrandName style={styles.title} />
          <Text style={styles.subtitle}>
            Encontre sua party ideal, próxima à você!
          </Text>
        </View>

        <Controller
          control={control}
          name="login"
          render={({ field: { onChange, value } }) => {
            return (
              <View style={styles.fieldContainer}>
                <Label text={"Login"} />
                <Input
                  placeholder="Digite seu login"
                  value={value}
                  onChangeText={onChange}
                  error={errors.login?.message?.toString()}
                />
              </View>
            );
          }}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldContainer}>
              <Label text={"Senha"} />
              <Input
                placeholder="Digite sua senha"
                isPassword
                value={value}
                onChangeText={onChange}
                error={errors.password?.message?.toString()}
              />
            </View>
          )}
        />

        <Button
          variant="tertiary"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoadingLoginMutation}
          text="Entrar"
        />

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.navigate("/create-account")}>
            <Text style={styles.linkText}>Criar conta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate("/recover-password")}
          >
            <Text style={styles.linkText}>Recuperar senha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 100,
    height: 100,
  },
  container: {
    flexGrow: 1,
    backgroundColor: DEFAULT_COLORS.background,
    padding: 30,
    justifyContent: "center",
    gap: 16,
  },
  fieldContainer: {
    width: "100%",
  },
  header: { alignItems: "center", marginBottom: 30 },
  title: {
    fontSize: 36,
    marginTop: 16,
  },
  subtitle: {
    ...fonts.medium,
    color: DEFAULT_COLORS.white,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.8,
    fontSize: 20,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  linkText: { ...fonts.bold, color: DEFAULT_COLORS.white, fontSize: 14 },
});
