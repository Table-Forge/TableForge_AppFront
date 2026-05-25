export const CHAT_MESSAGES = "chat-messages";

export const CHAT_MESSAGE_KEYS = {
  all: [CHAT_MESSAGES] as const,
  byCampaign: (campaignId: number) =>
    [...CHAT_MESSAGE_KEYS.all, "campaign", campaignId] as const,
};
