import { z } from "zod";

export const RaceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

export type IRace = z.infer<typeof RaceSchema>;
