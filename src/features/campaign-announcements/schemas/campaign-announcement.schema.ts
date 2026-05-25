import { z } from "zod";

export const CampaignAnnouncementSchema = z.object({
  id: z.number(),
  campaignId: z.number(),
  title: z.string(),
  content: z.string(),
  date: z.string(),
});

export const CampaignAnnouncementCreateSchema = z.object({
  campaignId: z.coerce.number().min(1),
  title: z.string().trim().min(1, "O título é obrigatório."),
  content: z.string().trim().min(1, "O conteúdo é obrigatório."),
  date: z.string().trim().min(1, "A data é obrigatória."),
});

export type ICampaignAnnouncement = z.infer<
  typeof CampaignAnnouncementSchema
>;
export type ICampaignAnnouncementCreate = z.infer<
  typeof CampaignAnnouncementCreateSchema
>;
