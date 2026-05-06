import { IGameSystem } from "@/src/features/game-systems/schemas/game-system.schema";
import {
  IGetPaginatedParams,
  IPaginatedApiResponse,
} from "@/src/interfaces";
import { api } from "../../api";

const ENDPOINT = "/gamesystems";

type IGetGameSystemsParams = IGetPaginatedParams & {
  enabled?: boolean;
};

export const GameSystemService = {
  getAll: async ({
    enabled: _enabled,
    ...params
  }: IGetGameSystemsParams = {}): Promise<
    IPaginatedApiResponse<IGameSystem>
  > => {
    const { data } = await api.get(ENDPOINT, {
      params,
    });

    return data;
  },
};
