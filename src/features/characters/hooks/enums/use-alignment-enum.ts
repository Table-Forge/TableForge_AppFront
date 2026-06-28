import { CharacterService } from "@/src/features/characters/services/characters.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { CHARACTER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseAlignmentEnumProps {
  enabled?: boolean;
}

export const useAlignmentEnum = ({
  enabled = true,
}: IUseAlignmentEnumProps = {}) => {
  const alignmentEnumQuery = useQuery({
    queryKey: CHARACTER_KEYS.alignmentEnum(),
    queryFn: () => CharacterService.getAlignmentEnum(),
    select: (data) =>
      data.map((item) => ({
        name: item.name,
        value: item.value,
      })),
    enabled,
    staleTime: Infinity,
    gcTime: ENUM_GC_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    alignmentOptions: (alignmentEnumQuery.data ?? []) as TOptions[],
    isLoadingAlignmentEnum: alignmentEnumQuery.isPending,
    alignmentEnumQuery,
  };
};
