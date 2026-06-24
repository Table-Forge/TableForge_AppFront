import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import Svg, { Path } from "react-native-svg";
import Entypo from "react-native-vector-icons/Entypo";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

import { ICONS } from "./tab-bar.constants";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useAuth } from "@/src/context/auth";
import { useNotifications } from "@/src/features/notifications/hooks/use-notifications";
import { useInfiniteConversations } from "@/src/features/conversations/hooks/use-infinite-conversations";

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) => {
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : undefined;

  const notificationsQuery = useNotifications({
    page: 1,
    size: 50,
    userId,
    enabled: Boolean(userId),
  });
  const unreadNotificationsCount =
    notificationsQuery.data?.items?.filter((n) => !n.read).length || 0;

  const conversationsQuery = useInfiniteConversations({ size: 50 });
  const unreadMessagesCount =
    conversationsQuery.data?.pages.reduce(
      (total, page) =>
        total +
        page.items.reduce((sum, conv) => sum + conv.unreadMessagesCount, 0),
      0,
    ) || 0;

  return (
    <View style={styles.containerWrapper}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 100"
        style={styles.svgBackground}
        preserveAspectRatio="none"
      >
        <Path
          d="M28,0 H160 C150,100 250,100 240,0 H372 Q400,0 400,28 V100 H0 V28 Q0,0 28,0 Z"
          fill={DEFAULT_COLORS.primary_78}
          stroke={DEFAULT_COLORS.secondary_24}
          strokeWidth={1}
        />
      </Svg>

      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label = options.tabBarLabel ?? options.title ?? route.name;

          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({
                name: route.name,
                merge: true,
                params: route.params,
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const badgeCount =
            route.name === "notifications"
              ? unreadNotificationsCount
              : route.name === "messages"
                ? unreadMessagesCount
                : 0;
          const hasBadge = badgeCount > 0;

          return (
            <PlatformPressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={
                route.name === "campaigns"
                  ? styles.searchItemWrapper
                  : styles.item
              }
            >
              {route.name === "campaigns" ? (
                <View
                  style={[
                    styles.searchItemButton,
                    isFocused && styles.searchItemButtonFocused,
                  ]}
                >
                  {ICONS["campaigns"](
                    isFocused ? DEFAULT_COLORS.tertiary : DEFAULT_COLORS.white,
                  ) || label}
                </View>
              ) : (
                <View style={styles.iconWrapper}>
                  {ICONS[route.name]?.(
                    isFocused ? DEFAULT_COLORS.tertiary : DEFAULT_COLORS.white,
                  ) || label}

                  {hasBadge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {isFocused && route.name !== "campaigns" && (
                <Entypo
                  name="dot-single"
                  color={DEFAULT_COLORS.tertiary}
                  size={16}
                  style={styles.focusedDot}
                />
              )}
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  containerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    height: Platform.OS === "ios" ? 88 : 74,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "visible",
  },
  svgBackground: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26,
    shadowRadius: 14,
    elevation: 10,
    zIndex: 0,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingBottom: Platform.OS === "ios" ? 15 : 0,
  },
  searchItemWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
    zIndex: 2,
  },
  searchItemButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.secondary,
    width: 68,
    height: 68,
    borderRadius: 34,
    position: "absolute",
    left: "50%",
    marginLeft: -34,
    top: Platform.OS === "ios" ? -50 : -48,

    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,

    borderWidth: 2,
    borderColor: DEFAULT_COLORS.secondary_28,
  },
  searchItemButtonFocused: {
    backgroundColor: DEFAULT_COLORS.primary,
    borderColor: DEFAULT_COLORS.secondary_42,
    borderWidth: 1,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: DEFAULT_COLORS.danger || "#ef4444",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    zIndex: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  focusedDot: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 12 : -4,
  },
});
