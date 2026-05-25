import { IGetPaginatedParams } from "@/src/interfaces";

export const RACE_KEYS = {
  all: ["races"] as const,
  lists: () => [...RACE_KEYS.all, "list"] as const,
  list: (filters: IGetPaginatedParams = {}) =>
    [...RACE_KEYS.lists(), filters] as const,
};
