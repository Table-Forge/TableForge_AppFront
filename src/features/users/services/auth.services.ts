import { api } from "../../api";
import {
  ILoginRequest,
  ILoginResponse,
  LoginResponseSchema,
} from "@/src/features/users/schemas/auth.schema";

export const AuthService = {
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const { data } = await api.post("/auth/login", credentials);
    return LoginResponseSchema.parse(data);
  },
};
