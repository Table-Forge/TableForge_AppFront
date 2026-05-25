import { api } from "@/src/features/api";
import { IRace } from "@/src/features/races/schemas/race.schema";
import { IGetPaginatedParams, IPaginatedApiResponse } from "@/src/interfaces";

const ENDPOINT = "/races";

export const RaceService = {
  getAll: async ({
    page = 1,
    size = 20,
    search,
  }: IGetPaginatedParams = {}): Promise<IPaginatedApiResponse<IRace>> => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search },
    });

    return data;
  },
};
