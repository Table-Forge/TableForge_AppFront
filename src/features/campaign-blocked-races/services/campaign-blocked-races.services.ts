import { api } from "@/src/features/api";
import {
  ICampaignBlockedRace,
  ICampaignBlockedRaceCreate,
} from "@/src/features/campaign-blocked-races/schemas/campaign-blocked-race.schema";

const ENDPOINT = "/api/campaignblockedraces";

export const CampaignBlockedRaceService = {
  getByCampaign: async (campaignId: number): Promise<ICampaignBlockedRace[]> => {
    const { data } = await api.get(`${ENDPOINT}/campaign/${campaignId}`);

    return data.items ?? data;
  },
  create: async (
    payload: ICampaignBlockedRaceCreate,
  ): Promise<ICampaignBlockedRace[]> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
};
