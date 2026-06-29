import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationService } from "../services/conversation.services";
import { CONVERSATIONS_QUERY_KEY } from "./use-infinite-conversations";

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: number) =>
      ConversationService.markAsRead(conversationId),
    onMutate: (conversationId) => {
      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          items: page.items.map((conv: any) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                unreadMessagesCount: 0,
              };
            }
            return conv;
          }),
        }));
        return { ...oldData, pages: newPages };
      });
    },
  });
};
