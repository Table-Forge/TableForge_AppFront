import { api } from "@/src/features/api";
import {
  IJoinRequest,
  IJoinRequestCreate,
  IJoinRequestStatusUpdate,
} from "@/src/features/join-requests/schemas/join-request.schema";
import {
  IGetPaginatedParams,
  IPaginatedApiResponse,
  TOptions,
} from "@/src/interfaces";

const ENDPOINT = "/api/joinrequests";

export const JoinRequestService = {
  getById: async (id: number): Promise<IJoinRequest> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);

    return data;
  },
  getByCampaign: async (
    campaignId: number,
    { page = 1, size = 20 }: IGetPaginatedParams = {},
  ): Promise<IPaginatedApiResponse<IJoinRequest>> => {
    const { data } = await api.get(`${ENDPOINT}/campaign/${campaignId}`, {
      params: { page, size },
    });

    return data;
  },
  create: async (payload: IJoinRequestCreate): Promise<IJoinRequest> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  updateStatus: async (
    payload: IJoinRequestStatusUpdate,
  ): Promise<IJoinRequest> => {
    const { id, status } = payload;
    const { data } = await api.put(`${ENDPOINT}/${id}/status`, { status });

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
