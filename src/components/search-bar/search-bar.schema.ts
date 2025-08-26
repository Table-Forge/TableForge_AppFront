import { z } from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  level: z.array(z.string()).optional(),
  playerQty: z.number().min(1).optional(),
});

type ISearchSchema = z.infer<typeof searchSchema>;

export { searchSchema };

export type { ISearchSchema };
