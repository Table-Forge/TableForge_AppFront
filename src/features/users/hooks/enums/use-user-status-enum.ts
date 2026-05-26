import { UserService } from "@/src/features/users/services/users.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseUserStatusEnumProps {
  enabled?: boolean;
}

export const useUserStatusEnum = ({
  enabled = true,
}: IUseUserStatusEnumProps = {}) => {
  const userStatusEnumQuery = useQuery({
    queryKey: USER_KEYS.statusEnum(),
    queryFn: () => UserService.getStatusEnum(),
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
    userStatusEnum: (userStatusEnumQuery.data ?? []) as TOptions[],
    isLoadingUserStatusEnum: userStatusEnumQuery.isPending,
    userStatusEnumQuery,
  };
};
