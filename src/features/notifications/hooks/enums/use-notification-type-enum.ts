import { NotificationService } from "@/src/features/notifications/services/notifications.services";
import { TOptions } from "@/src/interfaces";
import { useQuery } from "@tanstack/react-query";
import { NOTIFICATION_KEYS } from "../query-key";

const ENUM_GC_TIME = 1000 * 60 * 60 * 24;

interface IUseNotificationTypeEnumProps {
  enabled?: boolean;
}

export const useNotificationTypeEnum = ({
  enabled = true,
}: IUseNotificationTypeEnumProps = {}) => {
  const notificationTypeEnumQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.typeEnum(),
    queryFn: () => NotificationService.getTypeEnum(),
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
    notificationTypeEnum: (notificationTypeEnumQuery.data ?? []) as TOptions[],
    isLoadingNotificationTypeEnum: notificationTypeEnumQuery.isPending,
    notificationTypeEnumQuery,
  };
};
