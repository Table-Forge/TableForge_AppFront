import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { KnightHeadIcon } from "@/src/components/icons";

import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  Image,
  Pressable,
} from "react-native";

import { useUser } from "@/src/features/users/hooks/use-user";
import { useAvatarPicker } from "@/src/features/users/hooks/use-avatar-picker";
import { LoadingOverlay } from "@/src/components/loading-overlay/loading-overlay";
import { Tabs } from "@/src/components/tabs/tabs";
import { useNavigation } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { ProfileTab } from "@/src/pages-components/profile/profile-tab";
import { CharactersTab } from "@/src/pages-components/profile/characters-tab";
import { CampaignsTab } from "@/src/pages-components/profile/campaigns-tab";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type ITabs = "Perfil" | "Personagens" | "Campanhas";

export default function Profile() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const userId = user?.id ? Number(user.id) : undefined;
  const { data, isPending, refetch } = useUser(userId);

  const [activeTab, setActiveTab] = useState<ITabs>("Perfil");
  const [refreshing, setRefreshing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const { selectAvatar, isUpdatingAvatar } = useAvatarPicker({
    userId,
    onPreview: setAvatarPreview,
  });
  const currentAvatar = avatarPreview ?? data?.avatarUrl;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <>
      <MainContainer>
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

          <View style={styles.groupedIcons}>
            <ActionButton
              variant="circle"
              active
              icon={
                <MaterialDesignIcons
                  name="crown"
                  size={28}
                  color={DEFAULT_COLORS.white}
                />
              }
              onPress={() => navigation.navigate("my-plan")}
            />
            <ActionButton
              variant="circle"
              icon={
                <FontAwesome
                  name="gear"
                  size={24}
                  color={DEFAULT_COLORS.white}
                />
              }
              onPress={() => navigation.navigate("settings")}
            />
          </View>
        </HeaderActions>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={DEFAULT_COLORS.purpleBright}
              colors={[DEFAULT_COLORS.purpleBright]}
            />
          }
        >
          <View style={styles.contentBody}>
            <Pressable
              onPress={selectAvatar}
              disabled={isUpdatingAvatar}
              style={({ pressed }) => [
                styles.avatarContainer,
                pressed && styles.avatarContainerPressed,
              ]}
            >
              {currentAvatar ? (
                <Image
                  source={{ uri: currentAvatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <KnightHeadIcon color={DEFAULT_COLORS.primary} size={90} />
                </View>
              )}

              <View style={styles.avatarEditBadge}>
                {isUpdatingAvatar ? (
                  <ActivityIndicator size="small" color={DEFAULT_COLORS.white} />
                ) : (
                  <Ionicons
                    name="camera"
                    size={18}
                    color={DEFAULT_COLORS.white}
                  />
                )}
              </View>
            </Pressable>

            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileEyebrow}>Aventureiro</ThemedText>
              <ThemedText style={styles.profileNickname}>
                {data?.nickname}
              </ThemedText>
              <ThemedText style={styles.profileUsername}>
                @{data?.username}
              </ThemedText>
            </View>

            <Tabs<ITabs>
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                {
                  label: "Perfil",
                  value: "Perfil",
                  component: <ProfileTab data={data} />,
                },
                {
                  label: "Personagens",
                  value: "Personagens",
                  component: <CharactersTab />,
                },
                {
                  label: "Campanhas",
                  value: "Campanhas",
                  component: <CampaignsTab />,
                },
              ]}
            />
          </View>
        </ScrollView>
      </MainContainer>

      {isPending && !refreshing && <LoadingOverlay />}
    </>
  );
}

const styles = StyleSheet.create({
  contentBody: {
    marginTop: 50,
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
  avatarContainerPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
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
  avatarEditBadge: {
    position: "absolute",
    right: 2,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: DEFAULT_COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: SURFACES.card,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 22,
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
  groupedIcons: {
    flexDirection: "row",
    gap: 10,
  },
});
