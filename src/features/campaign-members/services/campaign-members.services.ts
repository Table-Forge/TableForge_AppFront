import { api } from "@/src/features/api";
import {
  ICampaignMember,
  ICampaignMemberCreate,
} from "@/src/features/campaign-members/schemas/campaign-member.schema";
import { TOptions } from "@/src/interfaces";

const ENDPOINT = "/api/campaignmembers";

export const CampaignMemberService = {
  getByCampaign: async (campaignId: number): Promise<ICampaignMember[]> => {
    const { data } = await api.get(`${ENDPOINT}/campaign/${campaignId}`);

    return data.items ?? data;
  },
  create: async (
    payload: ICampaignMemberCreate,
  ): Promise<ICampaignMember> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
  getRoleEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/campaign-member-role`);

    return data;
  },
};
