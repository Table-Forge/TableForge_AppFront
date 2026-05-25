import { useQuery } from "@tanstack/react-query";

import { NOTIFICATIONS } from "@/src/features/notifications/hooks/query-key";
import { NotificationService } from "@/src/features/notifications/services/notifications.services";
import { IGetPaginatedParams } from "@/src/interfaces";

type IUseNotificationsParams = IGetPaginatedParams & {
  enabled?: boolean;
  read?: boolean;
  userId?: number;
};

export function useNotifications({
  enabled = true,
  userId,
  ...filters
}: IUseNotificationsParams = {}) {
  return useQuery({
    queryKey: [NOTIFICATIONS, userId, filters],
    queryFn: async () => {
      if (userId === undefined) throw new Error("User ID is required");
      return NotificationService.getByUser({ userId, ...filters });
    },
    enabled: enabled && userId !== undefined && !isNaN(userId),
  });
}
