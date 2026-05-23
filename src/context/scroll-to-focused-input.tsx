import React, { createContext, useCallback, useContext } from "react";
import { ScrollView, View, type NativeMethods } from "react-native";

const SCROLL_OFFSET = 90;

type ScrollTargetRef = React.RefObject<View | null>;

interface ScrollToFocusedInputContextValue {
  scrollToFocusedInput: (targetRef: ScrollTargetRef) => void;
}

const ScrollToFocusedInputContext =
  createContext<ScrollToFocusedInputContextValue>({
    scrollToFocusedInput: () => undefined,
  });

interface ScrollToFocusedInputProviderProps {
  children: React.ReactNode;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export function ScrollToFocusedInputProvider({
  children,
  scrollViewRef,
}: ScrollToFocusedInputProviderProps) {
  const scrollToFocusedInput = useCallback(
    (targetRef: ScrollTargetRef) => {
      requestAnimationFrame(() => {
        const scrollView = scrollViewRef.current;
        const target = targetRef.current;
        const scrollTarget =
          scrollView?.getNativeScrollRef?.() ?? scrollView?.getScrollableNode?.();

        if (!scrollView || !target || !scrollTarget) return;

        (target as unknown as NativeMethods).measureLayout(
          scrollTarget as unknown as NativeMethods,
          (_x, y) => {
            scrollView.scrollTo({
              y: Math.max(y - SCROLL_OFFSET, 0),
              animated: true,
            });
          },
          () => undefined,
        );
      });
    },
    [scrollViewRef],
  );

  return (
    <ScrollToFocusedInputContext.Provider value={{ scrollToFocusedInput }}>
      {children}
    </ScrollToFocusedInputContext.Provider>
  );
}

export function useScrollToFocusedInput() {
  return useContext(ScrollToFocusedInputContext);
}
