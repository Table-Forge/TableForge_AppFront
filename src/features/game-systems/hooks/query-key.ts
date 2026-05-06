import { IGetPaginatedParams } from "@/src/interfaces";

export const GAME_SYSTEM_KEYS = {
  all: ["game-systems"] as const,
  lists: () => [...GAME_SYSTEM_KEYS.all, "list"] as const,
  list: (filters: IGetPaginatedParams = {}) =>
    [...GAME_SYSTEM_KEYS.lists(), filters] as const,
};
