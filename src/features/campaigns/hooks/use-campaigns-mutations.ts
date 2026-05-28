import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import {
  ICampaign,
  ICampaignCreate,
} from "@/src/features/campaigns/schemas/campaign.schema";
import { CampaignService } from "@/src/features/campaigns/services/campaigns.services";
import { IPaginatedApiResponse } from "@/src/interfaces";

import { CAMPAIGNS } from "./query-key";

type CampaignInfiniteData = InfiniteData<IPaginatedApiResponse<ICampaign>>;

export const useCampaignsMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createCampaignMutation = useMutation({
    mutationFn: (payload: ICampaignCreate) => CampaignService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CAMPAIGNS],
        refetchType: "active",
      });
      Toast.show({
        type: "success",
        text1: "Campanha criada com sucesso!",
        position: "top",
        visibilityTime: 4000,
      });
      router.back();
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { Message?: string; message?: string } };
        data?: { Message?: string; message?: string };
        Message?: string;
        message?: string;
      };
      const backendMessage =
        err?.response?.data?.Message ??
        err?.response?.data?.message ??
        err?.data?.Message ??
        err?.data?.message ??
        err?.Message;
      const message =
        typeof backendMessage === "string" && backendMessage.trim()
          ? backendMessage
          : "Erro ao criar campanha.";

      Toast.show({
        type: "error",
        text1: "Ops! Algo deu errado",
        text2: message,
      });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: (payload: Partial<ICampaign> & { id: number }) =>
      CampaignService.update(payload),
    onSuccess: (updated, variables) => {
      const campaignId = updated?.id ?? variables.id;

      queryClient.setQueryData<ICampaign>([CAMPAIGNS, campaignId], (current) =>
        current ? { ...current, ...updated } : updated,
      );

      queryClient.setQueriesData<CampaignInfiniteData>(
        { queryKey: [CAMPAIGNS], exact: false },
        (data) => {
          if (!data?.pages) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === campaignId ? { ...item, ...updated } : item,
              ),
            })),
          };
        },
      );

      Toast.show({
        type: "success",
        text1: "Campanha atualizada com sucesso!",
        position: "top",
        visibilityTime: 4000,
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar campanha",
      });
    },
  });

  return {
    createCampaignMutation,
    updateCampaignMutation,
    isCreatingCampaign: createCampaignMutation.isPending,
    isUpdatingCampaign: updateCampaignMutation.isPending,
  };
};
