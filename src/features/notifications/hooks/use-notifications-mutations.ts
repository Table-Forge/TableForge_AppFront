import { useMutation, useQueryClient } from "@tanstack/react-query";

import { NOTIFICATION_KEYS } from "@/src/features/notifications/hooks/query-key";
import {
  INotificationCreate,
  INotificationUpdate,
} from "@/src/features/notifications/schemas/notification.schema";
import { NotificationService } from "@/src/features/notifications/services/notifications.services";

export const useNotificationsMutation = () => {
  const queryClient = useQueryClient();

  const invalidateNotifications = () =>
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });

  const createNotificationMutation = useMutation({
    mutationFn: (payload: INotificationCreate) =>
      NotificationService.create(payload),
    onSuccess: invalidateNotifications,
  });

  const updateNotificationMutation = useMutation({
    mutationFn: (payload: INotificationUpdate) =>
      NotificationService.update(payload),
    onSuccess: invalidateNotifications,
  });

  const markNotificationAsReadMutation = useMutation({
    mutationFn: (id: number) => NotificationService.markAsRead(id),
    onSuccess: invalidateNotifications,
  });

  const markAllNotificationsAsReadMutation = useMutation({
    mutationFn: (userId: number) => NotificationService.markAllAsRead(userId),
    onSuccess: invalidateNotifications,
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => NotificationService.delete(id),
    onSuccess: invalidateNotifications,
  });

  return {
    createNotificationMutation,
    updateNotificationMutation,
    markNotificationAsReadMutation,
    markAllNotificationsAsReadMutation,
    deleteNotificationMutation,
    isCreatingNotification: createNotificationMutation.isPending,
    isUpdatingNotification: updateNotificationMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};
