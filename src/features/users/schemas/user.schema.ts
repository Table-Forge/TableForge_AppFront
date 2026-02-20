import { dateOptional } from "@/src/utils/custom-schema-validations";
import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.number(),
    createdAt: dateOptional,
    username: z.string(),
    nickname: z.string(),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().optional(),
    status: z.string(),
    gender: z.string(),
    birthDate: z.string().transform((val) => new Date(val)),
  })
  .superRefine((data, ctx) => {
    if (!data.password) {
      ctx.addIssue({
        code: "custom",
        message: "A nova senha é obrigatória.",
        path: ["password"],
      });
    }

    if (!data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "A confirmação de senha é obrigatória.",
        path: ["confirmPassword"],
      });
    }

    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas devem ser iguais.",
        path: ["confirmPassword"],
      });
    }
  });

export const RecoverPasswordSchema = z.object({
  email: z.string().min(1, "O email é obrigatório"),
});

export type IUser = z.infer<typeof UserSchema>;
export type IRecoverPassword = z.infer<typeof RecoverPasswordSchema>;
