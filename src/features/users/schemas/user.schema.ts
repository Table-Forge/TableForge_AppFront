import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  createdAt: z.string().transform((val) => new Date(val)), 
  username: z.string(),
  nickname: z.string(),
  email: z.string().email("E-mail inválido"),
  status: z.string(),
  gender: z.string(),
  birthDate: z.string().transform((val) => new Date(val)),
});

export type IUser = z.infer<typeof UserSchema>;