import { z } from "zod";

export const CampaignSessionSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  campaignId: z.number(),
  campaignTitle: z.string().optional().nullable(),
  date: z.string(),
  title: z.string(),
  location: z.string(),
  link: z.string().optional(),
});

export const CampaignSessionCreateSchema = z.object({
  campaignId: z.coerce.number().min(1),
  date: z.string().trim().min(1, "A data é obrigatória."),
  title: z.string().trim().min(1, "O título é obrigatório."),
  location: z.string().trim().min(1, "O local é obrigatório."),
  link: z
    .string()
    .trim()
    .url("O link deve ser uma URL válida.")
    .or(z.literal(""))
    .optional(),
});

export type ICampaignSession = z.infer<typeof CampaignSessionSchema>;
export type ICampaignSessionList = ICampaignSession;
export type ICampaignSessionCreate = z.infer<
  typeof CampaignSessionCreateSchema
>;
