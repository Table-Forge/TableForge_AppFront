import { useQuery } from "@tanstack/react-query";

import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { CAMPAIGNS } from "@/src/features/campaigns/hooks/query-key";

export function useCampaign(id?: number) {
  return useQuery({
    queryKey: [CAMPAIGNS, id],
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return CampaignService.getById(id);
    },
    enabled: id !== undefined && !isNaN(id),
  });
}
