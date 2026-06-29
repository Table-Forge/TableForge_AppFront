import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { FlatList, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { ActionButton } from "@/src/components/action-button/action-button";
import { ChatInput } from "@/src/components/chat-input/chat-input";
import { ChatBubble } from "@/src/components/chat-bubble/chat-bubble";
import { HeaderActions } from "@/src/components/header-actions/header-actions";

import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useSignalR } from "@/src/context/SignalRContext";
import { useBackRouter } from "@/src/hooks/use-back-route";
import {
  conversationMessagesQueryKey,
  useInfiniteConversationMessages,
} from "@/src/features/conversations/hooks/use-infinite-conversation-messages";
import { useSendMessage } from "@/src/features/conversations/hooks/use-send-message";
import { useMarkMessagesAsRead } from "@/src/features/conversations/hooks/use-mark-messages-as-read";
import {
  ConversationMessageType,
  IConversationMessage,
} from "@/src/features/conversations/schemas/conversation.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, SURFACES } from "@/src/theme/tokens";

export default function DirectChatScreen() {
  const { conversationId, title } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const parsedConversationId = Number(conversationId);
  const displayTitle = typeof title === "string" ? title : "Carta Direta";
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { connection } = useSignalR();

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteConversationMessages(parsedConversationId, { size: 20 });
  const { mutate: sendMessage, isPending: isSending } = useSendMessage(
    parsedConversationId,
  );
  const { mutate: markAsRead } = useMarkMessagesAsRead();

  const messages = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  useEffect(() => {
    if (parsedConversationId) {
      markAsRead(parsedConversationId);
    }
  }, [parsedConversationId, markAsRead]);

  const otherUserAvatarUrl = useMemo(() => {
    return messages.find((m) => m.senderId !== user?.id)?.senderAvatarUrl;
  }, [messages, user?.id]);

  const otherUserId = useMemo(() => {
    return messages.find((m) => m.senderId !== user?.id)?.senderId;
  }, [messages, user?.id]);

  useEffect(() => {
    if (!connection || !parsedConversationId) return;

    const receiveMsg = (messageDto: IConversationMessage) => {
      if (messageDto.conversationId !== parsedConversationId) return;
      queryClient.setQueryData(
        conversationMessagesQueryKey(parsedConversationId),
        (oldData: any) => {
          if (!oldData) return oldData;
          const newPages = [...oldData.pages];
          if (newPages.length > 0) {
            const exists = newPages.some(page => page.items.some((m: IConversationMessage) => m.id === messageDto.id));
            if (exists) return oldData;

            newPages[0] = {
              ...newPages[0],
              items: [messageDto, ...newPages[0].items],
            };
          }
          return { ...oldData, pages: newPages };
        }
      );
      markAsRead(parsedConversationId);
    };

    const receiveStatusUpdate = (statusUpdate: any) => {
      if (statusUpdate.conversationId !== parsedConversationId) return;
      queryClient.setQueryData(
        conversationMessagesQueryKey(parsedConversationId),
        (oldData: any) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map((page: any) => {
            return {
              ...page,
              items: page.items.map((msg: IConversationMessage) => {
                const newStatuses = msg.statuses?.map((s) => {
                  if (s.userId === statusUpdate.userId) {
                    return {
                      ...s,
                      isReceived: statusUpdate.isReceived ?? s.isReceived,
                      isRead: statusUpdate.isRead ?? s.isRead,
                    };
                  }
                  return s;
                });
                return { ...msg, statuses: newStatuses };
              }),
            };
          });
          return { ...oldData, pages: newPages };
        }
      );
    };

    connection.on("ReceiveConversationMessage", receiveMsg);
    connection.on("ReceiveMessageStatusUpdate", receiveStatusUpdate);

    return () => {
      connection.off("ReceiveConversationMessage", receiveMsg);
      connection.off("ReceiveMessageStatusUpdate", receiveStatusUpdate);
    };
  }, [connection, parsedConversationId, queryClient, markAsRead]);

  const handleEndReached = () => {
    if (hasNextPage) fetchNextPage();
  };

  const handleSendMessage = () => {
    const content = message.trim();

    if (!content || !user?.id) return;

    sendMessage(
      {
        type: ConversationMessageType.Text,
        content,
      },
      {
        onSuccess: () => {
          setMessage("");
        },
      },
    );
  };

  return (
    <Screen style={styles.container} keyboardAware>
      <Screen.Header style={styles.topWrapper}>
        <HeaderActions>
          <ActionButton
            variant="circle"
            style={styles.backButton}
            icon={
              <Ionicons
                name="arrow-back"
                size={22}
                color={DEFAULT_COLORS.white}
              />
            }
            onPress={handleBack}
          />

          <View style={[styles.headerTextContainer]}>
            <View style={{ alignItems: "center" }}>
              <View style={styles.headerTitleRow}>
                <FontAwesome6
                  name="scroll"
                  size={10}
                  color={DEFAULT_COLORS.tertiary}
                />
                <ThemedText style={styles.headerEyebrow}>Carta Direta</ThemedText>
              </View>
              <ThemedText
                style={[styles.headerSubtitle, { marginTop: 0, textAlign: "center" }]}
                numberOfLines={1}
                weight="bold"
              >
                {displayTitle}
              </ThemedText>
            </View>
          </View>

          {otherUserAvatarUrl ? (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => otherUserId && router.push({ pathname: "/user/[id]", params: { id: otherUserId } })}
            >
              <Image
                source={{ uri: otherUserAvatarUrl }}
                style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: SURFACES.fillStrong, borderWidth: 1, borderColor: BORDERS.divider }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => otherUserId && router.push({ pathname: "/user/[id]", params: { id: otherUserId } })}
              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: SURFACES.fillStrong, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: BORDERS.divider }}
            >
              <FontAwesome6 name="user" size={14} color={DEFAULT_COLORS.tertiary} />
            </TouchableOpacity>
          )}
        </HeaderActions>
      </Screen.Header>

      <Screen.Body style={styles.content}>
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            const isMine = item.senderId === user?.id;
            return (
              <ChatBubble
                content={item.content}
                isMine={isMine}
                timeText={new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                isRead={item.statuses?.some(s => s.isRead && s.userId !== item.senderId)}
                showReadReceipt={true}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={refetch}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <ThemedText style={styles.emptyText}>
                Nenhuma mensagem ainda.
              </ThemedText>
            </View>
          }
        />
      </Screen.Body>

      <ChatInput
        value={message}
        onChangeText={setMessage}
        onSend={handleSendMessage}
        isSending={isSending}
        placeholder="Escreva uma mensagem..."
        backgroundColor={SURFACES.cardAlt}
      />
    </Screen>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACES.background,
  },
  topWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  backButton: {
    backgroundColor: DEFAULT_COLORS.primary_80,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.secondary_30,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: 'center',
    textAlign: 'center'
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerEyebrow: {
    fontSize: 11,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 16,
    color: DEFAULT_COLORS.white,
  },
  headerSpacer: {
    width: 45,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 22,
    paddingBottom: 18,
    flexGrow: 1,
    justifyContent: "flex-end",
    gap: 14,
  },


  emptyWrapper: {
    marginTop: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white_10,
    borderRadius: 12,
    padding: 18,
    backgroundColor: DEFAULT_COLORS.primary_45,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: DEFAULT_COLORS.grays?._200 || DEFAULT_COLORS.white_70,
    textAlign: "center",
  },
});
