import { useQuery, useQueryClient } from "@tanstack/react-query";

import { CHARACTERS } from "@/src/features/characters/hooks/query-key";
import { CharacterService } from "@/src/features/characters/services/characters.services";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { IPaginatedApiResponse } from "@/src/interfaces";

export function useCharacter(id?: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [CHARACTERS, id],
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return CharacterService.getById(id);
    },
    enabled: id !== undefined && !isNaN(id),
    placeholderData: () => {
      if (id === undefined) return undefined;

      const listQueries = queryClient.getQueriesData<
        IPaginatedApiResponse<ICharacter>
      >({
        queryKey: [CHARACTERS],
        exact: false,
      });

      for (const [, data] of listQueries) {
        const match = data?.items?.find((item) => item.id === id);
        if (match) return match;
      }

      return undefined;
    },
  });
}
