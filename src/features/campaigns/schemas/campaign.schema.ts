import { z } from "zod";

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

const CampaignBlockedClassSchema = z.object({
  classId: z.number(),
});

const CampaignBlockedRaceSchema = z.object({
  raceId: z.number(),
});

export const CampaignSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  difficulty: z.string(),
  playersLimit: z.number(),
  status: z.string(),
  isPrivate: z.boolean(),
  isChatEnabled: z.boolean().optional(),
  creatorId: z.number(),
  creatorUsername: z.string().optional(),
  locationName: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  creationLatitude: z.number().optional(),
  creationLongitude: z.number().optional(),
  blockedClasses: CampaignBlockedClassSchema.array().optional(),
  blockedRaces: CampaignBlockedRaceSchema.array().optional(),
  bannerId: z.number().optional().nullable(),
  bannerUrl: z.string().optional(),
  gameSystemId: z.number().optional().nullable(),
  gameSystemName: z.string().optional().nullable(),
});

export const CampaignCreateSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório."),
  description: z.string().trim().min(1, "A descrição é obrigatória."),
  difficulty: z.string().trim().min(1, "A dificuldade é obrigatória."),
  playersLimit: z.coerce.number().min(1, "Informe pelo menos 1 jogador."),
  status: z.string().trim().min(1, "O status é obrigatório."),
  isPrivate: z.coerce.boolean(),
  isChatEnabled: z.coerce.boolean(),
  creatorId: z.coerce.number().min(0),
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
  blockedClasses: CampaignBlockedClassSchema.array(),
  blockedRaces: CampaignBlockedRaceSchema.array(),
  bannerId: z.coerce.number().min(0),
  gameSystemId: z.coerce.number().min(0),
});

export type ICampaign = z.infer<typeof CampaignSchema>;
export type ICampaignCreateInput = z.input<typeof CampaignCreateSchema>;
export type ICampaignCreate = z.infer<typeof CampaignCreateSchema>;

export type CampaignRelationshipValue =
  | "None"
  | "Creator"
  | "Member"
  | "Requested"
  | "Available";

export type ICampaignPlayer = ICampaign & {
  userRelationship: CampaignRelationshipValue;
};
