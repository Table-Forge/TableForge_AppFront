import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { KnightHeadIcon } from "@/src/components/icons";
import { InfoCard } from "@/src/components/info-card/info-card";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";

import { styles as infoCardStyles } from "@/src/components/info-card/info-card";
import { useUser } from "@/src/features/users/hooks/use-user";
import { LoadingOverlay } from "@/src/components/loading-overlay/loading-overlay";
import { formatDate } from "@/src/utils/format";
import { Tag } from "@/src/components/tag/tag";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { ParamListBase } from "@react-navigation/native";

export default function Profile() {
  const { user } = useAuth();
  const { handleBack } = useBackRouter();

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const userId = user?.id ? Number(user.id) : undefined;
  const { data, isPending, refetch } = useUser(userId);

  const [activeTab, setActiveTab] = useState("Perfil");
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
              backgroundColor={DEFAULT_COLORS.tertiary}
            />
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

            <View style={styles.profileInfo}>
              <ThemedText style={{ fontWeight: "bold" }}>
                {data?.nickname}
              </ThemedText>
              <ThemedText style={{ opacity: 0.7 }}>{data?.username}</ThemedText>
            </View>

            <View style={styles.tabBar}>
              {["Perfil", "Personagens", "Campanhas"].map((tab) => (
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

            <InfoCard title="Ficha Técnica" onEdit={() => {}}>
              <View style={infoCardStyles.cardContent}>
                <View style={infoCardStyles.cardContentItem}>
                  <ThemedText style={infoCardStyles.cardContentLabel}>
                    Data de Nascimento
                  </ThemedText>
                  <ThemedText style={infoCardStyles.cardContentValue}>
                    {data?.birthDate ? formatDate(data?.birthDate) : "-"}
                  </ThemedText>
                </View>
                <View style={infoCardStyles.cardContentItem}>
                  <ThemedText style={infoCardStyles.cardContentLabel}>
                    Gênero
                  </ThemedText>
                  <ThemedText style={infoCardStyles.cardContentValue}>
                    {data?.gender || "-"}
                  </ThemedText>
                </View>
              </View>
              <View style={infoCardStyles.cardContentItem}>
                <ThemedText style={infoCardStyles.cardContentLabel}>
                  E-mail
                </ThemedText>
                <ThemedText style={infoCardStyles.cardContentValue}>
                  {data?.email || "-"}
                </ThemedText>
              </View>
            </InfoCard>

            <InfoCard title="Preferências de Jogo" onEdit={() => {}}>
              <View style={infoCardStyles.cardContentItem}>
                <ThemedText style={infoCardStyles.cardContentLabel}>
                  Sistema
                </ThemedText>
                <View style={infoCardStyles.cardContent}>
                  <Tag text="Tormenta" />
                  <Tag text="D&D" />
                </View>
              </View>
              <View style={infoCardStyles.cardContentItem}>
                <ThemedText style={infoCardStyles.cardContentLabel}>
                  Classe
                </ThemedText>
                <View style={infoCardStyles.cardContent}>
                  <Tag text="Clérigo" />
                  <Tag text="Artífice" />
                  <Tag text="Samurai" />
                </View>
              </View>
            </InfoCard>

            <InfoCard title="Meu Plano">
              <View style={infoCardStyles.cardContent}>
                <View style={infoCardStyles.cardContentItem}>
                  <ThemedText style={infoCardStyles.cardContentLabel}>
                    Básico
                  </ThemedText>
                </View>
              </View>
            </InfoCard>
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
    flex: 1,
    backgroundColor: DEFAULT_COLORS.primary,
    borderRadius: 30,

    borderWidth: 2,
    borderColor: "rgba(251, 69, 1, 0.3)",

    paddingHorizontal: 20,
    paddingTop: 68,
    minHeight: 600,
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
    backgroundColor: "#777",

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
});
