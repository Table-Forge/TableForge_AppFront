import { z } from "zod";

export const CampaignPlayerSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  avatar: z.string(),
});

export const SessionScheduleSchema = z.object({
  day: z.string(),
  time: z.string(),
});

export const CampaignSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: z.string(),
  system: z.string(),
  gameMaster: z.string(),
  location: z.string(),
  level: z.string(),
  summary: z.string(),
  fullDescription: z.string(),
  currentPartySize: z.number(),
  maxPartySize: z.number(),
  players: CampaignPlayerSchema.array().optional(),
  frequency: z.string().optional(),
  nextSession: SessionScheduleSchema.optional(),
});

export const CampaignCreateSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório."),
  description: z.string().trim().min(1, "A descrição é obrigatória."),
  difficulty: z.string().trim().min(1, "A dificuldade é obrigatória."),
  playersLimit: z.coerce
    .number()
    .min(1, "Informe pelo menos 1 jogador."),
  status: z.string().trim().min(1, "O status é obrigatório."),
  isPrivate: z.coerce.boolean(),
  isChatEnabled: z.coerce.boolean(),
  creatorId: z.coerce.number().min(0),
  locationId: z.coerce.number().min(0),
  bannerId: z.coerce.number().min(0),
  gameSystemId: z.coerce.number().min(0),
});

export type ICampaign = z.infer<typeof CampaignSchema>;
export type ICampaignCreateInput = z.input<typeof CampaignCreateSchema>;
export type ICampaignCreate = z.infer<typeof CampaignCreateSchema>;
export type IPlayer = z.infer<typeof CampaignPlayerSchema>;
export type ISessionSchedule = z.infer<typeof SessionScheduleSchema>;
