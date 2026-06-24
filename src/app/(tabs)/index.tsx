import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/src/constants/screen-size";
import { Image, StyleSheet, View } from "react-native";

import { Button } from "@/src/components/button/button";
import { advantages, carousel } from "@/src/data/mock";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import Carousel from "react-native-reanimated-carousel";
import FeatherIcons from "react-native-vector-icons/Feather";
import { ActionButton } from "@/src/components/action-button/action-button";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { useAuth } from "@/src/context/auth";
import { useNotifications } from "@/src/features/notifications/hooks/use-notifications";
import { Entypo } from "@expo/vector-icons";
import { KnightHeadIcon } from "@/src/components/icons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : undefined;
  const { data: unreadNotifications } = useNotifications({
    userId,
    read: false,
    size: 1,
    enabled: Boolean(userId),
  });
  const hasUnreadNotifications = (unreadNotifications?.items?.length ?? 0) > 0;

  return (
    <Screen style={styles.screen}>
      <Screen.Header>
        <HeaderActions>
          <ActionButton
            variant="pill"
            icon={
              user?.avatarUrl ? (
                <Image
                  style={styles.avatar}
                  source={{
                    uri: user.avatarUrl,
                  }}
                />
              ) : (
                <KnightHeadIcon size={22} color={DEFAULT_COLORS.white} />
              )
            }
            label={`Bem-vinda, ${user?.nickname || "aventureira"}!`}
            onPress={() => navigation.navigate("profile")}
          />

          <ActionButton
            variant="circle"
            icon={
              <View style={styles.notificationWrapper}>
                <Entypo name="bell" size={22} color={DEFAULT_COLORS.white} />
                {hasUnreadNotifications && (
                  <View style={styles.notificationBadge}>
                    <ThemedText style={styles.notificationBadgeText}>
                      {(unreadNotifications?.pagination?.filteredItems ?? 0) > 99
                        ? "99+"
                        : unreadNotifications?.pagination?.filteredItems ?? 0}
                    </ThemedText>
                  </View>
                )}
              </View>
            }
            onPress={() => navigation.navigate("notifications")}
          />
        </HeaderActions>
      </Screen.Header>

      <Screen.Body scroll showsVerticalScrollIndicator={false}>
          <View style={styles.heroWrapper}>
            <Carousel
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT * 0.32}
              data={carousel}
              loop
              autoPlay
              autoPlayInterval={3500}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxAdjacentItemScale: 0.82,
              }}
              renderItem={({ item }) => (
                <View style={styles.slide}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />

                  <LinearGradient
                    colors={[
                      DEFAULT_COLORS.transparent,
                      DEFAULT_COLORS.overlayDark_45,
                      DEFAULT_COLORS.overlayDark_95,
                    ]}
                    style={styles.heroOverlay}
                  />

                  <View style={styles.heroTextArea}>
                    <View style={styles.heroBadge}>
                      <MaterialDesignIcons
                        name="dice-d20"
                        size={16}
                        color={DEFAULT_COLORS.purpleBright}
                      />
                      <ThemedText style={styles.heroBadgeText}>
                        AVENTURA
                      </ThemedText>
                    </View>

                    <ThemedText weight="bold" style={styles.heroTitle}>
                      {item.title}
                    </ThemedText>

                    <ThemedText style={styles.heroSubtitle}>
                      Encontre sua próxima missão e reúna seu grupo.
                    </ThemedText>
                  </View>

                  <View style={styles.pagination}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
              )}
            />
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrapper}>
              <MaterialDesignIcons
                name="crown"
                size={32}
                color={DEFAULT_COLORS.orange}
              />

              <ThemedText weight="bold" style={styles.sectionTitle}>
                Seja um Nobre!
              </ThemedText>
            </View>

            <View style={styles.sectionLine} />
          </View>

          <View style={styles.nobleCard}>
            <View style={styles.nobleTop}>
              <View style={styles.crownCircle}>
                <LinearGradient
                  colors={[
                    DEFAULT_COLORS.orangeGlow_25,
                    DEFAULT_COLORS.orangeGlow_05,
                  ]}
                  style={styles.crownGlow}
                >
                  <MaterialDesignIcons
                    name="crown"
                    size={32}
                    color={DEFAULT_COLORS.crown}
                  />
                </LinearGradient>
              </View>

              <View style={styles.nobleInfo}>
                <ThemedText weight="bold" style={styles.nobleTitle}>
                  Vantagens da Nobreza
                </ThemedText>

                <View style={styles.benefitsList}>
                  {advantages.map((item, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={styles.checkCircle}>
                        <FeatherIcons
                          name="check"
                          size={13}
                          color={DEFAULT_COLORS.homeSurface}
                        />
                      </View>

                      <ThemedText style={styles.benefitText}>
                        {item.text}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceWrapper}>
              <ThemedText style={styles.priceMuted}>Apenas</ThemedText>

              <ThemedText weight="bold" style={styles.price}>
                R$ 9,99
              </ThemedText>

              <ThemedText style={styles.priceMuted}>/mês</ThemedText>
            </View>

            <Button
              onPress={() => console.log("apertei")}
              variant="tertiary"
              text="Quero Assinar!"
            />
          </View>
      </Screen.Body>
    </Screen>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DEFAULT_COLORS.homeBackground,
  },

  scrollContent: {
    flexGrow: 1,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: "cover",
  },

  notificationWrapper: {
    position: "relative",
  },

  notificationBadge: {
    minWidth: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: DEFAULT_COLORS.danger || DEFAULT_COLORS.orange,
    position: "absolute",
    top: -4,
    right: -6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  
  notificationBadgeText: {
    color: DEFAULT_COLORS.white,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },

  heroWrapper: {
    marginTop: 18,
  },

  slide: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: DEFAULT_COLORS.homeSurface,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_35,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  heroTextArea: {
    position: "absolute",
    left: 26,
    right: 26,
    bottom: 44,
  },

  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: DEFAULT_COLORS.homeSurface_72,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_35,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
  },

  heroBadgeText: {
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  heroTitle: {
    color: DEFAULT_COLORS.white,
    fontSize: 28,
    lineHeight: 34,
  },

  heroSubtitle: {
    color: DEFAULT_COLORS.textMuted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },

  pagination: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
    flexDirection: "row",
    gap: 10,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 20,
    backgroundColor: DEFAULT_COLORS.white_35,
  },

  activeDot: {
    width: 10,
    height: 10,
    backgroundColor: DEFAULT_COLORS.purpleBright,
  },

  sectionHeader: {
    paddingHorizontal: 26,
    marginTop: 28,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  sectionTitle: {
    color: DEFAULT_COLORS.white,
    fontSize: 28,
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: DEFAULT_COLORS.orangeBorder_45,
    marginTop: 4,
  },

  nobleCard: {
    marginHorizontal: 22,
    padding: 22,
    borderRadius: 26,
    backgroundColor: DEFAULT_COLORS.homeSurface,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_35,
    shadowColor: DEFAULT_COLORS.purpleBright,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  nobleTop: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },

  crownCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.orangeGlow_07,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.orangeBorder_45,
  },

  crownGlow: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  nobleInfo: {
    flex: 1,
  },

  nobleTitle: {
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 14,
  },

  benefitsList: {
    gap: 10,
  },

  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.purpleBright,
  },

  benefitText: {
    flex: 1,
    color: DEFAULT_COLORS.white,
    fontSize: 15,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: DEFAULT_COLORS.white_12,
    marginVertical: 22,
  },

  priceWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18,
  },

  priceMuted: {
    color: DEFAULT_COLORS.textMuted,
    fontSize: 16,
    marginBottom: 5,
  },

  price: {
    color: DEFAULT_COLORS.orange,
    fontSize: 34,
    lineHeight: 40,
  },
});
