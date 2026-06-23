import { api } from "@/src/features/api";
import { IPaginatedApiResponse } from "@/src/interfaces";
import {
  IConversation,
  IConversationMessage,
  IConversationMessageCreate,
  ICreateDirectConversationDto,
} from "../schemas/conversation.schema";

const ENDPOINT = "/api/v1/conversations";

export const ConversationService = {
  getAll: async (params: {
    page: number;
    size: number;
  }): Promise<IPaginatedApiResponse<IConversation>> => {
    const { data } = await api.get(ENDPOINT, { params });
    return data;
  },

  createDirect: async (
    payload: ICreateDirectConversationDto,
  ): Promise<IConversation> => {
    const { data } = await api.post(ENDPOINT, payload);
    return data;
  },

  getMessages: async (
    conversationId: number,
    params: { page: number; size: number },
  ): Promise<IPaginatedApiResponse<IConversationMessage>> => {
    const { data } = await api.get(`${ENDPOINT}/${conversationId}/messages`, {
      params,
    });
    return data;
  },

  sendMessage: async (
    conversationId: number,
    payload: IConversationMessageCreate,
  ): Promise<IConversationMessage> => {
    const { data } = await api.post(
      `${ENDPOINT}/${conversationId}/messages`,
      payload,
    );
    return data;
  },

  markAsRead: async (conversationId: number): Promise<void> => {
    await api.post(`${ENDPOINT}/${conversationId}/read`);
  },
};
