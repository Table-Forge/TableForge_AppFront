import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { KnightHeadIcon } from "@/src/components/icons";

import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";

import { useUser } from "@/src/features/users/hooks/use-user";
import { LoadingOverlay } from "@/src/components/loading-overlay/loading-overlay";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { ParamListBase } from "@react-navigation/native";
import { ProfileTab } from "@/src/pages-components/profile/profile-tab";
import { CharactersTab } from "@/src/pages-components/profile/characters-tab";
import { CampaignsTab } from "@/src/pages-components/profile/campaigns-tab";
import { fonts } from "@/src/theme/fonts";
import { MenuPopup } from "@/src/components/menu-popup/menu-popup";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Mail } from "lucide-react-native";

const TABS = ["Perfil", "Personagens", "Campanhas"] as const;
type ITabs = (typeof TABS)[number];

export default function Profile() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const userId = user?.id ? Number(user.id) : undefined;
  const { data, isPending, refetch } = useUser(userId);

  const [activeTab, setActiveTab] = useState<ITabs>("Perfil");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <>
      <MainContainer>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={DEFAULT_COLORS.tertiary}
              colors={[DEFAULT_COLORS.tertiary]}
            />
          }
        >
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
                icon={
                  <MaterialIcons
                    name="diamond"
                    size={28}
                    color={DEFAULT_COLORS.white}
                  />
                }
                onPress={() => navigation.navigate("my-plan")}
                backgroundColor={DEFAULT_COLORS.tertiary}
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

          <View style={styles.contentBody}>
            <View style={styles.avatarContainer}>
              {data?.avatarUrl ? (
                <Image
                  source={{ uri: data?.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <KnightHeadIcon color={DEFAULT_COLORS.primary} size={90} />
                </View>
              )}
            </View>

            <View style={styles.menuPopupWrapper}>
              <MenuPopup
                trigger={
                  <MaterialDesignIcons
                    name="dots-horizontal-circle-outline"
                    size={32}
                    color={DEFAULT_COLORS.white}
                  />
                }
                options={[
                  {
                    label: "Enviar Mensagem",
                    icon: <Mail size={18} color={DEFAULT_COLORS.tertiary} />,
                    onPress: () => {},
                  },
                  {
                    label: "Remover Amigo",
                    icon: (
                      <Ionicons
                        name="person-remove-outline"
                        size={18}
                        color={DEFAULT_COLORS.tertiary}
                      />
                    ),
                    onPress: () => {},
                  },
                  {
                    label: "Bloquear",
                    icon: (
                      <MaterialDesignIcons
                        name="block-helper"
                        size={18}
                        color={DEFAULT_COLORS.tertiary}
                      />
                    ),
                    onPress: () => {},
                  },
                ]}
              />
            </View>

            <View style={styles.profileInfo}>
              <ThemedText style={{ ...fonts.bold }}>
                {data?.nickname}
              </ThemedText>
              <ThemedText style={{ opacity: 0.7 }}>{data?.username}</ThemedText>
            </View>

            <View style={styles.tabBar}>
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabItem,
                    activeTab === tab && styles.tabItemActive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <ThemedText
                    style={{
                      color: DEFAULT_COLORS.white,
                    }}
                  >
                    {tab}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === "Perfil" && <ProfileTab data={data} />}

            {activeTab === "Personagens" && <CharactersTab />}

            {activeTab === "Campanhas" && <CampaignsTab />}
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
    backgroundColor: DEFAULT_COLORS.primary,
    borderRadius: 20,

    borderWidth: 2,
    borderColor: DEFAULT_COLORS.tertiary_30,

    paddingHorizontal: 10,
    paddingTop: 68,
    paddingBottom: 20,
    position: "relative",
  },
  avatarContainer: {
    alignSelf: "center",
    position: "absolute",
    top: -50,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: DEFAULT_COLORS.tertiary,
    backgroundColor: DEFAULT_COLORS.grays._300,

    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,

    elevation: 12,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: DEFAULT_COLORS.background,
    borderWidth: 3,
    borderColor: DEFAULT_COLORS.tertiary,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,

    elevation: 12,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: DEFAULT_COLORS.background,
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: DEFAULT_COLORS.primary,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary,
  },
  groupedIcons: {
    flexDirection: "row",
    gap: 10,
  },
  menuPopupWrapper: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});
