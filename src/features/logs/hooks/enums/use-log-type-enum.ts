import { LogService } from "@/src/features/logs/services/logs.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { LOG_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseLogTypeEnumProps {
  enabled?: boolean;
}

export const useLogTypeEnum = ({
  enabled = true,
}: IUseLogTypeEnumProps = {}) => {
  const logTypeEnumQuery = useQuery({
    queryKey: LOG_KEYS.typeEnum(),
    queryFn: () => LogService.getTypeEnum(),
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
    logTypeEnum: (logTypeEnumQuery.data ?? []) as TOptions[],
    isLoadingLogTypeEnum: logTypeEnumQuery.isPending,
    logTypeEnumQuery,
  };
};
