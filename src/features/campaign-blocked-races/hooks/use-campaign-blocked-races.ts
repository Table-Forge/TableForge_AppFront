import { useQuery } from "@tanstack/react-query";

import { CAMPAIGN_BLOCKED_RACE_KEYS } from "@/src/features/campaign-blocked-races/hooks/query-key";
import { CampaignBlockedRaceService } from "@/src/features/campaign-blocked-races/services/campaign-blocked-races.services";

interface IUseCampaignBlockedRacesParams {
  campaignId?: number;
  enabled?: boolean;
}

export const useCampaignBlockedRaces = ({
  campaignId,
  enabled = true,
}: IUseCampaignBlockedRacesParams) =>
  useQuery({
    queryKey: CAMPAIGN_BLOCKED_RACE_KEYS.byCampaign(campaignId ?? 0),
    queryFn: () => CampaignBlockedRaceService.getByCampaign(campaignId ?? 0),
    enabled: enabled && !!campaignId,
  });
