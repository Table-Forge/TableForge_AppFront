import { useQuery } from "@tanstack/react-query";

import { JOIN_REQUEST_KEYS } from "@/src/features/join-requests/hooks/query-key";
import { JoinRequestService } from "@/src/features/join-requests/services/join-requests.services";

interface IUseJoinRequestsParams {
  campaignId?: number;
  enabled?: boolean;
}

export const useJoinRequests = ({
  campaignId,
  enabled = true,
}: IUseJoinRequestsParams) =>
  useQuery({
    queryKey: JOIN_REQUEST_KEYS.byCampaign(campaignId ?? 0),
    queryFn: () => JoinRequestService.getByCampaign(campaignId ?? 0),
    select: (data) => data.items,
    enabled: enabled && !!campaignId,
  });
