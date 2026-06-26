import { useInfiniteQuery } from "@tanstack/react-query";
import { ConversationService } from "../services/conversation.services";

export const CONVERSATIONS_QUERY_KEY = ["conversations"];
export const CONVERSATIONS_PAGE_SIZE = 20;

export const useInfiniteConversations = ({ size = CONVERSATIONS_PAGE_SIZE }: { size?: number }) => {
  return useInfiniteQuery({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: async ({ pageParam = 1 }) => {
      return ConversationService.getAll({ page: pageParam, size });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length === lastPage.pagination.size ? lastPage.pagination.page + 1 : undefined,
  });
};
