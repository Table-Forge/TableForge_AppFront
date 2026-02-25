import React from "react";
import { View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import Svg, { Path } from "react-native-svg";
import Entypo from "react-native-vector-icons/Entypo";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

import { ICONS } from "./tab-bar.constants";
import { DEFAULT_COLORS } from "@/src/theme/colors";

import { Platform, StyleSheet } from "react-native";

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) => {
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
          d="M0,0 H160 C150,100 250,100 240,0 H400 V100 H0 Z"
          fill={DEFAULT_COLORS.primary}
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
                ICONS[route.name]?.(
                  isFocused ? DEFAULT_COLORS.tertiary : DEFAULT_COLORS.white,
                ) || label
              )}

              {isFocused && route.name !== "campaigns" && (
                <Entypo
                  name="dot-single"
                  color={DEFAULT_COLORS.tertiary}
                  size={16}
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
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 85 : 70,
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
    width: 65,
    height: 65,
    borderRadius: 35,
    position: "absolute",
    left: "50%",
    marginLeft: -32.5,
    top: -55,

    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,

    borderWidth: 2,
    borderColor: DEFAULT_COLORS.primary,
  },
  searchItemButtonFocused: {
    backgroundColor: DEFAULT_COLORS.primary,
    borderColor: DEFAULT_COLORS.tertiary,
    borderWidth: 1,
  },
});
