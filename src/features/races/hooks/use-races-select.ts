import { TOptions } from "@/src/interfaces";
import { useMemo } from "react";
import { useAllRaces } from "./use-all-races";

interface IUseRacesSelectParams {
  enabled?: boolean;
}

export const useRacesSelect = ({
  enabled = true,
}: IUseRacesSelectParams = {}) => {
  const racesQuery = useAllRaces({
    page: 1,
    size: 100,
    enabled,
  });

  const raceOptions = useMemo<TOptions[]>(
    () =>
      (racesQuery.data?.items ?? []).map((race) => ({
        value: race.id,
        name: race.name,
      })),
    [racesQuery.data?.items],
  );

  return {
    raceOptions,
    isLoadingRacesSelect: racesQuery.isPending,
    racesQuery,
  };
};
