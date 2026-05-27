import { useQuery } from "@tanstack/react-query";

import { CAMPAIGN_BLOCKED_CLASS_KEYS } from "@/src/features/campaign-blocked-classes/hooks/query-key";
import { CampaignBlockedClassService } from "@/src/features/campaign-blocked-classes/services/campaign-blocked-classes.services";

interface IUseCampaignBlockedClassesParams {
  campaignId?: number;
  enabled?: boolean;
}

export const useCampaignBlockedClasses = ({
  campaignId,
  enabled = true,
}: IUseCampaignBlockedClassesParams) =>
  useQuery({
    queryKey: CAMPAIGN_BLOCKED_CLASS_KEYS.byCampaign(campaignId ?? 0),
    queryFn: () => CampaignBlockedClassService.getByCampaign(campaignId ?? 0),
    enabled: enabled && !!campaignId,
  });
