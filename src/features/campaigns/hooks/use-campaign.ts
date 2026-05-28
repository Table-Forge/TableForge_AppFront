import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";

import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { CAMPAIGNS } from "@/src/features/campaigns/hooks/query-key";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { IPaginatedApiResponse } from "@/src/interfaces";

type CampaignInfiniteData = InfiniteData<IPaginatedApiResponse<ICampaign>>;

export function useCampaign(id?: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [CAMPAIGNS, id],
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return CampaignService.getById(id);
    },
    enabled: id !== undefined && !isNaN(id),
    placeholderData: () => {
      if (id === undefined) return undefined;

      const infiniteQueries = queryClient.getQueriesData<CampaignInfiniteData>({
        queryKey: [CAMPAIGNS],
        exact: false,
      });

      for (const [, data] of infiniteQueries) {
        if (!data?.pages) continue;
        for (const page of data.pages) {
          const match = page.items.find((item) => item.id === id);
          if (match) return match;
        }
      }

      return undefined;
    },
  });
}
