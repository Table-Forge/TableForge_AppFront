import { UserService } from "@/src/features/users/services/users.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseUserTypeEnumProps {
  enabled?: boolean;
}

export const useUserTypeEnum = ({
  enabled = true,
}: IUseUserTypeEnumProps = {}) => {
  const userTypeEnumQuery = useQuery({
    queryKey: USER_KEYS.typeEnum(),
    queryFn: () => UserService.getTypeEnum(),
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
    userTypeEnum: (userTypeEnumQuery.data ?? []) as TOptions[],
    isLoadingUserTypeEnum: userTypeEnumQuery.isPending,
    userTypeEnumQuery,
  };
};
