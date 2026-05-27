import { useQuery } from "@tanstack/react-query";

import { JOIN_REQUEST_KEYS } from "@/src/features/join-requests/hooks/query-key";
import { JoinRequestService } from "@/src/features/join-requests/services/join-requests.services";
import { IGetPaginatedParams } from "@/src/interfaces";

type IUseJoinRequestsParams = IGetPaginatedParams & {
  campaignId?: number;
  enabled?: boolean;
};

export const useJoinRequests = ({
  campaignId,
  enabled = true,
  page,
  size,
}: IUseJoinRequestsParams) =>
  useQuery({
    queryKey: JOIN_REQUEST_KEYS.byCampaign(campaignId ?? 0, { page, size }),
    queryFn: () =>
      JoinRequestService.getByCampaign(campaignId ?? 0, { page, size }),
    select: (data) => data.items,
    enabled: enabled && !!campaignId,
  });
