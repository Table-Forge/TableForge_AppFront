import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { Input } from "@/src/components/input/input";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { IChatMessage } from "@/src/features/chat-messages/schemas/chat-message.schema";
import { useChatMessages } from "@/src/features/chat-messages/hooks/use-chat-messages";
import { useChatMessagesMutation } from "@/src/features/chat-messages/hooks/use-chat-messages-mutations";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function CampaignChatScreen() {
  const { campaignId } = useLocalSearchParams();
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const parsedCampaignId = Number(campaignId);
  const [message, setMessage] = useState("");

  const { data: campaign } = useCampaign(parsedCampaignId);
  const { data = [], isLoading, refetch } = useChatMessages({
    campaignId: parsedCampaignId,
  });
  const { createChatMessageMutation, isCreatingChatMessage } =
    useChatMessagesMutation(parsedCampaignId);

  const messages = useMemo(() => [...data].reverse(), [data]);

  const handleSendMessage = () => {
    const content = message.trim();

    if (!content || !user?.id) return;

    createChatMessageMutation.mutate(
      {
        campaignId: parsedCampaignId,
        userId: user.id,
        content,
      },
      {
        onSuccess: () => setMessage(""),
      },
    );
  };

  return (
    <MainContainer style={styles.container}>
      <HeaderActions>
        <ActionButton
          variant="circle"
          icon={
            <Ionicons
              name="arrow-back"
              size={22}
              color={DEFAULT_COLORS.white}
            />
          }
          onPress={handleBack}
        />
        <View style={styles.headerTextContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
             <FontAwesome5 name="beer" size={16} color={DEFAULT_COLORS.white} />
             <ThemedText style={styles.headerTitle}>Taverna</ThemedText>
          </View>
          <ThemedText style={styles.headerSubtitle} numberOfLines={1}>
            {campaign?.title || "Campanha"}
          </ThemedText>
        </View>
        <View style={styles.headerSpacer} />
      </HeaderActions>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MessageBubble item={item} isMine={item.userId === user?.id} />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              Nenhuma mensagem por aqui.
            </ThemedText>
          }
        />

        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <Input
              value={message}
              onChangeText={setMessage}
              placeholder="Escreva uma mensagem"
              editable={!isCreatingChatMessage}
            />
          </View>
          <ActionButton
            variant="circle"
            icon={
              <Ionicons
                name="send"
                size={20}
                color={DEFAULT_COLORS.white}
              />
            }
            onPress={
              isCreatingChatMessage || !message.trim()
                ? undefined
                : handleSendMessage
            }
            style={
              isCreatingChatMessage || !message.trim()
                ? styles.sendButtonDisabled
                : null
            }
          />
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
}

const MessageBubble = ({
  item,
  isMine,
}: {
  item: IChatMessage;
  isMine: boolean;
}) => (
  <View style={[styles.messageRow, isMine && styles.myMessageRow]}>
    <View style={[styles.bubble, isMine && styles.myBubble]}>
      <ThemedText style={styles.username}>
        {isMine ? "Você" : item.username || `Usuário ${item.userId}`}
      </ThemedText>
      <ThemedText style={styles.messageText}>{item.content}</ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: DEFAULT_COLORS.background,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: DEFAULT_COLORS.grays._300,
  },
  headerSpacer: {
    width: 45,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageRow: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  myMessageRow: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "82%",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.15)",
  },
  myBubble: {
    backgroundColor: DEFAULT_COLORS.tertiary_30,
    borderColor: DEFAULT_COLORS.tertiary,
  },
  username: {
    fontSize: 11,
    color: DEFAULT_COLORS.tertiary,
    marginBottom: 4,
    ...fonts.bold,
  },
  messageText: {
    fontSize: 15,
    color: DEFAULT_COLORS.white,
    lineHeight: 20,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  inputWrapper: {
    flex: 1,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    color: DEFAULT_COLORS.grays._300,
  },
});
