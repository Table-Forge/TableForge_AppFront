import { useMutation } from "@tanstack/react-query";
import { ICreateDirectConversationDto } from "../schemas/conversation.schema";
import { ConversationService } from "../services/conversation.services";

export const useCreateDirectConversation = () => {
  return useMutation({
    mutationFn: (payload: ICreateDirectConversationDto) =>
      ConversationService.createDirect(payload),
  });
};
