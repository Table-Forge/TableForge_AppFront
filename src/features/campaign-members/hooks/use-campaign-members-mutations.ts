import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CAMPAIGN_MEMBER_KEYS } from "@/src/features/campaign-members/hooks/query-key";
import { ICampaignMemberCreate } from "@/src/features/campaign-members/schemas/campaign-member.schema";
import { CampaignMemberService } from "@/src/features/campaign-members/services/campaign-members.services";

export const useCampaignMembersMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const invalidateCampaignMembers = () => {
    if (!campaignId) return;
    queryClient.invalidateQueries({
      queryKey: CAMPAIGN_MEMBER_KEYS.byCampaign(campaignId),
    });
  };

  const createCampaignMemberMutation = useMutation({
    mutationFn: (payload: ICampaignMemberCreate) =>
      CampaignMemberService.create(payload),
    onSuccess: invalidateCampaignMembers,
  });

  const deleteCampaignMemberMutation = useMutation({
    mutationFn: (id: number) => CampaignMemberService.delete(id),
    onSuccess: invalidateCampaignMembers,
  });

  return {
    createCampaignMemberMutation,
    deleteCampaignMemberMutation,
    isCreatingCampaignMember: createCampaignMemberMutation.isPending,
    isDeletingCampaignMember: deleteCampaignMemberMutation.isPending,
  };
};
