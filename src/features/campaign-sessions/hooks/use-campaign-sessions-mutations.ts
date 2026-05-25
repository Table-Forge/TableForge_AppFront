import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CAMPAIGN_SESSION_KEYS } from "@/src/features/campaign-sessions/hooks/query-key";
import {
  ICampaignSession,
  ICampaignSessionCreate,
} from "@/src/features/campaign-sessions/schemas/campaign-session.schema";
import { CampaignSessionService } from "@/src/features/campaign-sessions/services/campaign-sessions.services";

export const useCampaignSessionsMutation = () => {
  const queryClient = useQueryClient();

  const invalidateCampaignSessions = () =>
    queryClient.invalidateQueries({
      queryKey: CAMPAIGN_SESSION_KEYS.lists(),
    });

  const createCampaignSessionMutation = useMutation({
    mutationFn: (payload: ICampaignSessionCreate) =>
      CampaignSessionService.create(payload),
    onSuccess: invalidateCampaignSessions,
  });

  const updateCampaignSessionMutation = useMutation({
    mutationFn: (payload: ICampaignSession) =>
      CampaignSessionService.update(payload),
    onSuccess: invalidateCampaignSessions,
  });

  const deleteCampaignSessionMutation = useMutation({
    mutationFn: (id: number) => CampaignSessionService.delete(id),
    onSuccess: invalidateCampaignSessions,
  });

  return {
    createCampaignSessionMutation,
    updateCampaignSessionMutation,
    deleteCampaignSessionMutation,
    isCreatingCampaignSession: createCampaignSessionMutation.isPending,
    isUpdatingCampaignSession: updateCampaignSessionMutation.isPending,
    isDeletingCampaignSession: deleteCampaignSessionMutation.isPending,
  };
};
