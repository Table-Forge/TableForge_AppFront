import { api } from "@/src/features/api";
import {
  IJoinRequest,
  IJoinRequestCreate,
  IJoinRequestStatusUpdate,
} from "@/src/features/join-requests/schemas/join-request.schema";
import { IPaginatedApiResponse, TOptions } from "@/src/interfaces";

const ENDPOINT = "/api/joinrequests";

export const JoinRequestService = {
  getById: async (id: number): Promise<IJoinRequest> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);

    return data;
  },
  getByCampaign: async (
    campaignId: number,
  ): Promise<IPaginatedApiResponse<IJoinRequest>> => {
    const { data } = await api.get(`${ENDPOINT}/campaign/${campaignId}`);

    return data;
  },
  create: async (payload: IJoinRequestCreate): Promise<IJoinRequest> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  updateStatus: async (
    payload: IJoinRequestStatusUpdate,
  ): Promise<IJoinRequest> => {
    const { data } = await api.put(`${ENDPOINT}/${payload.id}/status`, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
  getStatusEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/join-request-status`);

    return data;
  },
};
