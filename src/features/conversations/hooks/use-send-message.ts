import { useMutation } from "@tanstack/react-query";
import { IConversationMessageCreate } from "../schemas/conversation.schema";
import { ConversationService } from "../services/conversation.services";

export const useSendMessage = (conversationId: number) => {
  return useMutation({
    mutationFn: (payload: IConversationMessageCreate) =>
      ConversationService.sendMessage(conversationId, payload),
  });
};
