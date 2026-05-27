import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import { ITabItem, ITabsProps } from "./tabs.interfaces";

export function Tabs<TValue extends string = string>({
  activeTab,
  activeTabLabelStyle,
  activeTabStyle,
  contentStyle,
  hideWhenSingle = true,
  onChange,
  tabLabelStyle,
  tabStyle,
  tabs,
  tabsContainerStyle,
}: ITabsProps<TValue>) {
  const allowedTabs = useMemo(
    () =>
      Array.isArray(tabs)
        ? tabs.filter((item) => item.isAllowed !== false)
        : [],
    [tabs],
  );

  const [internalActiveTab, setInternalActiveTab] = useState<
    TValue | undefined
  >(allowedTabs[0]?.value);

  const currentTabValue = activeTab ?? internalActiveTab;
  const currentTab =
    allowedTabs.find((tab) => tab.value === currentTabValue) ?? allowedTabs[0];

  const handleTabPress = (tab: ITabItem<TValue>) => {
    if (onChange) {
      onChange(tab.value);
      return;
    }

    setInternalActiveTab(tab.value);
  };

  const shouldRenderMenu = !hideWhenSingle || allowedTabs.length > 1;

  return (
    <View style={[styles.tabsWrapper, contentStyle]}>
      {shouldRenderMenu && (
        <View style={[styles.tabsContainer, tabsContainerStyle]}>
          {allowedTabs.map((tab) => {
            const isActive = currentTab?.value === tab.value;

            return (
              <Pressable
                key={tab.value}
                style={({ pressed }) => {
                  const tabStyles = [styles.tab, tabStyle];

                  if (isActive) {
                    tabStyles.push(styles.activeTab, activeTabStyle);
                  }

                  if (pressed) {
                    tabStyles.push(styles.pressedTab);
                  }

                  return tabStyles;
                }}
                onPress={() => handleTabPress(tab)}
              >
                {tab.icon}
                <ThemedText
                  style={[
                    styles.tabLabel,
                    tabLabelStyle,
                    isActive && styles.activeTabLabel,
                    isActive && activeTabLabelStyle,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}

      {currentTab?.component}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    gap: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: SURFACES.fill,
    borderRadius: RADII.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADII.pill,
    flexDirection: "row",
    gap: 6,
  },
  activeTab: {
    backgroundColor: DEFAULT_COLORS.purpleBright,
    shadowColor: DEFAULT_COLORS.purpleBright,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  pressedTab: {
    opacity: 0.85,
  },
  tabLabel: {
    fontSize: 13,
    color: DEFAULT_COLORS.white_64,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  activeTabLabel: {
    color: DEFAULT_COLORS.white,
  },
});
