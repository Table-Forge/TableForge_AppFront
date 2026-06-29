import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { ActionButton } from "@/src/components/action-button/action-button";
import { ChatInput } from "@/src/components/chat-input/chat-input";
import { ChatBubble } from "@/src/components/chat-bubble/chat-bubble";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
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
import { SURFACES } from "@/src/theme/tokens";

export default function CampaignChatScreen() {
  const { campaignId } = useLocalSearchParams();
  const router = useRouter();
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
          renderItem={({ item }) => {
            const isMine = item.userId === user?.id;
            const member = members?.find((m) => m.userId === item.userId);
            const isAdmin = member?.role === "Master";
            
            const displayName = isAdmin
              ? `Mestre ${member?.username || item.username}`
              : member?.characterName
              ? `${member.characterName} (${member.username || item.username})`
              : (item.username || `Usuário ${item.userId}`);
              
            const avatar = isAdmin
              ? (member?.userImageUrl || undefined)
              : (member?.characterImageUrl || undefined);

            return (
              <ChatBubble
                content={item.content}
                isMine={isMine}
                timeText="23:59"
                avatarUrl={avatar}
                senderName={displayName}
                showAvatar={true}
                onAvatarPress={!isMine ? () => router.push({ pathname: "/user/[id]", params: { id: item.userId }}) : undefined}
              />
            );
          }}
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

      <ChatInput
        value={message}
        onChangeText={setMessage}
        onSend={handleSendMessage}
        isSending={isCreatingChatMessage}
        placeholder="Escreva uma mensagem"
        backgroundColor={SURFACES.background}
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
    paddingBottom: 80,
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
