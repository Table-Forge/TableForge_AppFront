export const CHARACTERS = "CHARACTERS";

export const CHARACTER_KEYS = {
  all: [CHARACTERS] as const,
  byUser: (userId: number) => [...CHARACTER_KEYS.all, { userId }] as const,
  byId: (id: number) => [...CHARACTER_KEYS.all, id] as const,
  alignmentEnum: () => [...CHARACTER_KEYS.all, "enums", "alignment"] as const,
};
