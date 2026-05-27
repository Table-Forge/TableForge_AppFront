export const JOIN_REQUESTS = "join-requests";

export const JOIN_REQUEST_KEYS = {
  all: [JOIN_REQUESTS] as const,
  byCampaign: (
    campaignId: number,
    filters?: { page?: number; size?: number },
  ) => [...JOIN_REQUEST_KEYS.all, "campaign", campaignId, filters] as const,
  detail: (id: number) => [...JOIN_REQUEST_KEYS.all, "detail", id] as const,
  statusEnum: () => [...JOIN_REQUEST_KEYS.all, "status-enum"] as const,
};
