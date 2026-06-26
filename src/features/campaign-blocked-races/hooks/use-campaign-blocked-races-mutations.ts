import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CAMPAIGN_BLOCKED_RACE_KEYS } from "@/src/features/campaign-blocked-races/hooks/query-key";
import { ICampaignBlockedRaceCreate } from "@/src/features/campaign-blocked-races/schemas/campaign-blocked-race.schema";
import { CampaignBlockedRaceService } from "@/src/features/campaign-blocked-races/services/campaign-blocked-races.services";
import { CAMPAIGN_KEYS } from "@/src/features/campaigns/hooks/query-key";

export const useCampaignBlockedRacesMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    if (!campaignId) return;

    queryClient.invalidateQueries({
      queryKey: CAMPAIGN_BLOCKED_RACE_KEYS.byCampaign(campaignId),
    });
    queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.byId(campaignId) });
  };

  const createCampaignBlockedRacesMutation = useMutation({
    mutationFn: (payload: ICampaignBlockedRaceCreate) =>
      CampaignBlockedRaceService.create(payload),
    onSuccess: handleSuccess,
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
