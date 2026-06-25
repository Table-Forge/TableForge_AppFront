import { api } from "@/src/features/api";
import {
  ICampaignAnnouncement,
  ICampaignAnnouncementCreate,
} from "@/src/features/campaign-announcements/schemas/campaign-announcement.schema";
import { IPaginatedApiResponse } from "@/src/interfaces";

const ENDPOINT = "/api/campaignannouncements";

export const CampaignAnnouncementService = {
  getByCampaign: async (
    campaignId: number,
    params?: { page?: number; size?: number },
  ): Promise<IPaginatedApiResponse<ICampaignAnnouncement>> => {
    const { data } = await api.get(`${ENDPOINT}/campaign/${campaignId}`, {
      params,
    });

    return data;
  },
  create: async (
    payload: ICampaignAnnouncementCreate,
  ): Promise<ICampaignAnnouncement> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
};
