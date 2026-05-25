import { useQuery } from "@tanstack/react-query";

import { CHARACTERS } from "@/src/features/characters/hooks/query-key";
import { CharacterService } from "@/src/features/characters/services/characters.services";
import { IGetPaginatedParams } from "@/src/interfaces";

type IUseCharactersParams = IGetPaginatedParams & {
  enabled?: boolean;
};

export function useCharacters({
  enabled = true,
  ...filters
}: IUseCharactersParams = {}) {
  return useQuery({
    queryKey: [CHARACTERS, filters],
    queryFn: () => CharacterService.getPaginated(filters),
    enabled,
  });
}
