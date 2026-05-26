export const NOTIFICATIONS = "notifications";

export const NOTIFICATION_KEYS = {
  all: [NOTIFICATIONS] as const,
  typeEnum: () => [...NOTIFICATION_KEYS.all, "type-enum"] as const,
};
