import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Mail } from "lucide-react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { KnightHeadIcon } from "@/src/components/icons";
import { LoadingOverlay } from "@/src/components/loading-overlay/loading-overlay";
import { Screen } from "@/src/components/screen/screen";
import { Tabs } from "@/src/components/tabs/tabs";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useFriendshipWithUser } from "@/src/features/friendships/hooks/use-friendship-with-user";
import { useFriendshipsMutation } from "@/src/features/friendships/hooks/use-friendships-mutations";
import { notify } from "@/src/features/notifications/helpers/notify";
import { useUser } from "@/src/features/users/hooks/use-user";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { useCreateDirectConversation } from "@/src/features/conversations/hooks/use-create-direct-conversation";
import { ConversationType } from "@/src/features/conversations/schemas/conversation.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
import { CampaignsTab } from "@/src/pages-components/profile/campaigns-tab";
import { CharactersTab } from "@/src/pages-components/profile/characters-tab";
import { ProfileTab } from "@/src/pages-components/profile/profile-tab";

type ITabs = "Perfil" | "Personagens" | "Campanhas";

export default function PublicUserProfileScreen() {
  const { user: currentUser } = useAuth();
  const { handleBack } = useBackRouter();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userId = Number(id);
  const { data: user, isPending, isError } = useUser(userId, true);
  const [activeTab, setActiveTab] = useState<ITabs>("Perfil");

  const { mutate: createChat, isPending: isCreatingChat } = useCreateDirectConversation();

  const currentUserId = currentUser?.id ? Number(currentUser.id) : undefined;
  const isSelf = currentUserId === userId;

  const {
    friendship,
    isRequester,
    isLoading: isLoadingFriendship,
  } = useFriendshipWithUser({
    currentUserId,
    otherUserId: userId,
  });

  const {
    createFriendshipMutation,
    updateFriendshipMutation,
    deleteFriendshipMutation,
    isCreatingFriendship,
    isUpdatingFriendship,
    isDeletingFriendship,
  } = useFriendshipsMutation();

  const isMutatingFriendship =
    isCreatingFriendship || isUpdatingFriendship || isDeletingFriendship;

  const requesterName =
    currentUser?.nickname || currentUser?.username || "Aventureiro";
  const accepterName =
    currentUser?.nickname || currentUser?.username || "Aventureiro";

  const handleSendRequest = () => {
    if (!currentUserId || !user) return;

    createFriendshipMutation.mutate(
      { requesterId: currentUserId, receiverId: userId },
      {
        onSuccess: () => {
          notify.friendshipRequest({
            receiverId: userId,
            requesterId: currentUserId,
            requesterName,
          });
        },
      },
    );
  };

  const handleAccept = () => {
    if (!friendship || !currentUserId) return;

    updateFriendshipMutation.mutate(
      { id: friendship.id, status: "Accepted" },
      {
        onSuccess: () => {
          notify.friendshipAccepted({
            requesterId: friendship.requesterId,
            accepterId: currentUserId,
            accepterName,
          });
        },
      },
    );
  };

  const handleDecline = () => {
    if (!friendship) return;
    updateFriendshipMutation.mutate({
      id: friendship.id,
      status: "Declined",
    });
  };

  const handleRemove = () => {
    if (!friendship) return;
    deleteFriendshipMutation.mutate(friendship.id);
  };

  const handleMessagePress = () => {
    if (!currentUserId || !user) return;
    createChat(
      { type: ConversationType.Direct, otherUserId: userId },
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

  if (isPending) {
    return (
      <Screen style={styles.centerContainer}>
        <ActivityIndicator color={DEFAULT_COLORS.purpleBright} />
        <ThemedText style={styles.feedbackText}>
          Carregando perfil...
        </ThemedText>
      </Screen>
    );
  }

  if (isError || !user) {
    return (
      <Screen style={styles.centerContainer}>
        <ThemedText style={styles.feedbackText}>
          Perfil não encontrado.
        </ThemedText>
      </Screen>
    );
  }

  return (
    <>
      <Screen style={styles.container}>
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
              onPress={handleBack}
            />
            <View style={styles.headerSpacer} />
          </HeaderActions>
        </Screen.Header>

        <Screen.Body scroll showsVerticalScrollIndicator={false}>
          <View style={styles.contentBody}>
            <View style={styles.avatarContainer}>
              {user.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <KnightHeadIcon color={DEFAULT_COLORS.primary} size={90} />
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileEyebrow}>Perfil</ThemedText>
              {!!user.nickname && (
                <ThemedText style={styles.profileNickname}>
                  {user.nickname}
                </ThemedText>
              )}
              <ThemedText style={styles.profileUsername}>
                @{user.username}
              </ThemedText>
            </View>

            {!isSelf && (
              <FriendshipActions
                isLoadingFriendship={isLoadingFriendship}
                isMutating={isMutatingFriendship}
                friendshipStatus={friendship?.status}
                isRequester={isRequester}
                onSendRequest={handleSendRequest}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onRemove={handleRemove}
                onMessagePress={handleMessagePress}
              />
            )}

            <Tabs<ITabs>
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                {
                  label: "Perfil",
                  value: "Perfil",
                  component: <ProfileTab data={user} />,
                },
                {
                  label: "Personagens",
                  value: "Personagens",
                  component: <CharactersTab userId={userId} />,
                },
                {
                  label: "Campanhas",
                  value: "Campanhas",
                  component: <CampaignsTab userId={userId} />,
                },
              ]}
            />
          </View>
        </Screen.Body>
      </Screen>

      {(isPending || isCreatingChat) && <LoadingOverlay />}
    </>
  );
}

