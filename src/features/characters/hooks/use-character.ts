import { useQuery } from "@tanstack/react-query";

import { CHARACTERS } from "@/src/features/characters/hooks/query-key";
import { CharacterService } from "@/src/features/characters/services/characters.services";

export function useCharacter(id?: number) {
  return useQuery({
    queryKey: [CHARACTERS, id],
    queryFn: async () => {
      if (id === undefined) throw new Error("ID is required");
      return CharacterService.getById(id);
    },
    enabled: id !== undefined && !isNaN(id),
  });
}
