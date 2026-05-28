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
    queryFn: () =>
      CampaignSessionService.getPaginated({ ...filters, campaignId }),
    enabled,
  });
