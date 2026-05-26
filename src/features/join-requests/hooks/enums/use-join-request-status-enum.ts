import { TOptions } from "@/src/interfaces";
import { JoinRequestService } from "@/src/features/join-requests/services/join-requests.services";
import { useQuery } from "@tanstack/react-query";
import { JOIN_REQUEST_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseJoinRequestStatusEnumProps {
  enabled?: boolean;
}

export const useJoinRequestStatusEnum = ({
  enabled = true,
}: IUseJoinRequestStatusEnumProps = {}) => {
  const joinRequestStatusEnumQuery = useQuery({
    queryKey: JOIN_REQUEST_KEYS.statusEnum(),
    queryFn: () => JoinRequestService.getStatusEnum(),
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
    joinRequestStatusEnum: (joinRequestStatusEnumQuery.data ??
      []) as TOptions[],
    isLoadingJoinRequestStatusEnum: joinRequestStatusEnumQuery.isPending,
    joinRequestStatusEnumQuery,
  };
};
