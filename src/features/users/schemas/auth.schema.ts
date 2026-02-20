import { UserSchema } from "@/src/features/users/schemas/user.schema";
import { z } from "zod";

export const LoginRequestSchema = z.object({
  login: z.string().trim().min(1, "O login é obrigatório"),
  password: z.string().trim().min(1, "A senha é obrigatória"),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string().optional(),
  user: UserSchema,
});

export type ILoginRequest = z.infer<typeof LoginRequestSchema>;
export type ILoginResponse = z.infer<typeof LoginResponseSchema>;
