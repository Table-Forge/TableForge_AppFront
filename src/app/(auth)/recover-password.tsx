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
import { Input } from "@/src/components/input/input";
import { Button } from "@/src/components/button/button";
import LogoIcon from "@/src/assets/images/logo2.png";
import { BrandName } from "@/src/components/brand-name/brand-name";
import {
  IRecoverPassword,
  RecoverPasswordSchema,
} from "@/src/features/users/schemas/user.schema";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Label } from "@/src/components/label/label";

export default function RecoverPasswordScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRecoverPassword>({
    resolver: zodResolver(RecoverPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: IRecoverPassword) => {
    Toast.show({
      type: "success",
      text1: "E-mail enviado com sucesso!",
      text2: "Verifique sua caixa de entrada.",

      position: "top",
      visibilityTime: 3000,
    });
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

          <Text style={styles.text}>
            Digite seu email para que possamos enviar um email de recuperação:
          </Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => {
            return (
              <View style={styles.fieldContainer}>
                <Label text={"Email"} />
                <Input
                  placeholder="Digite seu email"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message?.toString()}
                />
              </View>
            );
          }}
        />

        <Button
          variant="tertiary"
          onPress={handleSubmit(onSubmit)}
          text="Enviar e-mail"
        />

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.navigate("/login")}>
            <Text style={styles.linkText}>Lembrou sua senha? Faça login!</Text>
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
    marginTop: 16,
    opacity: 0.8,
    fontSize: 20,
  },
  text: {
    ...fonts.regular,
    color: DEFAULT_COLORS.white,
    marginTop: 20,
    fontSize: 16,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  linkText: { ...fonts.bold, color: DEFAULT_COLORS.white, fontSize: 14 },
});
