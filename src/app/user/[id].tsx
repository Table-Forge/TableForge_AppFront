import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Mail } from "lucide-react-native";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { KnightHeadIcon } from "@/src/components/icons";
import { LoadingOverlay } from "@/src/components/loading-overlay/loading-overlay";
import { MainContainer } from "@/src/components/main-container/main-container";
import { Tabs } from "@/src/components/tabs/tabs";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { notify } from "@/src/features/notifications/helpers/notify";
import { useUser } from "@/src/features/users/hooks/use-user";
import { useBackRouter } from "@/src/hooks/use-back-route";
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
  const { id } = useLocalSearchParams();
  const userId = Number(id);
  const { data: user, isPending, isError } = useUser(userId);
  const [activeTab, setActiveTab] = useState<ITabs>("Perfil");
  const [isFriend] = useState(false);

  const isSelf = currentUser?.id === userId;

  const handleFriendshipRequest = () => {
    if (!currentUser?.id || !user) return;
    notify.friendshipRequest({
      receiverId: userId,
      requesterId: Number(currentUser.id),
      requesterName:
        currentUser.nickname || currentUser.username || "Aventureiro",
    });
  };

  if (isPending) {
    return (
      <MainContainer style={styles.centerContainer}>
        <ActivityIndicator color={DEFAULT_COLORS.purpleBright} />
        <ThemedText style={styles.feedbackText}>
          Carregando perfil...
        </ThemedText>
      </MainContainer>
    );
  }

  if (isError || !user) {
    return (
      <MainContainer style={styles.centerContainer}>
        <ThemedText style={styles.feedbackText}>
          Perfil não encontrado.
        </ThemedText>
      </MainContainer>
    );
  }

  return (
    <>
      <MainContainer style={styles.container}>
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

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
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
              <ThemedText style={styles.profileEyebrow}>Aventureiro</ThemedText>
              <ThemedText style={styles.profileNickname}>
                {user.nickname}
              </ThemedText>
              <ThemedText style={styles.profileUsername}>
                @{user.username}
              </ThemedText>
            </View>

            {!isSelf && (
              <View style={styles.actionsRow}>
                <ActionButton
                  variant="circle"
                  active={!isFriend}
                  icon={
                    <Ionicons
                      name={isFriend ? "person-remove" : "person-add"}
                      size={20}
                      color={DEFAULT_COLORS.white}
                    />
                  }
                  onPress={handleFriendshipRequest}
                />
                <ActionButton
                  variant="circle"
                  icon={<Mail size={20} color={DEFAULT_COLORS.purpleBright} />}
                  onPress={() => {}}
                />
                <ActionButton
                  variant="circle"
                  icon={
                    <MaterialDesignIcons
                      name="block-helper"
                      size={20}
                      color={DEFAULT_COLORS.danger}
                    />
                  }
                  onPress={() => {}}
                />
              </View>
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
        </ScrollView>
      </MainContainer>

      {isPending && <LoadingOverlay />}
    </>
  );
}

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
    marginTop: 50,
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
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
  },
});
