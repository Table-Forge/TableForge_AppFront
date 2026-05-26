import { api } from "@/src/features/api";
import { TOptions } from "@/src/interfaces";

const ENDPOINT = "/logs";

export const LogService = {
  getTypeEnum: async (): Promise<TOptions[]> => {
    const { data } = await api.get(`${ENDPOINT}/enums/log-type`);

    return data;
  },
};
