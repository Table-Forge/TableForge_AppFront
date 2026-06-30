import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationService } from "../services/conversation.services";
import { CONVERSATIONS_QUERY_KEY } from "./use-infinite-conversations";
import { ICreateDirectConversationDto, IConversationMessageCreate } from "../schemas/conversation.schema";

export const useConversationMutations = () => {
  const queryClient = useQueryClient();

  const createDirectConversationMutation = useMutation({
    mutationFn: (payload: ICreateDirectConversationDto) =>
      ConversationService.createDirect(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, payload }: { conversationId: number; payload: IConversationMessageCreate }) =>
      ConversationService.sendMessage(conversationId, payload),
  });

  const markMessagesAsReadMutation = useMutation({
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

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: number) =>
      ConversationService.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });

  const markMessagesAsUnreadMutation = useMutation({
    mutationFn: (conversationId: number) =>
      ConversationService.markAsUnread(conversationId),
    onMutate: (conversationId) => {
      queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          items: page.items.map((conv: any) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                unreadMessagesCount: conv.unreadMessagesCount > 0 ? conv.unreadMessagesCount : 1,
              };
            }
            return conv;
          }),
        }));
        return { ...oldData, pages: newPages };
      });
    },
  });

  return {
    createDirectConversationMutation,
    sendMessageMutation,
    markMessagesAsReadMutation,
    markMessagesAsUnreadMutation,
    deleteConversationMutation,
  };
};
