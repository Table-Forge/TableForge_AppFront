export const USER = "user";

export const USER_KEYS = {
  all: [USER] as const,
  byId: (id: number) => [...USER_KEYS.all, id] as const,
  genderEnum: () => [...USER_KEYS.all, "gender-enum"] as const,
  statusEnum: () => [...USER_KEYS.all, "status-enum"] as const,
  deliveryMethodEnum: () =>
    [...USER_KEYS.all, "delivery-method-enum"] as const,
  typeEnum: () => [...USER_KEYS.all, "type-enum"] as const,
};
