export const CAMPAIGN_BLOCKED_CLASSES = "campaign-blocked-classes";

export const CAMPAIGN_BLOCKED_CLASS_KEYS = {
  all: [CAMPAIGN_BLOCKED_CLASSES] as const,
  byCampaign: (campaignId: number) =>
    [...CAMPAIGN_BLOCKED_CLASS_KEYS.all, "campaign", campaignId] as const,
};
