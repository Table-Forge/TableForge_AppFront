import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationService } from "../services/conversation.services";
import { CONVERSATIONS_QUERY_KEY } from "./use-infinite-conversations";
import { conversationMessagesQueryKey } from "./use-infinite-conversation-messages";
import { ICreateDirectConversationDto, IConversationMessageCreate, IConversationMessage } from "../schemas/conversation.schema";
import { useAuth } from "@/src/context/auth";

export const useConversationMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    onMutate: async ({ conversationId, payload }) => {
      await queryClient.cancelQueries({ queryKey: conversationMessagesQueryKey(conversationId) });
      const previousMessages = queryClient.getQueryData(conversationMessagesQueryKey(conversationId));
      
      const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000));
      const optimisticMessage: IConversationMessage = {
        id: tempId,
        conversationId: conversationId,
        senderId: user?.id || 0,
        senderUsername: user?.username || "",
        senderNickname: user?.nickname || "",
        senderAvatarUrl: user?.avatarUrl || null,
        type: payload.type,
        content: payload.content,
        metadata: payload.metadata || null,
        createdAt: new Date().toISOString(),
        statuses: [],
        isOptimistic: true,
      };

      queryClient.setQueryData(conversationMessagesQueryKey(conversationId), (oldData: any) => {
        if (!oldData) return oldData;
        
        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            items: [optimisticMessage, ...newPages[0].items],
          };
        }
        return { ...oldData, pages: newPages };
      });

      return { previousMessages, tempId, conversationId };
    },
    onSuccess: (savedMessage, variables, context) => {
      if (context?.tempId) {
        queryClient.setQueryData(conversationMessagesQueryKey(context.conversationId), (oldData: any) => {
          if (!oldData) return oldData;
          
          // Check if SignalR already added the real message
          const realMessageExists = oldData.pages.some((page: any) => 
            page.items.some((msg: any) => msg.id === savedMessage.id)
          );

          if (realMessageExists) {
            // If SignalR already added it, just remove the temporary one
            const newPages = oldData.pages.map((page: any) => ({
              ...page,
              items: page.items.filter((msg: any) => msg.id !== context.tempId),
            }));
            return { ...oldData, pages: newPages };
          } else {
            // If SignalR hasn't added it yet, replace the temporary one
            const newPages = oldData.pages.map((page: any) => ({
              ...page,
              items: page.items.map((msg: any) => msg.id === context.tempId ? savedMessage : msg),
            }));
            return { ...oldData, pages: newPages };
          }
        });
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(conversationMessagesQueryKey(context.conversationId), context.previousMessages);
      }
    },
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
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: conversationMessagesQueryKey(conversationId) });
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
