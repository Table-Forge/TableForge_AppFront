import { UserService } from "@/src/features/users/services/users.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseUserGenderEnumProps {
  enabled?: boolean;
}

export const useUserGenderEnum = ({
  enabled = true,
}: IUseUserGenderEnumProps = {}) => {
  const userGenderEnumQuery = useQuery({
    queryKey: USER_KEYS.genderEnum(),
    queryFn: () => UserService.getGenderEnum(),
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
    userGenderEnum: (userGenderEnumQuery.data ?? []) as TOptions[],
    isLoadingUserGenderEnum: userGenderEnumQuery.isPending,
    userGenderEnumQuery,
  };
};
