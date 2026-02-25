import { dateOptional } from "@/src/utils/custom-schema-validations";
import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.number().optional(),
    createdAt: dateOptional,
    username: z.string(),
    nickname: z.string(),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().optional(),
    status: z.string().optional(),
    gender: z.string().optional(),
    birthDate: z.string().transform((val) => new Date(val)),
    avatarUrl: z.union([z.string()]).optional(),
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
  email: z
    .string()
    .min(1, "Somos nerds, mas não videntes. O e-mail é obrigatório."),
});

export const UpdatePasswordSchema = z
  .object({
    userId: z.number(),
    currentPassword: z
      .string()
      .min(1, "O segredo atual é obrigatório para sua segurança."),
    newPassword: z
      .string()
      .min(6, "O novo segredo deve ter pelo menos 6 caracteres."),
    confirmPassword: z
      .string()
      .min(1, "A confirmação do segredo é obrigatória."),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Os novos segredos não coincidem!",
        path: ["confirmPassword"],
      });
    }
  });

export type IUser = z.infer<typeof UserSchema>;
export type IRecoverPassword = z.infer<typeof RecoverPasswordSchema>;
export type IUpdatePassword = z.infer<typeof UpdatePasswordSchema>;
