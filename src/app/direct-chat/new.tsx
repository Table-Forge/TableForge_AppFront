import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { Screen } from "@/src/components/screen/screen";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { ActionButton } from "@/src/components/action-button/action-button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { authTokenStore } from "@/src/features/auth-token-store";
import { useConversationMutations } from "@/src/features/conversations/hooks/use-conversation-mutations";
import { ConversationType } from "@/src/features/conversations/schemas/conversation.schema";
import { useUserFriendships } from "@/src/features/friendships/hooks/use-user-friendships";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

export default function NewDirectChat() {
  const router = useRouter();
  const authData = authTokenStore.getAuthData();
  const myUserId = authData?.user?.id;

  const { data: friends, isLoading } = useUserFriendships({
    userId: myUserId,
    status: "Accepted",
    page: 1,
    size: 100,
  });

  const { createDirectConversationMutation } = useConversationMutations();
  const { mutate: createChat, isPending } = createDirectConversationMutation;

  const handleCreateChat = (otherUserId: number) => {
    createChat(
      { type: ConversationType.Direct, otherUserId },
      {
        onSuccess: (conversation) => {
          const otherParticipant = conversation.participants?.find(
            (p) => p.userId !== myUserId,
          );
          router.replace({
            pathname: "/direct-chat/[conversationId]",
            params: {
              conversationId: conversation.id,
              title: conversation.name || "Usuário",
              otherUserId: otherParticipant?.userId ?? "",
              avatarUrl: otherParticipant?.avatarUrl ?? "",
            },
          });
        },
      }
    );
  };

  return (
    <Screen style={styles.screen}>
      <Screen.Header>
        <HeaderActions>
          <ActionButton
            variant="circle"
            icon={
              <Ionicons
                name="arrow-back"
                size={24}
                color={DEFAULT_COLORS.white}
              />
            }
            onPress={() => router.back()}
          />
          <ThemedText style={styles.headerTitle}>Selecionar Amigo</ThemedText>
          <View style={styles.headerSpacer} />
        </HeaderActions>
      </Screen.Header>
      <Screen.Body>
        {isLoading ? (
          <ActivityIndicator size="large" color={DEFAULT_COLORS.secondary} style={styles.loader} />
        ) : (
          <FlatList
            data={friends || []}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const otherUserId =
                item.requesterId === myUserId ? item.receiverId : item.requesterId;
              const otherUserNickname =
                item.requesterId === myUserId
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
        )}
      </Screen.Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DEFAULT_COLORS.background,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    padding: 14,
    ...SHADOWS.soft,
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
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: DEFAULT_COLORS.white,
  },
  headerSpacer: {
    width: 45,
  },
});
