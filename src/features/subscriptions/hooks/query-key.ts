export const SUBSCRIPTIONS = "subscriptions";

export const SUBSCRIPTION_KEYS = {
  all: [SUBSCRIPTIONS] as const,
  typeEnum: () => [...SUBSCRIPTION_KEYS.all, "type-enum"] as const,
};
