import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CAMPAIGN_BLOCKED_RACE_KEYS } from "@/src/features/campaign-blocked-races/hooks/query-key";
import { ICampaignBlockedRaceCreate } from "@/src/features/campaign-blocked-races/schemas/campaign-blocked-race.schema";
import { CampaignBlockedRaceService } from "@/src/features/campaign-blocked-races/services/campaign-blocked-races.services";
import { CAMPAIGNS } from "@/src/features/campaigns/hooks/query-key";

export const useCampaignBlockedRacesMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const invalidateCampaignBlockedRaces = () => {
    if (!campaignId) return;
    queryClient.invalidateQueries({
      queryKey: CAMPAIGN_BLOCKED_RACE_KEYS.byCampaign(campaignId),
    });
    queryClient.invalidateQueries({ queryKey: [CAMPAIGNS, campaignId] });
  };

  const createCampaignBlockedRacesMutation = useMutation({
    mutationFn: (payload: ICampaignBlockedRaceCreate) =>
      CampaignBlockedRaceService.create(payload),
    onSuccess: invalidateCampaignBlockedRaces,
  });

  const deleteCampaignBlockedRaceMutation = useMutation({
    mutationFn: (id: number) => CampaignBlockedRaceService.delete(id),
    onSuccess: invalidateCampaignBlockedRaces,
  });

  return {
    createCampaignBlockedRacesMutation,
    deleteCampaignBlockedRaceMutation,
    isCreatingCampaignBlockedRaces: createCampaignBlockedRacesMutation.isPending,
    isDeletingCampaignBlockedRace: deleteCampaignBlockedRaceMutation.isPending,
  };
};
