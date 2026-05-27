import React, { PropsWithChildren, useContext, useMemo } from "react";
import { useSegments } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOTTOM_TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 74;

type ScreenContextValue = {
  edgeToEdge: boolean;
  hasBottomTabs: boolean;
  hasFooter: boolean;
};

const ScreenContext = React.createContext<ScreenContextValue>({
  edgeToEdge: false,
  hasBottomTabs: false,
  hasFooter: false,
});

interface ScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  /**
   * Quando true, o container ignora o safe-area-top.
   * Use em telas com banner/hero que devem se estender por baixo da status bar.
   */
  edgeToEdge?: boolean;
  /**
   * Envolve o conteúdo num KeyboardAvoidingView (padding/height por plataforma).
   */
  keyboardAware?: boolean;
}

export function Screen({
  children,
  style,
  edgeToEdge = false,
  keyboardAware = false,
}: ScreenProps) {
  const segments = useSegments();
  const hasBottomTabs = segments[0] === "(tabs)";

  const hasFooter = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) && (child.type as any) === ScreenFooter,
  );

  const ctx = useMemo<ScreenContextValue>(
    () => ({ edgeToEdge, hasBottomTabs, hasFooter }),
    [edgeToEdge, hasBottomTabs, hasFooter],
  );

  if (keyboardAware) {
    return (
      <ScreenContext.Provider value={ctx}>
        <KeyboardAvoidingView
          style={[styles.screen, style]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {children}
        </KeyboardAvoidingView>
      </ScreenContext.Provider>
    );
  }

  return (
    <ScreenContext.Provider value={ctx}>
      <View style={[styles.screen, style]}>{children}</View>
    </ScreenContext.Provider>
  );
}

interface HeaderProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

function ScreenHeader({ children, style }: HeaderProps) {
  const { edgeToEdge } = useContext(ScreenContext);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: edgeToEdge ? 0 : insets.top },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface BodyProps extends PropsWithChildren {
  /**
   * Quando true, renderiza como ScrollView. Caso contrário, View.
   */
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  refreshControl?: ScrollViewProps["refreshControl"];
  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
}

function ScreenBody({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  refreshControl,
  keyboardShouldPersistTaps,
  showsVerticalScrollIndicator,
  bounces,
}: BodyProps) {
  const { hasBottomTabs, hasFooter } = useContext(ScreenContext);
  const insets = useSafeAreaInsets();

  const bottomReserve = hasFooter
    ? 0
    : insets.bottom + (hasBottomTabs ? BOTTOM_TAB_BAR_HEIGHT : 0);

  if (scroll) {
    return (
      <ScrollView
        style={[styles.body, style]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomReserve },
          contentContainerStyle,
        ]}
        refreshControl={refreshControl}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        bounces={bounces}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.body, { paddingBottom: bottomReserve }, style]}>
      {children}
    </View>
  );
}

interface FooterProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

function ScreenFooter({ children, style }: FooterProps) {
  const { hasBottomTabs } = useContext(ScreenContext);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom:
            insets.bottom + (hasBottomTabs ? BOTTOM_TAB_BAR_HEIGHT : 16),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

Screen.Header = ScreenHeader;
Screen.Body = ScreenBody;
Screen.Footer = ScreenFooter;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    zIndex: 10,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
