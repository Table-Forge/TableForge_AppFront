import { api } from "../../api";
import {
  ILoginRequest,
  ILoginResponse,
  LoginResponseSchema,
} from "@/src/features/users/schemas/auth.schema";

const ENDPOINT = "/users";

export const AuthService = {
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const { data } = await api.post(`${ENDPOINT}/authenticate`, null, {
      params: {
        ...credentials,
      },
    });

    return data;
  },
};
