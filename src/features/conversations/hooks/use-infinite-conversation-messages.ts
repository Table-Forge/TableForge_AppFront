import { useInfiniteQuery } from "@tanstack/react-query";
import { ConversationService } from "../services/conversation.services";

export const conversationMessagesQueryKey = (conversationId: number) => [
  "conversation-messages",
  conversationId,
];

export const useInfiniteConversationMessages = (
  conversationId: number,
  { size = 20 }: { size?: number },
) => {
  return useInfiniteQuery({
    queryKey: conversationMessagesQueryKey(conversationId),
    queryFn: async ({ pageParam = 1 }) => {
      return ConversationService.getMessages(conversationId, {
        page: pageParam,
        size,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length === lastPage.pagination.size ? lastPage.pagination.page + 1 : undefined,
    enabled: !!conversationId,
  });
};
