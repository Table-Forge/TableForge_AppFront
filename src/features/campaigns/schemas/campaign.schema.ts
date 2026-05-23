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

const RequiredCoordinateSchema = (
  message: string,
  min: number,
  max: number,
  validMessage: string,
) =>
  z
    .union([z.string().trim().min(1, message), z.number()])
    .transform((value, context) => {
      const coordinate = Number(value);

      if (!Number.isFinite(coordinate)) {
        context.addIssue({
          code: "custom",
          message: validMessage,
        });

        return z.NEVER;
      }

      return coordinate;
    })
    .refine((value) => value >= min && value <= max, validMessage);

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
  playersLimit: z.coerce.number().min(1, "Informe pelo menos 1 jogador."),
  status: z.string().trim().min(1, "O status é obrigatório."),
  isPrivate: z.coerce.boolean(),
  chatEnabled: z.coerce.boolean(),
  creatorId: z.coerce.number().min(0),
  bannerId: z.coerce.number().min(0),
  gameSystemId: z.coerce.number().min(0),
  locationName: z.string().trim().min(1, "O nome do local é obrigatório."),
  address: z.string().trim().min(1, "O endereço é obrigatório."),
  latitude: RequiredCoordinateSchema(
    "A latitude é obrigatória.",
    -90,
    90,
    "Informe uma latitude válida.",
  ),
  longitude: RequiredCoordinateSchema(
    "A longitude é obrigatória.",
    -180,
    180,
    "Informe uma longitude válida.",
  ),
  creationLatitude: z.coerce.number(),
  creationLongitude: z.coerce.number(),
});

export type ICampaign = z.infer<typeof CampaignSchema>;
export type ICampaignCreateInput = z.input<typeof CampaignCreateSchema>;
export type ICampaignCreate = z.infer<typeof CampaignCreateSchema>;
export type IPlayer = z.infer<typeof CampaignPlayerSchema>;
export type ISessionSchedule = z.infer<typeof SessionScheduleSchema>;
