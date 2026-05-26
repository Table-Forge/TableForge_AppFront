import { UserService } from "@/src/features/users/services/users.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { USER_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseUserDeliveryMethodEnumProps {
  enabled?: boolean;
}

export const useUserDeliveryMethodEnum = ({
  enabled = true,
}: IUseUserDeliveryMethodEnumProps = {}) => {
  const userDeliveryMethodEnumQuery = useQuery({
    queryKey: USER_KEYS.deliveryMethodEnum(),
    queryFn: () => UserService.getDeliveryMethodEnum(),
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
    userDeliveryMethodEnum: (userDeliveryMethodEnumQuery.data ??
      []) as TOptions[],
    isLoadingUserDeliveryMethodEnum: userDeliveryMethodEnumQuery.isPending,
    userDeliveryMethodEnumQuery,
  };
};
