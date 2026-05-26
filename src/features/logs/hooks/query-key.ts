export const LOGS = "logs";

export const LOG_KEYS = {
  all: [LOGS] as const,
  typeEnum: () => [...LOG_KEYS.all, "type-enum"] as const,
};
