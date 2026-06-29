import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { CAMPAIGN_MEMBER_KEYS } from "@/src/features/campaign-members/hooks/query-key";
import { JOIN_REQUEST_KEYS } from "@/src/features/join-requests/hooks/query-key";
import {
  IJoinRequest,
  IJoinRequestCreate,
  IJoinRequestStatusUpdate,
} from "@/src/features/join-requests/schemas/join-request.schema";
import { JoinRequestService } from "@/src/features/join-requests/services/join-requests.services";
import { IPaginatedApiResponse } from "@/src/interfaces";

type JoinRequestPage = IPaginatedApiResponse<IJoinRequest>;

export const useJoinRequestsMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const upsertJoinRequestInCache = (joinRequest: IJoinRequest) => {
    if (!campaignId) return;

    queryClient.setQueriesData<JoinRequestPage>(
      { queryKey: [...JOIN_REQUEST_KEYS.all, "campaign", campaignId], exact: false },
      (data) => {
        if (!data?.items) return data;

        const exists = data.items.some((item) => item.id === joinRequest.id);
        const items = exists
          ? data.items.map((item) =>
              item.id === joinRequest.id ? { ...item, ...joinRequest } : item,
            )
          : [joinRequest, ...data.items];

        return { ...data, items };
      },
    );
  };

  const removeJoinRequestFromCache = (id: number) => {
    if (!campaignId) return;

    queryClient.setQueriesData<JoinRequestPage>(
      { queryKey: [...JOIN_REQUEST_KEYS.all, "campaign", campaignId], exact: false },
      (data) => {
        if (!data?.items) return data;

        return {
          ...data,
          items: data.items.filter((item) => item.id !== id),
        };
      },
    );
  };

  const createJoinRequestMutation = useMutation({
    mutationFn: (payload: IJoinRequestCreate) =>
      JoinRequestService.create(payload),
    onSuccess: (created) => {
      upsertJoinRequestInCache(created);
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
    onSuccess: (updated) => {
      upsertJoinRequestInCache(updated);

      if (campaignId && updated.status === "Approved") {
        queryClient.invalidateQueries({
          queryKey: CAMPAIGN_MEMBER_KEYS.byCampaign(campaignId),
        });
        Toast.show({
          type: "success",
          text1: "Solicitação aprovada.",
        });
      } else if (updated.status === "Rejected") {
        Toast.show({
          type: "success",
          text1: "Solicitação rejeitada.",
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        error?.data?.Message ||
        error?.message ||
        "Não foi possível processar a solicitação.";

      Toast.show({
        type: "error",
        text1: "Erro ao atualizar solicitação",
        text2: errorMessage,
      });
    },
  });

  const deleteJoinRequestMutation = useMutation({
    mutationFn: (id: number) => JoinRequestService.delete(id),
    onSuccess: (_data, id) => {
      removeJoinRequestFromCache(id);
    },
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
