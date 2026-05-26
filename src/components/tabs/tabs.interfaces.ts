import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface ITabItem<TValue extends string = string> {
  component: ReactNode;
  icon?: ReactNode;
  isAllowed?: boolean;
  label: string;
  value: TValue;
}

export interface ITabsProps<TValue extends string = string> {
  activeTab?: TValue;
  activeTabLabelStyle?: StyleProp<TextStyle>;
  activeTabStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  hideWhenSingle?: boolean;
  onChange?: (value: TValue) => void;
  tabLabelStyle?: StyleProp<TextStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  tabs: ITabItem<TValue>[];
  tabsContainerStyle?: StyleProp<ViewStyle>;
}
