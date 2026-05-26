import {
  ICampaign,
  ICampaignCreate,
} from "@/src/features/campaigns/schemas/campaign.schema";

import {
  IGetPaginatedParams,
  IPaginatedApiResponse,
  TOptions,
} from "@/src/interfaces";
import { api } from "../../api";

const ENDPOINT = "/campaigns";

type IGetCampaignsParams = IGetPaginatedParams & {
  creatorId?: number;
};

export const CampaignService = {
  getPaginated: async ({
    page = 1,
    size = 20,
    search,
    creatorId,
  }: IGetCampaignsParams = {}): Promise<IPaginatedApiResponse<ICampaign>> => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search, creatorId },
    });

    return data;
  },
  create: async (payload: ICampaignCreate) => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  getById: async (id: number): Promise<ICampaign> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);

    return data;
  },
  getDifficultyLevelEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/difficulty-level`);
    return data;
  },
  getStatusEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/campaign-status`);
    return data;
  },
  update: async (payload: Partial<ICampaign> & { id: number }): Promise<ICampaign> => {
    const { data } = await api.put(ENDPOINT, payload);
    return data;
  },
};
