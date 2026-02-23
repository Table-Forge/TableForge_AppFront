import { useRouter } from "expo-router";
import { useCallback } from "react";

export const useBackRouter = () => {
  const router = useRouter();

  const handleBack = useCallback(
    (fallbackRoute: string = "/") => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(fallbackRoute as any);
      }
    },
    [router],
  );

  return {
    handleBack,
    canGoBack: router.canGoBack(),
    router,
  };
};
