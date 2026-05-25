import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { CAMPAIGN_MEMBER_KEYS } from "@/src/features/campaign-members/hooks/query-key";
import { JOIN_REQUEST_KEYS } from "@/src/features/join-requests/hooks/query-key";
import {
  IJoinRequestCreate,
  IJoinRequestStatusUpdate,
} from "@/src/features/join-requests/schemas/join-request.schema";
import { JoinRequestService } from "@/src/features/join-requests/services/join-requests.services";

export const useJoinRequestsMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const invalidateJoinRequests = () => {
    if (!campaignId) return;
    queryClient.invalidateQueries({
      queryKey: JOIN_REQUEST_KEYS.byCampaign(campaignId),
    });
    queryClient.invalidateQueries({
      queryKey: CAMPAIGN_MEMBER_KEYS.byCampaign(campaignId),
    });
  };

  const createJoinRequestMutation = useMutation({
    mutationFn: (payload: IJoinRequestCreate) =>
      JoinRequestService.create(payload),
    onSuccess: () => {
      invalidateJoinRequests();
      Toast.show({
        type: "success",
        text1: "Solicitação enviada.",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Erro ao solicitar entrada.",
      });
    },
  });

  const updateJoinRequestStatusMutation = useMutation({
    mutationFn: (payload: IJoinRequestStatusUpdate) =>
      JoinRequestService.updateStatus(payload),
    onSuccess: invalidateJoinRequests,
  });

  const deleteJoinRequestMutation = useMutation({
    mutationFn: (id: number) => JoinRequestService.delete(id),
    onSuccess: invalidateJoinRequests,
  });

  return {
    createJoinRequestMutation,
    updateJoinRequestStatusMutation,
    deleteJoinRequestMutation,
    isCreatingJoinRequest: createJoinRequestMutation.isPending,
    isUpdatingJoinRequest: updateJoinRequestStatusMutation.isPending,
    isDeletingJoinRequest: deleteJoinRequestMutation.isPending,
  };
};
