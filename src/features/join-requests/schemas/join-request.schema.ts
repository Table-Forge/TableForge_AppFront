import { z } from "zod";

export const JoinRequestSchema = z.object({
  id: z.number(),
  campaignId: z.number(),
  userId: z.number(),
  characterId: z.number().optional().nullable(),
  status: z.string(),
  message: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
});

export const JoinRequestCreateSchema = z.object({
  campaignId: z.coerce.number().min(1),
  userId: z.coerce.number().min(1),
  characterId: z.coerce.number().optional().nullable(),
  message: z.string().optional(),
});

export const JoinRequestStatusUpdateSchema = z.object({
  id: z.coerce.number().min(1),
  status: z.string().trim().min(1),
});

export type IJoinRequest = z.infer<typeof JoinRequestSchema>;
export type IJoinRequestCreate = z.infer<typeof JoinRequestCreateSchema>;
export type IJoinRequestStatusUpdate = z.infer<
  typeof JoinRequestStatusUpdateSchema
>;
