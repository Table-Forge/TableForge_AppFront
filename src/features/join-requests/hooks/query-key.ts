export const JOIN_REQUESTS = "join-requests";

export const JOIN_REQUEST_KEYS = {
  all: [JOIN_REQUESTS] as const,
  byCampaign: (campaignId: number) =>
    [...JOIN_REQUEST_KEYS.all, "campaign", campaignId] as const,
  detail: (id: number) => [...JOIN_REQUEST_KEYS.all, "detail", id] as const,
  statusEnum: () => [...JOIN_REQUEST_KEYS.all, "status-enum"] as const,
};
