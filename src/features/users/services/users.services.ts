import { api } from "../../api";
import { IUser, UserSchema } from "@/src/features/users/schemas/user.schema";

export const UserService = {
  getAll: async (): Promise<IUser[]> => {
    const { data } = await api.get("/users");
    return UserSchema.array().parse(data);
  },

  getById: async (id: string): Promise<IUser> => {
    const { data } = await api.get(`/users/${id}`);
    return UserSchema.parse(data);
  },

  update: async (id: string, userData: Partial<IUser>) => {
    const { data } = await api.patch(`/users/${id}`, userData);
    return data;
  },
};
