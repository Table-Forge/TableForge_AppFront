import { api } from "@/src/features/api";
import {
  IChatMessage,
  IChatMessageCreate,
} from "@/src/features/chat-messages/schemas/chat-message.schema";
import { IPaginatedApiResponse } from "@/src/interfaces";

const ENDPOINT = "/api/chatmessages";

export const ChatMessageService = {
  getByCampaign: async (
    campaignId: number,
  ): Promise<IPaginatedApiResponse<IChatMessage>> => {
    const { data } = await api.get(`${ENDPOINT}/campaign/${campaignId}`);

    return data;
  },
  create: async (payload: IChatMessageCreate): Promise<IChatMessage> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
};