interface FriendshipActionsProps {
  isLoadingFriendship: boolean;
  isMutating: boolean;
  friendshipStatus?: string;
  isRequester: boolean;
  onSendRequest: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onRemove: () => void;
  onMessagePress: () => void;
}

const FriendshipActions = ({
  isLoadingFriendship,
  isMutating,
  friendshipStatus,
  isRequester,
  onSendRequest,
  onAccept,
  onDecline,
  onRemove,
  onMessagePress,
}: FriendshipActionsProps) => {
  const isPending = friendshipStatus === "Pending";
  const isAccepted = friendshipStatus === "Accepted";
  const canSendRequest =
    !friendshipStatus ||
    friendshipStatus === "None" ||
    friendshipStatus === "Declined";

  return (
    <View style={styles.actionsWrapper}>
      {isLoadingFriendship ? (
        <ActivityIndicator color={DEFAULT_COLORS.purpleBright} />
      ) : (
        <>
          {canSendRequest && (
            <FriendshipPill
              loading={isMutating}
              onPress={onSendRequest}
              icon={
                <Ionicons
                  name="person-add"
                  size={15}
                  color={DEFAULT_COLORS.white}
                />
              }
              label="Adicionar amigo"
              active
            />
          )}

          {isPending && isRequester && (
            <FriendshipPill
              loading={isMutating}
              onPress={onRemove}
              icon={
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={DEFAULT_COLORS.white}
                />
              }
              label="Cancelar solicitação"
            />
          )}

          {isPending && !isRequester && (
            <>
              <FriendshipPill
                loading={isMutating}
                onPress={onAccept}
                icon={
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={DEFAULT_COLORS.white}
                  />
                }
                label="Aceitar"
                active
              />
              <FriendshipPill
                loading={isMutating}
                onPress={onDecline}
                icon={
                  <Ionicons
                    name="close"
                    size={15}
                    color={DEFAULT_COLORS.white}
                  />
                }
                label="Recusar"
              />
            </>
          )}

          {isAccepted && (
            <>
              <FriendshipPill
                loading={isMutating}
                onPress={onRemove}
                icon={
                  <Ionicons
                    name="person-remove"
                    size={15}
                    color={DEFAULT_COLORS.white}
                  />
                }
                label="Desfazer amizade"
              />
              <ActionButton
                variant="circle"
                style={styles.smallActionButton}
                icon={<Mail size={16} color={DEFAULT_COLORS.purpleBright} />}
                onPress={onMessagePress}
              />
            </>
          )}

          <ActionButton
            variant="circle"
            style={styles.smallActionButton}
            icon={
              <MaterialDesignIcons
                name="block-helper"
                size={16}
                color={DEFAULT_COLORS.danger}
              />
            }
            onPress={() => { }}
          />
        </>
      )}
    </View>
  );
};

interface FriendshipPillProps {
  loading?: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const FriendshipPill = ({
  loading,
  onPress,
  icon,
  label,
  active = false,
}: FriendshipPillProps) => {
  if (loading) {
    return (
      <View style={styles.friendshipPillLoading}>
        <ActivityIndicator
          color={active ? DEFAULT_COLORS.white : DEFAULT_COLORS.purpleBright}
          size="small"
        />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.friendshipPill,
        active && styles.friendshipPillActive,
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
      ]}
    >
      {icon}
      <ThemedText weight="bold" style={styles.friendshipPillLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACES.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: SURFACES.background,
  },
  headerSpacer: { width: 45 },
  feedbackText: {
    color: DEFAULT_COLORS.textMuted,
    textAlign: "center",
  },
  contentBody: {
    marginTop: 60,
    marginHorizontal: 14,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.xxl,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    paddingHorizontal: 14,
    paddingTop: 70,
    paddingBottom: 20,
    position: "relative",
    ...SHADOWS.soft,
  },
  avatarContainer: {
    alignSelf: "center",
    position: "absolute",
    top: -56,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: BORDERS.highlightStrong,
    backgroundColor: SURFACES.fill,
    shadowColor: DEFAULT_COLORS.purpleBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 12,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: SURFACES.cardAlt,
    borderWidth: 2,
    borderColor: BORDERS.highlightStrong,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: DEFAULT_COLORS.purpleBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 12,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
    gap: 2,
  },
  profileEyebrow: {
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
    marginBottom: 2,
  },
  profileNickname: {
    fontSize: 20,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  profileUsername: {
    fontSize: 13,
    color: DEFAULT_COLORS.textMuted,
  },
  actionsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 22,
    width: "100%",
  },
  smallActionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  friendshipPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    backgroundColor: SURFACES.fill,
    height: 38,
  },
  friendshipPillActive: {
    borderColor: BORDERS.cta,
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
  },
  friendshipPillLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    backgroundColor: SURFACES.fill,
    minWidth: 100,
    height: 38,
  },
  friendshipPillLabel: {
    color: DEFAULT_COLORS.white,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
