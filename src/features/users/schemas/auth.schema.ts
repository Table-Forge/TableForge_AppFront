import { UserSchema } from "@/src/features/users/schemas/user.schema";
import { z } from "zod";

export const LoginRequestSchema = z.object({
  login: z.string().trim().min(1, "O login é obrigatório"),
  password: z.string().trim().min(1, "A senha é obrigatória"),
});

export const TokenResponse = z.object({
  type: z.string(),
  value: z.string(),
  expiration: z.string().transform((val) => new Date(val)),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: TokenResponse,
});

export type ILoginRequest = z.infer<typeof LoginRequestSchema>;
export type ILoginResponse = z.infer<typeof LoginResponseSchema>;
