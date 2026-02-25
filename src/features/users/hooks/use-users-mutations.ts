import { useMutation } from "@tanstack/react-query";
import { ILoginRequest, ILoginResponse } from "../schemas/auth.schema";
import { useAuth } from "@/src/context/auth";
import { AuthService } from "@/src/features/users/services/auth.services";
import { UserService } from "@/src/features/users/services/users.services";
import {
  IUpdatePassword,
  IUser,
} from "@/src/features/users/schemas/user.schema";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export const useUsersMutation = () => {
  const { signIn } = useAuth();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (credentials: ILoginRequest) => AuthService.login(credentials),
    onSuccess: async (data: ILoginResponse) => {
      await signIn(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.Message || "Credenciais inválidas";

      Toast.show({
        type: "error",
        text1: "Erro de Autenticação",
        text2: message,
      });
    },
  });

  const newUserMutation = useMutation({
    mutationFn: (data: IUser) => UserService.create(data),
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Cadastro concluído! 🎉",
        text2:
          "Sua conta foi criada com sucesso. Faça login para acessar sua conta!",
        position: "top",
        visibilityTime: 4000,
      });

      router.replace("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.Message || "Erro ao criar conta";
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: message,
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: IUpdatePassword) => UserService.updatePassword(data),
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Senha alterada com sucesso! 🎉",
        text2:
          "Sua senha foi com sucesso! No seu próximo acesso, você já poderá usar sua nova senha.",
        position: "top",
        visibilityTime: 4000,
      });
    },
    onError: (error: any) => {
      console.log("error", error.response);
      const message = error.response?.data?.Message || "Erro ao alterar senha.";
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: message,
      });
    },
  });

  return {
    loginMutation,
    isLoadingLoginMutation: loginMutation.isPending,
    newUserMutation,
    isLoadingNewUserMutation: newUserMutation.isPending,
    updatePasswordMutation,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
};
