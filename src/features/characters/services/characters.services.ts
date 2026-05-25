import {
  ICharacter,
  ICharacterCreate,
} from "@/src/features/characters/schemas/character.schema";
import { IGetPaginatedParams, IPaginatedApiResponse } from "@/src/interfaces";
import { api } from "@/src/features/api";

const ENDPOINT = "/api/characters";

export const CharacterService = {
  getPaginated: async ({
    page = 1,
    size = 20,
    search,
  }: IGetPaginatedParams = {}): Promise<IPaginatedApiResponse<ICharacter>> => {
    const { data } = await api.get(ENDPOINT, {
      params: { page, size, search },
    });

    return data;
  },
  getById: async (id: number): Promise<ICharacter> => {
    const { data } = await api.get(`${ENDPOINT}/${id}`);

    return data;
  },
  create: async (payload: ICharacterCreate): Promise<ICharacter> => {
    const { data } = await api.post(ENDPOINT, payload);

    return data;
  },
  update: async (payload: ICharacter): Promise<ICharacter> => {
    const { data } = await api.put(`${ENDPOINT}/${payload.id}`, payload);

    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${ENDPOINT}/${id}`);

    return data;
  },
};
