import { IGetPaginatedParams } from "@/src/interfaces";

export const CAMPAIGN_SESSIONS = "campaign-sessions";

export const CAMPAIGN_SESSION_KEYS = {
  all: [CAMPAIGN_SESSIONS] as const,
  lists: () => [...CAMPAIGN_SESSION_KEYS.all, "list"] as const,
  list: (filters: IGetPaginatedParams = {}) =>
    [...CAMPAIGN_SESSION_KEYS.lists(), filters] as const,
  detail: (id: number) => [...CAMPAIGN_SESSION_KEYS.all, "detail", id] as const,
};
