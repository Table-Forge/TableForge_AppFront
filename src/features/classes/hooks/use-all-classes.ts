import { ClassService } from "@/src/features/classes/services/classes.services";
import { IGetPaginatedParams } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { CLASS_KEYS } from "./query-key";

type IUseAllClassesParams = IGetPaginatedParams & {
  enabled?: boolean;
};

export const useAllClasses = ({
  enabled = true,
  ...filters
}: IUseAllClassesParams = {}) =>
  useQuery({
    queryKey: CLASS_KEYS.list(filters),
    queryFn: () => ClassService.getAll(filters),
    enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
