import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { useSegments } from "expo-router";
import {
  ImageBackground,
  ImageSourcePropType,
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

import { DEFAULT_COLORS } from "@/src/theme/colors";

const BOTTOM_TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 74;

type ScreenContextValue = {
  hasBottomTabs: boolean;
  hasFooter: boolean;
};

const ScreenContext = React.createContext<ScreenContextValue>({
  hasBottomTabs: false,
  hasFooter: false,
});

interface ScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  /**
   * Envolve o conteúdo num KeyboardAvoidingView (padding/height por plataforma).
   */
  keyboardAware?: boolean;
}

export function Screen({
  children,
  style,
  keyboardAware = false,
}: ScreenProps) {
  const segments = useSegments();
  const hasBottomTabs = segments[0] === "(tabs)";

  const hasFooter = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) && (child.type as any) === ScreenFooter,
  );

  const ctx = useMemo<ScreenContextValue>(
    () => ({ hasBottomTabs, hasFooter }),
    [hasBottomTabs, hasFooter],
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
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, style, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
}

interface HeaderBannerProps extends PropsWithChildren {
  /**
   * Imagem de fundo do banner. Se ausente, renderiza só o background color.
   */
  source?: ImageSourcePropType;
  /** Altura do banner. */
  height?: number;
  /** Dark overlay sobre a imagem pra contraste. Default true. */
  scrim?: boolean;
  /**
   * Conteúdo flutuando no topo do banner (ex.: HeaderActions com back button).
   * Recebe paddingTop = safe-area-top automaticamente.
   */
  actions?: ReactNode;
  /** Cor de fundo quando não tem imagem (ou enquanto carrega). */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

function ScreenHeaderBanner({
  source,
  height,
  scrim = true,
  actions,
  backgroundColor,
  children,
  style,
}: HeaderBannerProps) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={source}
      style={[
        styles.banner,
        height !== undefined && { height },
        backgroundColor !== undefined && { backgroundColor },
        style,
      ]}
    >
      {scrim && <View style={styles.bannerScrim} />}
      {actions && (
        <View style={[styles.bannerActions, { paddingTop: insets.top }]}>
          {actions}
        </View>
      )}
      {children}
    </ImageBackground>
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
Screen.HeaderBanner = ScreenHeaderBanner;
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
  banner: {
    width: "100%",
    justifyContent: "space-between",
  },
  bannerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DEFAULT_COLORS.overlayDark_45,
  },
  bannerActions: {
    zIndex: 10,
  },
});
