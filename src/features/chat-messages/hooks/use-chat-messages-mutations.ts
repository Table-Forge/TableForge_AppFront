import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { CHAT_MESSAGE_KEYS } from "@/src/features/chat-messages/hooks/query-key";
import { IChatMessageCreate } from "@/src/features/chat-messages/schemas/chat-message.schema";
import { ChatMessageService } from "@/src/features/chat-messages/services/chat-messages.services";

export const useChatMessagesMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();

  const invalidateChatMessages = () => {
    if (!campaignId) return;
    queryClient.invalidateQueries({
      queryKey: CHAT_MESSAGE_KEYS.byCampaign(campaignId),
    });
  };

  const createChatMessageMutation = useMutation({
    mutationFn: (payload: IChatMessageCreate) =>
      ChatMessageService.create(payload),
    onSuccess: invalidateChatMessages,
    onError: () => {
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
