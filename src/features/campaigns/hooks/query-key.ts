export const CAMPAIGNS = "campaigns";

export const CAMPAIGNS_PLAYER = "campaigns-player";

export const CAMPAIGN_KEYS = {
  all: [CAMPAIGNS] as const,
  difficultyLevelEnum: () =>
    [...CAMPAIGN_KEYS.all, "difficulty-level-enum"] as const,
  statusEnum: () => [...CAMPAIGN_KEYS.all, "status-enum"] as const,
  relationshipEnum: () => [...CAMPAIGN_KEYS.all, "relationship-enum"] as const,
};
