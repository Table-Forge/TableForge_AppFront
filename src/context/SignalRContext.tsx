import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { authTokenStore } from "@/src/features/auth-token-store";
import { 
  IConversationMessage, 
  IConversationMessageStatusUpdateDto 
} from "@/src/features/conversations/schemas/conversation.schema";
import { 
  conversationMessagesQueryKey, 
  CONVERSATIONS_QUERY_KEY 
} from "@/src/features/conversations/hooks/use-infinite-conversations";
// We need to import the correct query key for campaign messages, but for now we'll rely on the caller to refetch or we update it if we know the key.
// Actually, it's better to expose the connection to let the hooks attach their own listeners if they are screen-specific, but for global direct chats, we handle them here to show badges anywhere.

interface SignalRContextData {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextData>({
  connection: null,
  isConnected: false,
});

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  // Need to dynamically import BaseURL or hardcode relative to API
  // Using the same base URL approach as API. Assuming the backend is hosted at the same base URL.
  // The app uses API from src/features/api.ts which we can't easily read base URL from here. Let's assume process.env.EXPO_PUBLIC_API_URL or similar.
  // Looking at .env.development, it might have it. Let's just use the relative or a fallback.
  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000"; 
  const HUB_URL = `${API_URL}/hubs/chat`;

  useEffect(() => {
    let hubConnection: signalR.HubConnection;

    const startConnection = async () => {
      // Wait for hydration
      await authTokenStore.hydrate();
      
      const token = authTokenStore.getToken();
      if (!token) return; // Only connect if authenticated

      const tokenUrl = `${HUB_URL}?access_token=${token}`;

      hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(tokenUrl)
        .withAutomaticReconnect()
        .build();

      try {
        await hubConnection.start();
        setIsConnected(true);
        console.log("SignalR Connected.");

        // Global Event: Direct Message Received
        hubConnection.on("ReceiveConversationMessage", (messageDto: IConversationMessage) => {
          const queryKey = conversationMessagesQueryKey(messageDto.conversationId);
          
          queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return oldData;
            // Optimistic update of infinite query
            const newPages = [...oldData.pages];
            if (newPages.length > 0) {
              newPages[0] = {
                ...newPages[0],
                items: [messageDto, ...newPages[0].items],
              };
            }
            return { ...oldData, pages: newPages };
          });

          // Also update the unread count in conversations list
          queryClient.setQueryData(CONVERSATIONS_QUERY_KEY, (oldData: any) => {
            if (!oldData) return oldData;
            const newPages = oldData.pages.map((page: any) => ({
              ...page,
              items: page.items.map((conv: any) => {
                if (conv.id === messageDto.conversationId) {
                  return {
                    ...conv,
                    unreadMessagesCount: conv.unreadMessagesCount + 1,
                    lastMessageContent: messageDto.content,
                  };
                }
                return conv;
              }),
            }));
            return { ...oldData, pages: newPages };
          });
        });

        // Global Event: Status Update
        hubConnection.on("ReceiveMessageStatusUpdate", (statusUpdate: IConversationMessageStatusUpdateDto) => {
          const queryKey = conversationMessagesQueryKey(statusUpdate.conversationId);
          
          queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return oldData;
            const newPages = oldData.pages.map((page: any) => ({
              ...page,
              items: page.items.map((msg: IConversationMessage) => {
                const updatedStatuses = msg.statuses?.map(s => 
                  s.userId === statusUpdate.userId 
                    ? { ...s, isRead: s.isRead || statusUpdate.isRead, isReceived: s.isReceived || statusUpdate.isReceived }
                    : s
                ) || [];
                return { ...msg, statuses: updatedStatuses };
              }),
            }));
            return { ...oldData, pages: newPages };
          });
        });

        setConnection(hubConnection);

      } catch (e) {
        console.error("SignalR Connection Error: ", e);
      }
    };

    startConnection();

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, [queryClient, HUB_URL]);

  return (
    <SignalRContext.Provider value={{ connection, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};
