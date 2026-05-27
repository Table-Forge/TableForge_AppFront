import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { Input } from "@/src/components/input/input";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { IChatMessage } from "@/src/features/chat-messages/schemas/chat-message.schema";
import { useChatMessages } from "@/src/features/chat-messages/hooks/use-chat-messages";
import { useChatMessagesMutation } from "@/src/features/chat-messages/hooks/use-chat-messages-mutations";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignMembers } from "@/src/features/campaign-members/hooks/use-campaign-members";
import { notify } from "@/src/features/notifications/helpers/notify";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";

export default function CampaignChatScreen() {
  const { campaignId } = useLocalSearchParams();
  const { user } = useAuth();
  const { handleBack } = useBackRouter();
  const parsedCampaignId = Number(campaignId);
  const [message, setMessage] = useState("");

  const { data: campaign } = useCampaign(parsedCampaignId);
  const { data: members = [] } = useCampaignMembers({
    campaignId: parsedCampaignId,
  });
  const { data = [], isLoading, refetch } = useChatMessages({
    campaignId: parsedCampaignId,
  });
  const { createChatMessageMutation, isCreatingChatMessage } =
    useChatMessagesMutation(parsedCampaignId);

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
      <Screen.Header>
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
            <View style={styles.headerTitleRow}>
              <FontAwesome5
                name="beer"
                size={14}
                color={DEFAULT_COLORS.purpleBright}
              />
              <ThemedText style={styles.headerEyebrow}>Taverna</ThemedText>
            </View>
            <ThemedText style={styles.headerSubtitle} numberOfLines={1}>
              {campaign?.title || "Campanha"}
            </ThemedText>
          </View>
          <View style={styles.headerSpacer} />
        </HeaderActions>
      </Screen.Header>

      <Screen.Body style={styles.content}>
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
            active
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
      </Screen.Body>
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
    <View style={[styles.bubble, isMine && styles.myBubble]}>
      <ThemedText style={[styles.username, isMine && styles.usernameMine]}>
        {isMine ? "Você" : item.username || `Usuário ${item.userId}`}
      </ThemedText>
      <ThemedText style={styles.messageText}>{item.content}</ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: SURFACES.background,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerEyebrow: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 14,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
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
    gap: 6,
  },
  messageRow: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  myMessageRow: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: SURFACES.card,
    borderWidth: 1,
    borderColor: BORDERS.subtle,
  },
  myBubble: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
    borderColor: DEFAULT_COLORS.orange,
  },
  username: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  usernameMine: {
    color: DEFAULT_COLORS.crown,
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
    paddingTop: 10,
    paddingBottom: 14,
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
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    color: DEFAULT_COLORS.textMuted,
  },
});
