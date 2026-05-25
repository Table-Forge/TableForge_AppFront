import { IGetPaginatedParams } from "@/src/interfaces";

export const CLASS_KEYS = {
  all: ["classes"] as const,
  lists: () => [...CLASS_KEYS.all, "list"] as const,
  list: (filters: IGetPaginatedParams = {}) =>
    [...CLASS_KEYS.lists(), filters] as const,
};
