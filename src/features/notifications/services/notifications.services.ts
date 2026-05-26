import {
  INotification,
  INotificationCreate,
  INotificationUpdate,
} from "@/src/features/notifications/schemas/notification.schema";
import {
  IGetPaginatedParams,
  IPaginatedApiResponse,
  TOptions,
} from "@/src/interfaces";
import { api } from "@/src/features/api";

const ENDPOINT = "/api/notifications";

type IGetUserNotificationsParams = IGetPaginatedParams & {
  read?: boolean;
  userId: number;
};

export const NotificationService = {
  getByUser: async ({
    userId,
    page = 1,
    size = 20,
    read,
  }: IGetUserNotificationsParams): Promise<
    IPaginatedApiResponse<INotification>
  > => {
    const { data } = await api.get(`${ENDPOINT}/user/${userId}`, {
      params: { page, size, read },
    });

    return data;
  },
  create: async (
    payload: INotificationCreate,
  ): Promise<INotification> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  update: async (
    payload: INotificationUpdate,
  ): Promise<INotification> => {
    const { data } = await api.put(`${ENDPOINT}/${payload.id}`, payload);

    return data;
  },
  markAsRead: async (id: number) => {
    const { data } = await api.put(`${ENDPOINT}/${id}/read`);

    return data;
  },
  markAllAsRead: async (userId: number) => {
    const { data } = await api.put(`${ENDPOINT}/user/${userId}/read-all`);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
  getTypeEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/notification-type`);

    return data;
  },
};
