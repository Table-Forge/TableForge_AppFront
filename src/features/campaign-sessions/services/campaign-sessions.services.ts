import { api } from "@/src/features/api";
import {
  ICampaignSession,
  ICampaignSessionCreate,
} from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { IGetPaginatedParams, IPaginatedApiResponse } from "@/src/interfaces";

const ENDPOINT = "/campaignsessions";

export const CampaignSessionService = {
  getPaginated: async ({
    page = 1,
    size = 20,
    search,
  }: IGetPaginatedParams = {}): Promise<
    IPaginatedApiResponse<ICampaignSession>
  > => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search },
    });

    return data;
  },
  getById: async (id: number): Promise<ICampaignSession> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);

    return data;
  },
  create: async (
    payload: ICampaignSessionCreate,
  ): Promise<ICampaignSession> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  update: async (payload: ICampaignSession): Promise<ICampaignSession> => {
    const { data } = await api.put(ENDPOINT, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
};
