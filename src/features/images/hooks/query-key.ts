export const IMAGES = "images";

export const IMAGE_KEYS = {
  all: [IMAGES] as const,
  typeEnum: () => [...IMAGE_KEYS.all, "type-enum"] as const,
  statusEnum: () => [...IMAGE_KEYS.all, "status-enum"] as const,
};
