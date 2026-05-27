import { z } from "zod";

export const CampaignBlockedClassSchema = z.object({
  id: z.number(),
  campaignId: z.number(),
  classId: z.number(),
  className: z.string().optional().nullable(),
});

export const CampaignBlockedClassCreateSchema = z.object({
  campaignId: z.coerce.number().min(1),
  classIds: z.coerce.number().array(),
});

export type ICampaignBlockedClass = z.infer<
  typeof CampaignBlockedClassSchema
>;
export type ICampaignBlockedClassCreate = z.infer<
  typeof CampaignBlockedClassCreateSchema
>;
