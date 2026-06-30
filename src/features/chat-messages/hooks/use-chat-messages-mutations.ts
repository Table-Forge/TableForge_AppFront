import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { useAuth } from "@/src/context/auth";
import { CHAT_MESSAGE_KEYS } from "@/src/features/chat-messages/hooks/query-key";
import {
  IChatMessage,
  IChatMessageCreate,
} from "@/src/features/chat-messages/schemas/chat-message.schema";
import { ChatMessageService } from "@/src/features/chat-messages/services/chat-messages.services";

export const useChatMessagesMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateChatMessages = () => {
    if (!campaignId) return;
    queryClient.invalidateQueries({
      queryKey: CHAT_MESSAGE_KEYS.byCampaign(campaignId),
    });
  };

  const createChatMessageMutation = useMutation({
    mutationFn: (payload: IChatMessageCreate) =>
      ChatMessageService.create(payload),
    onMutate: async (payload) => {
      const queryKey = CHAT_MESSAGE_KEYS.byCampaign(payload.campaignId);
      await queryClient.cancelQueries({ queryKey });
      const previousMessages = queryClient.getQueryData(queryKey);

      const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000));
      const optimisticMessage: IChatMessage = {
        id: tempId,
        campaignId: payload.campaignId,
        userId: payload.userId,
        content: payload.content,
        username: user?.nickname || user?.username || null,
        avatarUrl: user?.avatarUrl || null,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, items: [optimisticMessage, ...oldData.items] };
      });

      return { previousMessages, tempId, queryKey };
    },
    onSuccess: (savedMessage, _payload, context) => {
      if (!context?.queryKey) return;
      queryClient.setQueryData(context.queryKey, (oldData: any) => {
        if (!oldData) return oldData;

        const realExists = oldData.items.some(
          (m: IChatMessage) => m.id === savedMessage.id,
        );

        const items = realExists
          ? oldData.items.filter((m: IChatMessage) => m.id !== context.tempId)
          : oldData.items.map((m: IChatMessage) =>
              m.id === context.tempId ? savedMessage : m,
            );

        return { ...oldData, items };
      });
    },
    onError: (_err, _payload, context) => {
      if (context?.queryKey && context?.previousMessages !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousMessages);
      }
      Toast.show({
        type: "error",
        text1: "Erro ao enviar mensagem.",
      });
    },
  });

  const deleteChatMessageMutation = useMutation({
    mutationFn: (id: number) => ChatMessageService.delete(id),
    onSuccess: invalidateChatMessages,
  });

  return {
    createChatMessageMutation,
    deleteChatMessageMutation,
    isCreatingChatMessage: createChatMessageMutation.isPending,
    isDeletingChatMessage: deleteChatMessageMutation.isPending,
  };
};
