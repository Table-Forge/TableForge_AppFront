import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { Input } from "@/src/components/input/input";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { IChatMessage } from "@/src/features/chat-messages/schemas/chat-message.schema";
import { useChatMessages } from "@/src/features/chat-messages/hooks/use-chat-messages";
import { useChatMessagesMutation } from "@/src/features/chat-messages/hooks/use-chat-messages-mutations";
import { CHAT_MESSAGE_KEYS } from "@/src/features/chat-messages/hooks/query-key";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignMembers } from "@/src/features/campaign-members/hooks/use-campaign-members";
import { notify } from "@/src/features/notifications/helpers/notify";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { useSignalR } from "@/src/context/SignalRContext";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

export default function CampaignChatScreen() {
  const { campaignId } = useLocalSearchParams();
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const parsedCampaignId = Number(campaignId);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: campaign } = useCampaign(parsedCampaignId);
  const { data: members = [] } = useCampaignMembers({
    campaignId: parsedCampaignId,
  });
  const {
    data = [],
    isLoading,
    refetch,
  } = useChatMessages({
    campaignId: parsedCampaignId,
  });
  const { createChatMessageMutation, isCreatingChatMessage } =
    useChatMessagesMutation(parsedCampaignId);

  const { connection } = useSignalR();

  useEffect(() => {
    if (!connection || !parsedCampaignId) return;

    connection.invoke("JoinCampaignRoom", parsedCampaignId).catch(console.error);

    const receiveMsg = (campaignMessageDto: IChatMessage) => {
      queryClient.setQueryData(CHAT_MESSAGE_KEYS.byCampaign(parsedCampaignId), (oldData: any) => {
        if (!oldData) return oldData;
        const exists = oldData.items.some((m: IChatMessage) => m.id === campaignMessageDto.id);
        if (exists) return oldData;
        
        return {
          ...oldData,
          items: [campaignMessageDto, ...oldData.items],
        };
      });
    };

    const deleteMsg = (messageId: number) => {
      queryClient.setQueryData(CHAT_MESSAGE_KEYS.byCampaign(parsedCampaignId), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.filter((m: IChatMessage) => m.id !== messageId),
        };
      });
    };

    connection.on("ReceiveCampaignMessage", receiveMsg);
    connection.on("ReceiveCampaignMessageDeleted", deleteMsg);

    return () => {
      connection.off("ReceiveCampaignMessage", receiveMsg);
      connection.off("ReceiveCampaignMessageDeleted", deleteMsg);
      connection.invoke("LeaveCampaignRoom", parsedCampaignId).catch(console.error);
    };
  }, [connection, parsedCampaignId, queryClient]);

  const messages = data;

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
        onSuccess: () => {
          if (campaign) {
            const senderId = Number(user.id);
            const recipientIds = members
              .map((member) => member.userId)
              .filter((id) => id !== senderId);
            notify.newChatMessage({
              memberIds: recipientIds,
              campaignId: parsedCampaignId,
              campaignTitle: campaign.title,
              senderName: user.nickname || user.username || "Aventureiro",
            });
          }
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
          <View style={styles.headerTextContainer}>
            <View style={styles.headerTitleRow}>
              <FontAwesome6
                name="beer-mug-empty"
                size={12}
                color={DEFAULT_COLORS.tertiary}
              />
              <ThemedText style={styles.headerEyebrow}>Taverna</ThemedText>
            </View>
            <ThemedText
              style={styles.headerSubtitle}
              numberOfLines={1}
              weight="bold"
            >
              {campaign?.title || "Campanha"}
            </ThemedText>
          </View>
          <View style={styles.headerSpacer} />
        </HeaderActions>
      </Screen.Header>

      <Screen.Body style={styles.content}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <ThemedText style={styles.sectionTitle}>15 Fev</ThemedText>
          <View style={styles.sectionLine} />
        </View>

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
            <View style={styles.emptyWrapper}>
              <ThemedText style={styles.emptyText}>
                Nenhuma mensagem por aqui.
              </ThemedText>
            </View>
          }
        />
      </Screen.Body>

      <Screen.Footer style={styles.inputBar}>
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
          active
          icon={<Ionicons name="send" size={20} color={DEFAULT_COLORS.white} />}
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
      </Screen.Footer>
    </Screen>
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
    {!isMine && <View style={styles.avatarDot} />}
    <View style={[styles.messageStack, isMine && styles.myMessageStack]}>
      <ThemedText style={[styles.username, isMine && styles.usernameMine]}>
        {isMine ? "Você" : item.username || `Usuário ${item.userId}`}
      </ThemedText>
      <View style={[styles.bubble, isMine && styles.myBubble]}>
        <ThemedText style={styles.messageText}>{item.content}</ThemedText>
      </View>
      <ThemedText style={[styles.messageTime, isMine && styles.myMessageTime]}>
        23:59
      </ThemedText>
    </View>
    {isMine && <View style={styles.avatarDot} />}
  </View>
);

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
    alignItems: "center",
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: DEFAULT_COLORS.tertiary_20,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 22,
    paddingBottom: 18,
    flexGrow: 1,
    justifyContent: "flex-end",
    gap: 14,
  },
  messageRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  messageStack: {
    maxWidth: "82%",
  },
  myMessageStack: {
    alignItems: "flex-end",
  },
  username: {
    marginBottom: 4,
    fontSize: 10,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  usernameMine: {
    color: DEFAULT_COLORS.crown,
    textAlign: "right",
  },
  avatarDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DEFAULT_COLORS.primary_80,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.secondary_30,
    marginBottom: 12,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADII.xs,
    backgroundColor: SURFACES.card,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  myBubble: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
    borderColor: BORDERS.cta,
  },
  messageText: {
    fontSize: 13,
    color: DEFAULT_COLORS.white,
    lineHeight: 17,
  },
  messageTime: {
    marginTop: 2,
    fontSize: 10,
    color: DEFAULT_COLORS.textMuted,
  },
  myMessageTime: {
    textAlign: "right",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDERS.divider,
    backgroundColor: SURFACES.cardAlt,
  },
  inputWrapper: {
    flex: 1,
  },
  sendButtonDisabled: {
    opacity: 0.45,
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
