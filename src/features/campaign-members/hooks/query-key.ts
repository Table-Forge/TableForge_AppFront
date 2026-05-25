export const CAMPAIGN_MEMBERS = "campaign-members";

export const CAMPAIGN_MEMBER_KEYS = {
  all: [CAMPAIGN_MEMBERS] as const,
  byCampaign: (campaignId: number) =>
    [...CAMPAIGN_MEMBER_KEYS.all, "campaign", campaignId] as const,
  roleEnum: () => [...CAMPAIGN_MEMBER_KEYS.all, "role-enum"] as const,
};
