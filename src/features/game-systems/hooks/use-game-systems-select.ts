import { TOptions } from "@/src/interfaces";
import { useMemo } from "react";
import { useAllGameSystems } from "./use-all-game-systems";

interface IUseGameSystemsSelectParams {
  enabled?: boolean;
}

export const useGameSystemsSelect = ({
  enabled = true,
}: IUseGameSystemsSelectParams = {}) => {
  const gameSystemsQuery = useAllGameSystems({
    page: 1,
    size: 100,
    enabled,
  });

  const gameSystemOptions = useMemo<TOptions[]>(
    () =>
      (gameSystemsQuery.data?.items ?? []).map((gameSystem) => ({
        value: gameSystem.id,
        name: gameSystem.name || `Sistema ${gameSystem.id ?? ""}`,
      })),
    [gameSystemsQuery.data?.items],
  );

  return {
    gameSystemOptions,
    isLoadingGameSystemsSelect: gameSystemsQuery.isPending,
    gameSystemsQuery,
  };
};
