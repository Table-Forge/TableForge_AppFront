import { api } from "@/src/features/api";
import { TOptions } from "@/src/interfaces";

const ENDPOINT = "/api/friendships";

export const FriendshipService = {
  getStatusEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/friendship-status`);

    return data;
  },
};
