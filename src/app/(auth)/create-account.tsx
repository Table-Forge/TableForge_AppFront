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
import { useUsersMutation } from "@/src/features/users/hooks/use-users-mutations";
import { Input } from "@/src/components/input/input";
import { Button } from "@/src/components/button/button";
import LogoIcon from "@/src/assets/images/logo2.png";
import { BrandName } from "@/src/components/brand-name/brand-name";
import { useRouter } from "expo-router";
import { IUser, UserSchema } from "@/src/features/users/schemas/user.schema";
import { DateInput } from "@/src/components/input/input.date";

export default function CreateAccountScreen() {
  const { newUserMutation, isLoadingNewUserMutation } = useUsersMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = async (data: IUser) => {
    newUserMutation.mutate(data);
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
            Crie sua conta e encontre sua party ideal, próxima à você!
          </Text>
        </View>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => {
            return (
              <Input
                label="Nome de Usuário"
                placeholder="Digite seu nome de usuário"
                value={value}
                onChangeText={onChange}
                error={errors?.username?.message?.toString()}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, value } }) => (
            <DateInput
              label="Data de Nascimento"
              value={value}
              onChange={onChange}
              error={errors?.birthDate?.message}
              maxDate={new Date()}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              isPassword
              value={value}
              onChangeText={onChange}
              error={errors?.password?.message?.toString()}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Confirme a Senha"
              placeholder="Digite a confirmação"
              isPassword
              value={value}
              onChangeText={onChange}
              error={errors?.confirmPassword?.message?.toString()}
            />
          )}
        />

        <Button
          variant="tertiary"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoadingNewUserMutation}
          text="Criar Conta"
        />
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.navigate("/login")}>
            <Text style={styles.linkText}>
              Já possui uma conta? Faça login!
            </Text>
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
  },
  header: { alignItems: "center", marginBottom: 20 },
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
