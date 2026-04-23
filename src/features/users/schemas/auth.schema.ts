import { UserSchema } from "@/src/features/users/schemas/user.schema";
import { emailRequired } from "@/src/utils/custom-schema-validations";
import { z } from "zod";

const hasNoSpaces = (value: string) => !/\s/.test(value);

export const LoginRequestSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, "O login é obrigatório")
    .refine(hasNoSpaces, "O login não pode conter espaços"),
  password: z
    .string()
    .trim()
    .min(1, "A senha é obrigatória")
    .refine(hasNoSpaces, "A senha não pode conter espaços"),
});

export const RECOVERY_CODE_LENGTH = 6;

export const PasswordRecoveryStepSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const PasswordRecoveryFormSchema = z
  .object({
    step: PasswordRecoveryStepSchema,
    email: emailRequired.refine(hasNoSpaces, "O e-mail não pode conter espaços"),
    code: z.string().trim().optional(),
    newPassword: z.string().trim().optional(),
  })
  .superRefine(({ step, code, newPassword }, ctx) => {
    const normalizedCode = (code ?? "").trim();
    const normalizedPassword = (newPassword ?? "").trim();

    if (step >= 2) {
      if (!normalizedCode) {
        ctx.addIssue({
          code: "custom",
          message: "Campo obrigatório.",
          path: ["code"],
        });
      } else if (!/^\d+$/.test(normalizedCode)) {
        ctx.addIssue({
          code: "custom",
          message: "O código deve conter apenas números.",
          path: ["code"],
        });
      } else if (normalizedCode.length !== RECOVERY_CODE_LENGTH) {
        ctx.addIssue({
          code: "custom",
          message: "Digite os 6 dígitos do código.",
          path: ["code"],
        });
      }
    }

    if (step >= 3) {
      if (!normalizedPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Campo obrigatório.",
          path: ["newPassword"],
        });
      } else if (!hasNoSpaces(normalizedPassword)) {
        ctx.addIssue({
          code: "custom",
          message: "A senha não pode conter espaços.",
          path: ["newPassword"],
        });
      } else if (normalizedPassword.length < 6) {
        ctx.addIssue({
          code: "custom",
          message: "A senha deve ter ao menos 6 caracteres.",
          path: ["newPassword"],
        });
      }
    }
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
export type IPasswordRecoveryForm = z.infer<typeof PasswordRecoveryFormSchema>;
