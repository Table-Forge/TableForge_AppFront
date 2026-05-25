import { z } from "zod";

export const CharacterSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  name: z.string(),
  classId: z.number(),
  className: z.string().optional().nullable(),
  raceId: z.number(),
  raceName: z.string().optional().nullable(),
  alignment: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  userId: z.number(),
  userUsername: z.string().optional().nullable(),
});

export const CharacterCreateSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório."),
  classId: z.coerce.number().min(1, "A classe é obrigatória."),
  raceId: z.coerce.number().min(1, "A raça é obrigatória."),
  alignment: z.string().trim().min(1, "O alinhamento é obrigatório."),
  bio: z.string().trim().min(1, "A história é obrigatória."),
  imageUrl: z.string().optional(),
  userId: z.coerce.number().min(1),
});

export type ICharacter = z.infer<typeof CharacterSchema>;
export type ICharacterCreateInput = z.input<typeof CharacterCreateSchema>;
export type ICharacterCreate = z.infer<typeof CharacterCreateSchema>;
