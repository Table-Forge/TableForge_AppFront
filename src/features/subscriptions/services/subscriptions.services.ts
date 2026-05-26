import { api } from "@/src/features/api";
import { TOptions } from "@/src/interfaces";

const ENDPOINT = "/api/subscriptions";

export const SubscriptionService = {
  getTypeEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/subscription-type`);

    return data;
  },
};
