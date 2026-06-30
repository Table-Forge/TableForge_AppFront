import { z } from "zod";

export const ChatMessageSchema = z.object({
  id: z.number(),
  campaignId: z.number(),
  userId: z.number(),
  content: z.string(),
  username: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const ChatMessageCreateSchema = z.object({
  campaignId: z.coerce.number().min(1),
  userId: z.coerce.number().min(1),
  content: z.string().trim().min(1, "A mensagem é obrigatória."),
});

export type IChatMessage = z.infer<typeof ChatMessageSchema>;
export type IChatMessageCreate = z.infer<typeof ChatMessageCreateSchema>;
