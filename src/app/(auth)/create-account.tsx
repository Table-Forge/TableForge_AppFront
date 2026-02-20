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
import { SafeAreaView } from "react-native-safe-area-context";
import { Label } from "@/src/components/label/label";

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

  console.log(errors);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: DEFAULT_COLORS.background }}
    >
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
                <View style={styles.fieldContainer}>
                  <Label
                    text={"Nome de Usuário"}
                    infoText={
                      "É o seu identificador único (ex: @mestre_rpg). Use letras, números e underscores. Você usará ele para fazer login."
                    }
                  />
                  <Input
                    placeholder="ex.: avalon_mestre"
                    value={value}
                    onChangeText={onChange}
                    error={errors?.username?.message?.toString()}
                  />
                </View>
              );
            }}
          />

          <Controller
            control={control}
            name="nickname"
            render={({ field: { onChange, value } }) => {
              return (
                <View style={styles.fieldContainer}>
                  <Label
                    text={"Nickname (Apelido)"}
                    infoText={
                      "É como os outros jogadores verão você (ex: Avalon, O Mestre). Pode conter espaços e caracteres especiais."
                    }
                  />
                  <Input
                    placeholder="ex.: Avalon, O Mestre"
                    value={value}
                    onChangeText={onChange}
                    error={errors?.nickname?.message?.toString()}
                  />
                </View>
              );
            }}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => {
              return (
                <View style={styles.fieldContainer}>
                  <Label
                    text={"Endereço de Mansageiro"}
                    infoText="Usaremos este pergaminho para enviar convites de partys e recuperar seu acesso."
                  />
                  <Input
                    placeholder="ex.: avalon@omestre.com"
                    value={value}
                    onChangeText={onChange}
                    error={errors?.email?.message?.toString()}
                  />
                </View>
              );
            }}
          />

          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <DateInput
                label="Ciclos de Vida"
                infoText="Precisamos saber quantos ciclos você já completou no reino para liberar certas tavernas."
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
              <View style={styles.fieldContainer}>
                <Label
                  text={"Palavra-Passe da Guilda"}
                  infoText="Sua senha deve ser forte para proteger seus itens e conquistas! Sugerimos mais de 6 caracteres, além de letras maiúsculas, minúsculas e caracteres especiais."
                />
                <Input
                  placeholder="Qual seu código secreto?"
                  isPassword
                  value={value}
                  onChangeText={onChange}
                  error={errors?.password?.message?.toString()}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <Label text={"Confirmação da Palavra-Passe"} />
                <Input
                  placeholder="Repita o segredo para confirmar..."
                  isPassword
                  value={value}
                  onChangeText={onChange}
                  error={errors?.confirmPassword?.message?.toString()}
                />
              </View>
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
    </SafeAreaView>
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
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 20,
    justifyContent: "center",
    gap: 16,
  },
  fieldContainer: {
    width: "100%",
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
