export const CAMPAIGNS = "campaigns";

export const CAMPAIGN_KEYS = {
  all: [CAMPAIGNS] as const,
  difficultyLevelEnum: () =>
    [...CAMPAIGN_KEYS.all, "difficulty-level-enum"] as const,
  statusEnum: () => [...CAMPAIGN_KEYS.all, "status-enum"] as const,
};
