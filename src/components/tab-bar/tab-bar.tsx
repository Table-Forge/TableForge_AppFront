import { useDefaultColors } from "@/src/hooks/useDefaultColors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { View } from "react-native";
import { ICONS } from "./tab-bar.constants";
import { styles } from "./tab-bar.styles";

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const colors = useDefaultColors();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
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
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={
              route.name === "search" ? styles.searchItemWrapper : styles.item
            }
          >
            {route.name === "search" ? (
              <View style={styles.searchItemButton}>
                {ICONS["search"](isFocused ? colors.primary : colors.white) ||
                  label}
              </View>
            ) : (
              ICONS[route.name](isFocused ? colors.tertiary : colors.white) ||
              label
            )}
            {}
          </PlatformPressable>
        );
      })}
    </View>
  );
};
