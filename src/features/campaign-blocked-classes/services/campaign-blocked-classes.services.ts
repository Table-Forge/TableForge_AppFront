import { api } from "@/src/features/api";
import {
  ICampaignBlockedClass,
  ICampaignBlockedClassCreate,
} from "@/src/features/campaign-blocked-classes/schemas/campaign-blocked-class.schema";

const ENDPOINT = "/api/campaignblockedclasses";

export const CampaignBlockedClassService = {
  getByCampaign: async (
    campaignId: number,
  ): Promise<ICampaignBlockedClass[]> => {
    const { data } = await api.get(`${ENDPOINT}/campaign/${campaignId}`);

    return data.items ?? data;
  },
  create: async (
    payload: ICampaignBlockedClassCreate,
  ): Promise<ICampaignBlockedClass[]> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
};
