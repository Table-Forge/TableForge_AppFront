import { useQuery } from "@tanstack/react-query";

import { CAMPAIGN_MEMBER_KEYS } from "@/src/features/campaign-members/hooks/query-key";
import { CampaignMemberService } from "@/src/features/campaign-members/services/campaign-members.services";

interface IUseCampaignMembersParams {
  campaignId?: number;
  enabled?: boolean;
}

export const useCampaignMembers = ({
  campaignId,
  enabled = true,
}: IUseCampaignMembersParams) =>
  useQuery({
    queryKey: CAMPAIGN_MEMBER_KEYS.byCampaign(campaignId ?? 0),
    queryFn: () => CampaignMemberService.getByCampaign(campaignId ?? 0),
    enabled: enabled && !!campaignId,
  });
