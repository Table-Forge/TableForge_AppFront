import React from "react";
import { View } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import Svg, { Path } from "react-native-svg";
import Entypo from "react-native-vector-icons/Entypo";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

import { ICONS } from "./tab-bar.constants";
import { styles } from "./tab-bar.styles";
import { DEFAULT_COLORS } from "@/src/theme/colors";

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
                <View style={styles.searchItemButton}>
                  {ICONS["campaigns"](
                    isFocused ? DEFAULT_COLORS.primary : DEFAULT_COLORS.white,
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
