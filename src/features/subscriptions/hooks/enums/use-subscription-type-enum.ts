import { SubscriptionService } from "@/src/features/subscriptions/services/subscriptions.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { SUBSCRIPTION_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseSubscriptionTypeEnumProps {
  enabled?: boolean;
}

export const useSubscriptionTypeEnum = ({
  enabled = true,
}: IUseSubscriptionTypeEnumProps = {}) => {
  const subscriptionTypeEnumQuery = useQuery({
    queryKey: SUBSCRIPTION_KEYS.typeEnum(),
    queryFn: () => SubscriptionService.getTypeEnum(),
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
    subscriptionTypeEnum: (subscriptionTypeEnumQuery.data ??
      []) as TOptions[],
    isLoadingSubscriptionTypeEnum: subscriptionTypeEnumQuery.isPending,
    subscriptionTypeEnumQuery,
  };
};
