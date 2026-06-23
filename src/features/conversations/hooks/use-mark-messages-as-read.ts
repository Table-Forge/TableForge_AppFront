import { useMutation } from "@tanstack/react-query";
import { ConversationService } from "../services/conversation.services";

export const useMarkMessagesAsRead = () => {
  return useMutation({
    mutationFn: (conversationId: number) =>
      ConversationService.markAsRead(conversationId),
  });
};
