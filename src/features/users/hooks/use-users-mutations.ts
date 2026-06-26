import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ILoginRequest, ILoginResponse } from "../schemas/auth.schema";
import { useAuth } from "@/src/context/auth";
import { AuthService } from "@/src/features/users/services/auth.services";
import { UserService } from "@/src/features/users/services/users.services";
import {
  IUpdatePassword,
  IUser,
  IUserAvatarPayload,
  IUserUpdateOutput,
} from "@/src/features/users/schemas/user.schema";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { USER_KEYS } from "./query-key";

type TValidateRecoveryCodeParams = {
  email: string;
  code: string;
};

type TUpdateRecoveryPasswordParams = {
  email: string;
  code: string;
  newPassword: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as {
    response?: {
      status?: number;
      data?: { Message?: string; message?: string };
    };
    status?: number;
    data?: { Message?: string; message?: string };
    Message?: string;
    message?: string;
  };

  if ((err?.response?.status ?? err?.status) === 413) {
    return "Imagem muito grande. O tamanho máximo é de 2 MB.";
  }

  const backendMessage =
    err?.response?.data?.Message ??
    err?.response?.data?.message ??
    err?.data?.Message ??
    err?.data?.message ??
    err?.Message;

  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

export const useUsersMutation = () => {
  const { signIn } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: ILoginRequest) => AuthService.login(credentials),
    onSuccess: async (data: ILoginResponse) => {
      await signIn(data);
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Credenciais inválidas");

      Toast.show({
        type: "error",
        text1: "Erro de autenticação",
        text2: message,
      });
    },
  });

  const newUserMutation = useMutation({
    mutationFn: (data: IUser) => UserService.create(data),
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Cadastro concluído!",
        text2: "Sua conta foi criada com sucesso. Faça login para acessar.",
        position: "top",
        visibilityTime: 4000,
      });

      router.replace("/login");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Erro ao criar conta");
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: message,
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: IUserUpdateOutput) => UserService.update(data),
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Edição concluída!",
        text2: "Seus dados foram editados com sucesso!",
        position: "top",
        visibilityTime: 4000,
      });

      router.back();
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Erro ao editar conta");
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: message,
      });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (data: IUserAvatarPayload) => UserService.updateAvatar(data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: USER_KEYS.byId(variables.id) });

      Toast.show({
        type: "success",
        text1: "Imagem atualizada!",
        text2: "Sua foto de perfil foi salva com sucesso.",
        position: "top",
        visibilityTime: 4000,
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Não foi possível atualizar a imagem de perfil.",
      );
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
        text1: "Senha alterada com sucesso!",
        text2: "No próximo acesso, você já poderá usar sua nova senha.",
        position: "top",
        visibilityTime: 4000,
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Erro ao alterar senha.");
      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: message,
      });
    },
  });

  const sendRecoveryCodeMutation = useMutation({
    mutationFn: (email: string) => AuthService.sendRecoveryCode(email),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Não foi possível enviar o código.");
      Toast.show({
        type: "error",
        text1: "Falha ao enviar código",
        text2: message,
      });
    },
  });

  const validateRecoveryCodeMutation = useMutation({
    mutationFn: (params: TValidateRecoveryCodeParams) =>
      AuthService.validateRecoveryCode(params.email, params.code),
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Código inválido.");
      Toast.show({
        type: "error",
        text1: "Código inválido",
        text2: message,
      });
    },
  });

  const updateRecoveryPasswordMutation = useMutation({
    mutationFn: (params: TUpdateRecoveryPasswordParams) =>
      AuthService.updateRecoveryPassword(
        params.email,
        params.code,
        params.newPassword,
      ),
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Não foi possível atualizar a senha.",
      );
      Toast.show({
        type: "error",
        text1: "Falha ao atualizar senha",
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
    updateUserMutation,
    isUpdatingUser: updateUserMutation.isPending,
    updateAvatarMutation,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    sendRecoveryCodeMutation,
    isSendingRecoveryCode: sendRecoveryCodeMutation.isPending,
    validateRecoveryCodeMutation,
    isValidatingRecoveryCode: validateRecoveryCodeMutation.isPending,
    updateRecoveryPasswordMutation,
    isUpdatingRecoveryPassword: updateRecoveryPasswordMutation.isPending,
  };
};
