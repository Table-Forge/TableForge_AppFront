import { RaceService } from "@/src/features/races/services/races.services";
import { IGetPaginatedParams } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { RACE_KEYS } from "./query-key";

type IUseAllRacesParams = IGetPaginatedParams & {
  enabled?: boolean;
};

export const useAllRaces = ({
  enabled = true,
  ...filters
}: IUseAllRacesParams = {}) =>
  useQuery({
    queryKey: RACE_KEYS.list(filters),
    queryFn: () => RaceService.getAll(filters),
    enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
