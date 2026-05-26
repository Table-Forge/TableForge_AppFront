import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
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
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary_30,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 6,
  },
  activeTab: {
    backgroundColor: DEFAULT_COLORS.tertiary,
  },
  pressedTab: {
    opacity: 0.88,
  },
  tabLabel: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
    fontWeight: "bold",
  },
  activeTabLabel: {
    color: DEFAULT_COLORS.white,
  },
});
