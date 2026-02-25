import { api } from "../../api";
import {
  IUpdatePassword,
  IUser,
  UserSchema,
} from "@/src/features/users/schemas/user.schema";

const ENDPOINT = "/users";

export const UserService = {
  getAll: async (): Promise<IUser[]> => {
    const { data } = await api.get(`${ENDPOINT}`);
    return UserSchema.array().parse(data);
  },

  getById: async (id: number): Promise<IUser> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (params: Partial<IUser>) => {
    const { data } = await api.post(`${ENDPOINT}`, params);
    return data;
  },

  update: async (params: IUser) => {
    const { data } = await api.put(`${ENDPOINT}/${params.id}`, {
      params,
    });
    return data;
  },

  updatePassword: async (params: IUpdatePassword) => {
    const { data } = await api.put(
      `${ENDPOINT}/password/${params.userId}`,
      null,
      {
        params: {
          currentPassword: params.currentPassword,
          newPassword: params.newPassword,
        },
      },
    );
    return data;
  },
};
