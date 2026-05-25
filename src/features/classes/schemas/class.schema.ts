import { z } from "zod";

export const ClassSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

export type IClass = z.infer<typeof ClassSchema>;
