import { z } from "zod";

export const CampaignBlockedRaceSchema = z.object({
  id: z.number(),
  campaignId: z.number(),
  raceId: z.number(),
  raceName: z.string().optional().nullable(),
});

export const CampaignBlockedRaceCreateSchema = z.object({
  campaignId: z.coerce.number().min(1),
  raceIds: z.coerce.number().array(),
});

export type ICampaignBlockedRace = z.infer<typeof CampaignBlockedRaceSchema>;
export type ICampaignBlockedRaceCreate = z.infer<
  typeof CampaignBlockedRaceCreateSchema
>;
