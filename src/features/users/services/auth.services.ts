import { api } from "../../api";
import {
  ILoginRequest,
  ILoginResponse,
} from "@/src/features/users/schemas/auth.schema";

const ENDPOINT = "/users";

const getRecoveryEmailPath = (email: string) => encodeURIComponent(email.trim());

export const AuthService = {
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const { data } = await api.post(`${ENDPOINT}/authenticate`, null, {
      params: {
        ...credentials,
      },
    });

    return data;
  },

  sendRecoveryCode: async (email: string) => {
    const emailPath = getRecoveryEmailPath(email);
    const { data } = await api.put(`${ENDPOINT}/recovery/${emailPath}/send-code`);
    return data;
  },

  validateRecoveryCode: async (email: string, code: string) => {
    const emailPath = getRecoveryEmailPath(email);
    const { data } = await api.put(
      `${ENDPOINT}/recovery/${emailPath}/validate-code`,
      null,
      {
        params: { code, email },
      },
    );
    return data;
  },

  updateRecoveryPassword: async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    const emailPath = getRecoveryEmailPath(email);
    const { data } = await api.put(
      `${ENDPOINT}/recovery/${emailPath}/password`,
      null,
      {
        params: { code, email, newPassword },
      },
    );
    return data;
  },
};
