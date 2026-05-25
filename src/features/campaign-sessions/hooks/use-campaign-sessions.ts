import { useQuery } from "@tanstack/react-query";

import { CAMPAIGN_SESSION_KEYS } from "@/src/features/campaign-sessions/hooks/query-key";
import { CampaignSessionService } from "@/src/features/campaign-sessions/services/campaign-sessions.services";
import { IGetPaginatedParams } from "@/src/interfaces";

type IUseCampaignSessionsParams = IGetPaginatedParams & {
  campaignId?: number;
  enabled?: boolean;
};

export const useCampaignSessions = ({
  campaignId,
  enabled = true,
  ...filters
}: IUseCampaignSessionsParams = {}) =>
  useQuery({
    queryKey: [...CAMPAIGN_SESSION_KEYS.list(filters), campaignId] as const,
    queryFn: async () => {
      const response = await CampaignSessionService.getPaginated(filters);

      if (!campaignId) return response;

      return {
        ...response,
        items: response.items.filter(
          (session) => session.campaignId === campaignId,
        ),
      };
    },
    enabled,
  });
