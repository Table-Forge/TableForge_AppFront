import { api } from "@/src/features/api";
import {
  IFriendship,
  IFriendshipCreate,
  IFriendshipUpdate,
} from "@/src/features/friendships/schemas/friendship.schema";
import {
  IGetPaginatedParams,
  IPaginatedApiResponse,
  TOptions,
} from "@/src/interfaces";

const ENDPOINT = "/api/friendships";

type IGetUserFriendshipsParams = IGetPaginatedParams & {
  status?: string;
};

export const FriendshipService = {
  getStatusEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/friendship-status`);

    return data;
  },
  getById: async (id: number): Promise<IFriendship> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);

    return data;
  },
  getByUser: async (
    userId: number,
    { page = 1, size = 50, status }: IGetUserFriendshipsParams = {},
  ): Promise<IPaginatedApiResponse<IFriendship>> => {
    const { data } = await api.get(`${ENDPOINT}/user/${userId}`, {
      params: { page, size, status },
    });

    return data;
  },
  create: async (payload: IFriendshipCreate): Promise<IFriendship> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  update: async (payload: IFriendshipUpdate): Promise<IFriendship> => {
    const { data } = await api.put(`${ENDPOINT}/${payload.id}`, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
};
