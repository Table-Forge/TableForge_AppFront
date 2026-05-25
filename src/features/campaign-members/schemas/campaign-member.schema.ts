import { z } from "zod";

export const CampaignMemberSchema = z.object({
  id: z.number(),
  campaignId: z.number(),
  userId: z.number(),
  characterId: z.number().optional().nullable(),
  role: z.string(),
  username: z.string().optional().nullable(),
  characterName: z.string().optional().nullable(),
  className: z.string().optional().nullable(),
  raceName: z.string().optional().nullable(),
  characterImageUrl: z.string().optional().nullable(),
});

export const CampaignMemberCreateSchema = z.object({
  campaignId: z.coerce.number().min(1),
  userId: z.coerce.number().min(1),
  characterId: z.coerce.number().optional().nullable(),
  role: z.string().trim().min(1),
});

export type ICampaignMember = z.infer<typeof CampaignMemberSchema>;
export type ICampaignMemberCreate = z.infer<typeof CampaignMemberCreateSchema>;
