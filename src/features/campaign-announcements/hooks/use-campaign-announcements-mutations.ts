import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CAMPAIGN_ANNOUNCEMENT_KEYS } from "@/src/features/campaign-announcements/hooks/query-key";
import { ICampaignAnnouncementCreate, ICampaignAnnouncementUpdate } from "@/src/features/campaign-announcements/schemas/campaign-announcement.schema";
import { CampaignAnnouncementService } from "@/src/features/campaign-announcements/services/campaign-announcements.services";

export const useCampaignAnnouncementsMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const invalidateCampaignAnnouncements = () => {
    if (!campaignId) return;
    queryClient.invalidateQueries({
      queryKey: CAMPAIGN_ANNOUNCEMENT_KEYS.byCampaign(campaignId),
    });
  };

  const createCampaignAnnouncementMutation = useMutation({
    mutationFn: (payload: ICampaignAnnouncementCreate) =>
      CampaignAnnouncementService.create(payload),
    onSuccess: invalidateCampaignAnnouncements,
  });

  const updateCampaignAnnouncementMutation = useMutation({
    mutationFn: (payload: ICampaignAnnouncementUpdate) =>
      CampaignAnnouncementService.update(payload),
    onSuccess: invalidateCampaignAnnouncements,
  });

  const deleteCampaignAnnouncementMutation = useMutation({
    mutationFn: (id: number) => CampaignAnnouncementService.delete(id),
    onSuccess: invalidateCampaignAnnouncements,
  });

  return {
    createCampaignAnnouncementMutation,
    updateCampaignAnnouncementMutation,
    deleteCampaignAnnouncementMutation,
    isCreatingCampaignAnnouncement:
      createCampaignAnnouncementMutation.isPending,
    isUpdatingCampaignAnnouncement:
      updateCampaignAnnouncementMutation.isPending,
    isDeletingCampaignAnnouncement:
      deleteCampaignAnnouncementMutation.isPending,
  };
};
