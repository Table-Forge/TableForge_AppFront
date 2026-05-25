import { api } from "@/src/features/api";
import { IClass } from "@/src/features/classes/schemas/class.schema";
import { IGetPaginatedParams, IPaginatedApiResponse } from "@/src/interfaces";

const ENDPOINT = "/classes";

export const ClassService = {
  getAll: async ({
    page = 1,
    size = 20,
    search,
  }: IGetPaginatedParams = {}): Promise<IPaginatedApiResponse<IClass>> => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search },
    });

    return data;
  },
};
