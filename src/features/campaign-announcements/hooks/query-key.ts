export const CAMPAIGN_ANNOUNCEMENTS = "campaign-announcements";

export const CAMPAIGN_ANNOUNCEMENT_KEYS = {
  all: [CAMPAIGN_ANNOUNCEMENTS] as const,
  byCampaign: (campaignId: number) =>
    [...CAMPAIGN_ANNOUNCEMENT_KEYS.all, "campaign", campaignId] as const,
};
