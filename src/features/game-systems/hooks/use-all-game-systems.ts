import { GameSystemService } from "@/src/features/game-systems/services/game-systems.services";
import { IGetPaginatedParams } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { GAME_SYSTEM_KEYS } from "./query-key";

type IUseAllGameSystemsParams = IGetPaginatedParams & {
  enabled?: boolean;
};

export const useAllGameSystems = ({
  enabled = true,
  ...filters
}: IUseAllGameSystemsParams = {}) =>
  useQuery({
    queryKey: GAME_SYSTEM_KEYS.list(filters),
    queryFn: () => GameSystemService.getAll(filters),
    enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
