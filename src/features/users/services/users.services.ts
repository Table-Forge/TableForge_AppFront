import { api } from "../../api";
import {
  IUpdatePassword,
  IUser,
  IUserAvatarPayload,
  IUserUpdateOutput,
  UserSchema,
} from "@/src/features/users/schemas/user.schema";
import { TOptions } from "@/src/interfaces";

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

  getFromApp: async (id: number): Promise<IUser> => {
    const { data } = await api.get(`${ENDPOINT}/from-app/${id}`);
    return data;
  },

  create: async (params: Partial<IUser>) => {
    const { data } = await api.post(`${ENDPOINT}`, params);
    return data;
  },

  update: async (payload: IUserUpdateOutput) => {
    const { data } = await api.put(`${ENDPOINT}/profile`, payload);
    return data;
  },

  updateAvatar: async (payload: IUserAvatarPayload) => {
    const formData = new FormData();
    formData.append("Id", String(payload.id));
    formData.append("File", payload.file as unknown as Blob);

    const { data } = await api.request({
      url: `${ENDPOINT}/avatar`,
      method: "PUT",
      data: formData,
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

  getGenderEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/user-gender`);
    return data;
  },

  getStatusEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/user-status`);
    return data;
  },

  getDeliveryMethodEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/delivery-method`);
    return data;
  },

  getTypeEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/user-type`);
    return data;
  },
};
