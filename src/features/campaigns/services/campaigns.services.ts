import {
  ICampaign,
  ICampaignCreate,
  ICampaignPlayer,
} from "@/src/features/campaigns/schemas/campaign.schema";

import {
  IEnumOption,
  IGetPaginatedParams,
  IPaginatedApiResponse,
  TOptions,
} from "@/src/interfaces";
import { api } from "../../api";

const ENDPOINT = "/campaigns";

type IGetCampaignsParams = IGetPaginatedParams & {
  creatorId?: number;
};

type IPlayerSearchParams = IGetPaginatedParams & {
  filter?: string[];
  userId?: number;
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
  getRelationshipEnum: async (): Promise<IEnumOption[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/campaign-relationship`);
    return data;
  },
  searchPlayerCampaigns: async ({
    page = 1,
    size = 20,
    search,
    filter,
    userId,
  }: IPlayerSearchParams = {}): Promise<IPaginatedApiResponse<ICampaignPlayer>> => {
    const { data } = await api.post(
      `${ENDPOINT}/player/search`,
      { search, filter, userId },
      { params: { page, size } },
    );

    return data;
  },
  update: async (payload: Partial<ICampaign> & { id: number }): Promise<ICampaign> => {
    const { data } = await api.put(ENDPOINT, payload);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);
    return data;
  },
};
