import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CAMPAIGN_BLOCKED_CLASS_KEYS } from "@/src/features/campaign-blocked-classes/hooks/query-key";
import { ICampaignBlockedClassCreate } from "@/src/features/campaign-blocked-classes/schemas/campaign-blocked-class.schema";
import { CampaignBlockedClassService } from "@/src/features/campaign-blocked-classes/services/campaign-blocked-classes.services";
import { CAMPAIGN_KEYS } from "@/src/features/campaigns/hooks/query-key";
import { CAMPAIGNS } from "@/src/features/campaigns/hooks/query-key";

export const useCampaignBlockedClassesMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const invalidateCampaignBlockedClasses = () => {
    if (!campaignId) return;
    queryClient.invalidateQueries({
      queryKey: CAMPAIGN_BLOCKED_CLASS_KEYS.byCampaign(campaignId),
    });
    queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.byId(campaignId) });
  };

  const createCampaignBlockedClassesMutation = useMutation({
    mutationFn: (payload: ICampaignBlockedClassCreate) =>
      CampaignBlockedClassService.create(payload),
    onSuccess: invalidateCampaignBlockedClasses,
  });

  const deleteCampaignBlockedClassMutation = useMutation({
    mutationFn: (id: number) => CampaignBlockedClassService.delete(id),
    onSuccess: invalidateCampaignBlockedClasses,
  });

  return {
    createCampaignBlockedClassesMutation,
    deleteCampaignBlockedClassMutation,
    isCreatingCampaignBlockedClasses:
      createCampaignBlockedClassesMutation.isPending,
    isDeletingCampaignBlockedClass:
      deleteCampaignBlockedClassMutation.isPending,
  };
};
