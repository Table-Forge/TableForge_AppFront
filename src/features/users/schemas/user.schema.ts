import {
  dateOptional,
  dateRequired,
  emailRequired,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

const hasNoSpaces = (value: string) => !/\s/.test(value);

const usernameRequired = stringRequired.refine(
  hasNoSpaces,
  "O nome de usuário não pode conter espaços.",
);

const emailWithoutSpaces = emailRequired.refine(
  hasNoSpaces,
  "O e-mail não pode conter espaços.",
);

const passwordWithMinLength = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres")
  .refine(hasNoSpaces, "A senha não pode conter espaços.");

const BaseUserSchema = z.object({
  id: z.number().optional(),
  username: usernameRequired,
  nickname: stringRequired,
  email: emailWithoutSpaces,
  gender: z.string().optional(),
  birthDate: dateRequired,
  avatarUrl: z.string().optional(),
});

export const UserSchema = BaseUserSchema.extend({
  createdAt: dateOptional,
  password: passwordWithMinLength,
  confirmPassword: z.string().optional(),
  status: z.string().optional(),
}).superRefine((data, ctx) => {
  const confirmPassword = (data.confirmPassword ?? "").trim();

  if (!data.password) {
    ctx.addIssue({
      code: "custom",
      message: "A nova senha é obrigatória.",
      path: ["password"],
    });
  }

  if (confirmPassword && !hasNoSpaces(confirmPassword)) {
    ctx.addIssue({
      code: "custom",
      message: "A confirmação da senha não pode conter espaços.",
      path: ["confirmPassword"],
    });
  }

  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "As senhas devem ser iguais.",
      path: ["confirmPassword"],
    });
  }
});

export const UserUpdateSchema = BaseUserSchema.partial().extend({
  gender: stringRequired,
});

export const RecoverPasswordSchema = z.object({
  email: emailWithoutSpaces,
});

export const UpdatePasswordSchema = z
  .object({
    userId: z.number(),
    currentPassword: z
      .string()
      .min(1, "O segredo atual é obrigatório para sua segurança.")
      .refine(hasNoSpaces, "A senha não pode conter espaços."),
    newPassword: z
      .string()
      .min(6, "O novo segredo deve ter pelo menos 6 caracteres.")
      .refine(hasNoSpaces, "A senha não pode conter espaços."),
    confirmPassword: z
      .string()
      .min(1, "A confirmação do segredo é obrigatória.")
      .refine(hasNoSpaces, "A confirmação da senha não pode conter espaços."),
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
export type IUserUpdateInput = z.input<typeof UserUpdateSchema>;
export type IUserUpdateOutput = z.infer<typeof UserUpdateSchema>;
