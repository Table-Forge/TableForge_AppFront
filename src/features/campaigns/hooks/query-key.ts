export const CAMPAIGNS = "campaigns";

export const CAMPAIGNS_PLAYER = "campaigns-player";

export const CAMPAIGN_KEYS = {
  all: [CAMPAIGNS] as const,
  player: () => [CAMPAIGNS_PLAYER] as const,
  byId: (id: number) => [...CAMPAIGN_KEYS.all, id] as const,
  byUser: (userId: number) => [...CAMPAIGN_KEYS.all, { userId }] as const,
  difficultyLevelEnum: () =>
    [...CAMPAIGN_KEYS.all, "difficulty-level-enum"] as const,
  statusEnum: () => [...CAMPAIGN_KEYS.all, "status-enum"] as const,
  relationshipEnum: () => [...CAMPAIGN_KEYS.all, "relationship-enum"] as const,
};
