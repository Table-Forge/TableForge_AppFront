export const CAMPAIGN_BLOCKED_RACES = "campaign-blocked-races";

export const CAMPAIGN_BLOCKED_RACE_KEYS = {
  all: [CAMPAIGN_BLOCKED_RACES] as const,
  byCampaign: (campaignId: number) =>
    [...CAMPAIGN_BLOCKED_RACE_KEYS.all, "campaign", campaignId] as const,
};
