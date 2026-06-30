import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Toast from "react-native-toast-message";

import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { authTokenStore } from "@/src/features/auth-token-store";
import { useConversationMutations } from "@/src/features/conversations/hooks/use-conversation-mutations";
import { ConversationType } from "@/src/features/conversations/schemas/conversation.schema";
import { useUserFriendships } from "@/src/features/friendships/hooks/use-user-friendships";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";

interface NewDirectChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NewDirectChatModal = ({ visible, onClose }: NewDirectChatModalProps) => {
  const router = useRouter();
  const authData = authTokenStore.getAuthData();
  const myUserId = Number(authData?.user?.id);

  const { data: friends, isLoading } = useUserFriendships({
    userId: authData?.user?.id, // Keep original for hook
    status: "Accepted",
    page: 1,
    size: 100,
    enabled: visible,
  });

  const { createDirectConversationMutation } = useConversationMutations();
  const { mutate: createChat, isPending } = createDirectConversationMutation;

  const handleCreateChat = (otherUserId: number) => {
    onClose();
    createChat(
      { type: ConversationType.Direct, otherUserId },
      {
        onSuccess: (conversation) => {
          router.push({
            pathname: "/direct-chat/[conversationId]",
            params: { conversationId: conversation.id },
          });
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: "Ops!",
            text2: err?.response?.data?.message || err.message || "Erro ao iniciar conversa.",
          });
        },
      }
    );
  };

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      title="Selecionar Amigo"
      showFooter={false}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color={DEFAULT_COLORS.secondary} style={styles.loader} />
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={friends || []}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const reqId = Number(item.requesterId);
              const recId = Number(item.receiverId);
              const otherUserId = reqId === myUserId ? recId : reqId;
              const otherUserNickname =
                reqId === myUserId
                  ? item.receiverNickname
                  : item.requesterNickname;

              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleCreateChat(otherUserId)}
                  disabled={isPending}
                >
                  <View style={styles.avatar}>
                    <FontAwesome5 name="user" size={18} color={DEFAULT_COLORS.secondary} />
                  </View>
                  <ThemedText style={styles.name}>{otherUserNickname || "Usuário"}</ThemedText>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <ThemedText style={styles.empty}>Nenhum amigo encontrado.</ThemedText>
            }
          />
        </View>
      )}
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginVertical: 40,
  },
  listContainer: {
    maxHeight: 400, // Limit height since it's inside a modal
  },
  list: {
    gap: 12,
    paddingVertical: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACES.background,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.divider,
    padding: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACES.fill,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
  },
  name: {
    fontSize: 16,
    color: DEFAULT_COLORS.white,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: DEFAULT_COLORS.textMuted,
    marginVertical: 20,
  },
});
