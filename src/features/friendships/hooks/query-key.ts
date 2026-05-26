export const FRIENDSHIPS = "friendships";

export const FRIENDSHIP_KEYS = {
  all: [FRIENDSHIPS] as const,
  statusEnum: () => [...FRIENDSHIP_KEYS.all, "status-enum"] as const,
};
